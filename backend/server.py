from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get('JWT_SECRET', 'astoria_secret_key')
JWT_ALGORITHM = "HS256"
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    agency_name: str
    contact_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    agency_name: str
    contact_name: str
    subscription_status: str = "none"
    subscription_plan: Optional[str] = None
    integration_key: Optional[str] = None
    onboarding_completed: bool = False
    onboarding_step: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    project_type: str
    property_type: str
    city: str
    budget: str
    deadline: str
    message: str
    score: str
    conversation_history: List[Dict[str, str]] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    session_id: str
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    is_complete: bool = False
    lead_data: Optional[Dict[str, Any]] = None

class OnboardingUpdate(BaseModel):
    step: int
    completed: bool = False

class CustomQuestion(BaseModel):
    key: str
    question: str
    order: int

class CustomQuestionsUpdate(BaseModel):
    questions: List[CustomQuestion]

class SubscriptionRequest(BaseModel):
    plan: str
    origin_url: str

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    amount: float
    currency: str
    plan: str
    payment_status: str = "pending"
    status: str = "initiated"
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Non authentifié")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return User(**user_doc)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

def generate_integration_key():
    return f"astoria_{uuid.uuid4().hex[:24]}"

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email existe déjà")
    
    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        email=user_data.email,
        agency_name=user_data.agency_name,
        contact_name=user_data.contact_name,
        integration_key=generate_integration_key(),
        onboarding_completed=False,
        onboarding_step=0
    )
    user_dict = user.model_dump()
    user_dict['password'] = hashed_password
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    token = create_access_token({"user_id": user.id})
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc or not pwd_context.verify(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    user = User(**{k: v for k, v in user_doc.items() if k != 'password'})
    token = create_access_token({"user_id": user.id})
    return {"token": token, "user": user}

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.put("/user/onboarding")
async def update_onboarding(
    data: OnboardingUpdate,
    current_user: User = Depends(get_current_user)
):
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"onboarding_step": data.step, "onboarding_completed": data.completed}}
    )
    return {"success": True, "step": data.step, "completed": data.completed}

@api_router.post("/user/regenerate-key")
async def regenerate_integration_key(current_user: User = Depends(get_current_user)):
    new_key = generate_integration_key()
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"integration_key": new_key}}
    )
    return {"integration_key": new_key}

@api_router.post("/chat", response_model=ChatResponse)
async def chat(msg: ChatMessage):
    session_id = msg.session_id
    user_message = msg.message.strip()
    
    conversation_doc = await db.conversations.find_one({"session_id": session_id}, {"_id": 0})
    
    if not conversation_doc:
        conversation_doc = {
            "session_id": session_id,
            "user_id": msg.user_id,
            "messages": [],
            "lead_data": {},
            "current_step": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    
    steps = [
        {"key": "first_name", "question": "Bonjour ! Je suis l'assistant virtuel d'Astoria Mandat IA. Pour mieux vous accompagner, puis-je connaître votre prénom ?"},
        {"key": "last_name", "question": "Merci {first_name} ! Et votre nom de famille ?"},
        {"key": "project_type", "question": "Parfait ! Quel est votre projet immobilier ? (Achat, Vente, Terrain, Information)"},
        {"key": "property_type", "question": "Quel type de bien vous intéresse ? (Appartement, Maison, Terrain, Commercial, etc.)"},
        {"key": "city", "question": "Dans quelle ville ou secteur recherchez-vous ?"},
        {"key": "budget", "question": "Quel est votre budget approximatif ?"},
        {"key": "deadline", "question": "Dans quel délai souhaitez-vous concrétiser ce projet ?"},
        {"key": "email", "question": "Pour vous envoyer des propositions personnalisées, quelle est votre adresse email ?"},
        {"key": "phone", "question": "Et votre numéro de téléphone pour être contacté rapidement ?"},
        {"key": "message", "question": "Avez-vous des précisions ou des souhaits particuliers à nous communiquer ?"}
    ]
    
    current_step = conversation_doc.get("current_step", 0)
    lead_data = conversation_doc.get("lead_data", {})
    
    if current_step > 0:
        prev_key = steps[current_step - 1]["key"]
        lead_data[prev_key] = user_message
    
    conversation_doc["messages"].append({"role": "user", "content": user_message})
    
    if current_step >= len(steps):
        score = "🔥 Chaud"
        if "délai" in lead_data.get("deadline", "").lower():
            if "6 mois" in lead_data["deadline"] or "6mois" in lead_data["deadline"]:
                score = "🟡 Tiède"
            elif "an" in lead_data["deadline"] or "année" in lead_data["deadline"]:
                score = "❄️ Froid"
        
        final_response = f"Merci {lead_data.get('first_name', '')} ! Votre demande a bien été enregistrée. Un de nos conseillers vous contactera très prochainement. Votre profil : {score}"
        
        conversation_doc["messages"].append({"role": "assistant", "content": final_response})
        conversation_doc["lead_data"] = lead_data
        conversation_doc["score"] = score
        conversation_doc["completed"] = True
        
        await db.conversations.update_one(
            {"session_id": session_id},
            {"$set": conversation_doc},
            upsert=True
        )
        
        if msg.user_id:
            lead = Lead(
                user_id=msg.user_id,
                first_name=lead_data.get("first_name", ""),
                last_name=lead_data.get("last_name", ""),
                email=lead_data.get("email", ""),
                phone=lead_data.get("phone", ""),
                project_type=lead_data.get("project_type", ""),
                property_type=lead_data.get("property_type", ""),
                city=lead_data.get("city", ""),
                budget=lead_data.get("budget", ""),
                deadline=lead_data.get("deadline", ""),
                message=lead_data.get("message", ""),
                score=score,
                conversation_history=conversation_doc["messages"]
            )
            lead_dict = lead.model_dump()
            lead_dict['created_at'] = lead_dict['created_at'].isoformat()
            await db.leads.insert_one(lead_dict)
        
        return ChatResponse(
            response=final_response,
            is_complete=True,
            lead_data=lead_data
        )
    
    next_question = steps[current_step]["question"]
    if "{first_name}" in next_question and "first_name" in lead_data:
        next_question = next_question.format(first_name=lead_data["first_name"])
    
    conversation_doc["messages"].append({"role": "assistant", "content": next_question})
    conversation_doc["current_step"] = current_step + 1
    conversation_doc["lead_data"] = lead_data
    
    await db.conversations.update_one(
        {"session_id": session_id},
        {"$set": conversation_doc},
        upsert=True
    )
    
    return ChatResponse(response=next_question, is_complete=False)

@api_router.get("/leads")
async def get_leads(current_user: User = Depends(get_current_user)):
    leads = await db.leads.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

@api_router.post("/subscriptions/create-checkout")
async def create_subscription_checkout(
    request: SubscriptionRequest,
    current_user: User = Depends(get_current_user)
):
    PLANS = {
        "standard": {"amount": 199.0, "name": "Standard"},
        "premium": {"amount": 349.0, "name": "Premium"},
        "ultra": {"amount": 499.0, "name": "Ultra-Premium"}
    }
    
    if request.plan not in PLANS:
        raise HTTPException(status_code=400, detail="Plan invalide")
    
    plan_info = PLANS[request.plan]
    amount = plan_info["amount"]
    
    success_url = f"{request.origin_url}/dashboard?session_id={{{{CHECKOUT_SESSION_ID}}}}"
    cancel_url = f"{request.origin_url}/dashboard"
    
    host_url = request.origin_url
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user.id,
            "plan": request.plan,
            "agency_name": current_user.agency_name
        }
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    transaction = PaymentTransaction(
        user_id=current_user.id,
        session_id=session.session_id,
        amount=amount,
        currency="eur",
        plan=request.plan,
        payment_status="pending",
        status="initiated",
        metadata=checkout_request.metadata
    )
    transaction_dict = transaction.model_dump()
    transaction_dict['created_at'] = transaction_dict['created_at'].isoformat()
    await db.payment_transactions.insert_one(transaction_dict)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/subscriptions/checkout-status/{session_id}")
async def get_checkout_status(session_id: str, current_user: User = Depends(get_current_user)):
    transaction = await db.payment_transactions.find_one({"session_id": session_id, "user_id": current_user.id}, {"_id": 0})
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    
    if transaction["payment_status"] == "paid":
        return {"status": "complete", "payment_status": "paid"}
    
    host_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        status_response: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        if status_response.payment_status == "paid" and transaction["payment_status"] != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "status": "complete"}}
            )
            
            plan = transaction["plan"]
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {"subscription_status": "active", "subscription_plan": plan}}
            )
        
        return {
            "status": status_response.status,
            "payment_status": status_response.payment_status,
            "amount_total": status_response.amount_total,
            "currency": status_response.currency
        }
    except Exception as e:
        logging.error(f"Erreur lors de la vérification du statut: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la vérification du paiement")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    webhook_url = str(request.base_url) + "api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
        
        if event.payment_status == "paid":
            session_id = event.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            
            if transaction and transaction["payment_status"] != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid", "status": "complete"}}
                )
                
                user_id = event.metadata.get("user_id")
                plan = event.metadata.get("plan")
                if user_id:
                    await db.users.update_one(
                        {"id": user_id},
                        {"$set": {"subscription_status": "active", "subscription_plan": plan}}
                    )
        
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Erreur webhook: {e}")
        raise HTTPException(status_code=400, detail="Webhook error")

@api_router.get("/chatbot/questions")
async def get_custom_questions(current_user: User = Depends(get_current_user)):
    if current_user.subscription_plan != "ultra":
        raise HTTPException(status_code=403, detail="Fonctionnalité réservée au plan Ultra-Premium")
    
    custom_questions = await db.custom_questions.find_one({"user_id": current_user.id}, {"_id": 0})
    
    if not custom_questions:
        default_questions = [
            {"key": "first_name", "question": "Bonjour ! Je suis l'assistant virtuel d'Astoria Mandat IA. Pour mieux vous accompagner, puis-je connaître votre prénom ?", "order": 0},
            {"key": "last_name", "question": "Merci {first_name} ! Et votre nom de famille ?", "order": 1},
            {"key": "project_type", "question": "Parfait ! Quel est votre projet immobilier ? (Achat, Vente, Terrain, Information)", "order": 2},
            {"key": "property_type", "question": "Quel type de bien vous intéresse ? (Appartement, Maison, Terrain, Commercial, etc.)", "order": 3},
            {"key": "city", "question": "Dans quelle ville ou secteur recherchez-vous ?", "order": 4},
            {"key": "budget", "question": "Quel est votre budget approximatif ?", "order": 5},
            {"key": "deadline", "question": "Dans quel délai souhaitez-vous concrétiser ce projet ?", "order": 6},
            {"key": "email", "question": "Pour vous envoyer des propositions personnalisées, quelle est votre adresse email ?", "order": 7},
            {"key": "phone", "question": "Et votre numéro de téléphone pour être contacté rapidement ?", "order": 8},
            {"key": "message", "question": "Avez-vous des précisions ou des souhaits particuliers à nous communiquer ?", "order": 9}
        ]
        return {"questions": default_questions}
    
    return {"questions": custom_questions.get("questions", [])}

@api_router.put("/chatbot/questions")
async def update_custom_questions(
    data: CustomQuestionsUpdate,
    current_user: User = Depends(get_current_user)
):
    if current_user.subscription_plan != "ultra":
        raise HTTPException(status_code=403, detail="Fonctionnalité réservée au plan Ultra-Premium")
    
    questions_data = {
        "user_id": current_user.id,
        "questions": [q.model_dump() for q in data.questions],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.custom_questions.update_one(
        {"user_id": current_user.id},
        {"$set": questions_data},
        upsert=True
    )
    
    return {"success": True, "questions": questions_data["questions"]}

@api_router.get("/analytics")
async def get_analytics(current_user: User = Depends(get_current_user)):
    leads = await db.leads.find({"user_id": current_user.id}, {"_id": 0}).to_list(10000)
    conversations = await db.conversations.find({"user_id": current_user.id}, {"_id": 0}).to_list(10000)
    
    total_conversations = len(conversations)
    total_leads = len(leads)
    completion_rate = (total_leads / total_conversations * 100) if total_conversations > 0 else 0
    
    hot_leads = len([l for l in leads if "Chaud" in l.get("score", "")])
    warm_leads = len([l for l in leads if "Tiède" in l.get("score", "")])
    cold_leads = len([l for l in leads if "Froid" in l.get("score", "")])
    
    project_types = {}
    for lead in leads:
        project_type = lead.get("project_type", "Non défini")
        project_types[project_type] = project_types.get(project_type, 0) + 1
    
    hourly_distribution = [0] * 24
    for conv in conversations:
        created_at = conv.get("created_at")
        if created_at:
            try:
                dt = datetime.fromisoformat(created_at)
                hourly_distribution[dt.hour] += 1
            except:
                pass
    
    daily_leads = {}
    for lead in leads:
        created_at = lead.get("created_at")
        if created_at:
            try:
                if isinstance(created_at, str):
                    dt = datetime.fromisoformat(created_at)
                else:
                    dt = created_at
                date_str = dt.strftime("%Y-%m-%d")
                daily_leads[date_str] = daily_leads.get(date_str, 0) + 1
            except:
                pass
    
    sorted_daily = sorted(daily_leads.items())[-30:]
    
    return {
        "total_conversations": total_conversations,
        "total_leads": total_leads,
        "completion_rate": round(completion_rate, 1),
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "project_types": project_types,
        "hourly_distribution": hourly_distribution,
        "daily_leads": dict(sorted_daily),
        "average_response_time": "< 1 seconde"
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
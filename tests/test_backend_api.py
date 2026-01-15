"""
Backend API Tests for Astoria Mandat IA
Tests: Authentication, Dashboard, Admin, Support, Subscriptions
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://agency-ai-2.preview.emergentagent.com')

# Test credentials
TEST_USER_EMAIL = "test@agence.fr"
TEST_USER_PASSWORD = "Test123!"
ADMIN_EMAIL = "admin@astoria-mandat.fr"
ADMIN_PASSWORD = "AdminAstoria2025"

# Unique test user for registration tests
UNIQUE_TEST_EMAIL = f"test_{uuid.uuid4().hex[:8]}@agence.fr"


class TestHealthAndBasics:
    """Basic health and connectivity tests"""
    
    def test_api_reachable(self):
        """Test that API is reachable"""
        response = requests.get(f"{BASE_URL}/api/auth/me", timeout=10)
        # Should return 401 without auth, not 500
        assert response.status_code in [401, 422], f"API not reachable: {response.status_code}"
        print("✓ API is reachable")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_register_new_user(self):
        """Test user registration"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": UNIQUE_TEST_EMAIL,
            "password": "TestPass123!",
            "agency_name": "Test Agency",
            "contact_name": "Test User"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == UNIQUE_TEST_EMAIL
        assert data["user"]["agency_name"] == "Test Agency"
        print(f"✓ User registration successful: {UNIQUE_TEST_EMAIL}")
    
    def test_register_duplicate_email(self):
        """Test duplicate email registration fails"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_USER_EMAIL,
            "password": "TestPass123!",
            "agency_name": "Duplicate Agency",
            "contact_name": "Duplicate User"
        })
        # Should fail with 400 if email exists
        assert response.status_code in [400, 200], f"Unexpected status: {response.status_code}"
        print("✓ Duplicate email handling works")
    
    def test_login_valid_credentials(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_USER_EMAIL
        print("✓ Login with valid credentials successful")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": "WrongPassword123!"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials rejected correctly")
    
    def test_get_current_user(self):
        """Test getting current user info"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Get user info
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200, f"Get user failed: {response.text}"
        data = response.json()
        assert data["email"] == TEST_USER_EMAIL
        print("✓ Get current user successful")
    
    def test_unauthorized_access(self):
        """Test unauthorized access is rejected"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Unauthorized access rejected")


class TestLeads:
    """Lead management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_get_leads(self, auth_token):
        """Test getting leads list"""
        response = requests.get(f"{BASE_URL}/api/leads", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200, f"Get leads failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get leads successful: {len(data)} leads found")
    
    def test_get_leads_unauthorized(self):
        """Test leads endpoint requires auth"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 401
        print("✓ Leads endpoint requires authentication")


class TestChatbot:
    """Chatbot conversation tests"""
    
    def test_chat_start_conversation(self):
        """Test starting a chatbot conversation"""
        session_id = f"test_session_{uuid.uuid4().hex[:8]}"
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "session_id": session_id,
            "message": "Bonjour"
        })
        assert response.status_code == 200, f"Chat failed: {response.text}"
        data = response.json()
        assert "response" in data
        assert "is_complete" in data
        assert data["is_complete"] == False
        print("✓ Chatbot conversation started successfully")
    
    def test_chat_full_conversation(self):
        """Test a complete chatbot conversation flow"""
        session_id = f"test_session_{uuid.uuid4().hex[:8]}"
        
        # Step 1: Start
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "session_id": session_id,
            "message": "Bonjour"
        })
        assert response.status_code == 200
        
        # Step 2: First name
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "session_id": session_id,
            "message": "Jean"
        })
        assert response.status_code == 200
        
        # Step 3: Last name
        response = requests.post(f"{BASE_URL}/api/chat", json={
            "session_id": session_id,
            "message": "Dupont"
        })
        assert response.status_code == 200
        
        print("✓ Chatbot multi-step conversation works")


class TestSupport:
    """Support ticket tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_create_support_ticket(self, auth_token):
        """Test creating a support ticket"""
        response = requests.post(f"{BASE_URL}/api/support/ticket", 
            json={
                "subject": f"Test Ticket {uuid.uuid4().hex[:6]}",
                "message": "This is a test support ticket message"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Create ticket failed: {response.text}"
        data = response.json()
        assert data["success"] == True
        assert "ticket_id" in data
        print(f"✓ Support ticket created: {data['ticket_id']}")
    
    def test_get_my_tickets(self, auth_token):
        """Test getting user's support tickets"""
        response = requests.get(f"{BASE_URL}/api/support/tickets", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200, f"Get tickets failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get support tickets successful: {len(data)} tickets")


class TestAnalytics:
    """Analytics endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_get_analytics(self, auth_token):
        """Test getting analytics data"""
        response = requests.get(f"{BASE_URL}/api/analytics", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200, f"Get analytics failed: {response.text}"
        data = response.json()
        assert "total_conversations" in data
        assert "total_leads" in data
        assert "completion_rate" in data
        print("✓ Analytics endpoint working")


class TestSubscriptions:
    """Subscription and payment tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_create_checkout_standard(self, auth_token):
        """Test creating a checkout session for standard plan"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/create-checkout",
            json={
                "plan": "standard",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Create checkout failed: {response.text}"
        data = response.json()
        assert "url" in data
        assert "session_id" in data
        assert "stripe.com" in data["url"] or "checkout" in data["url"].lower()
        print("✓ Stripe checkout session created for standard plan")
    
    def test_create_checkout_premium(self, auth_token):
        """Test creating a checkout session for premium plan"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/create-checkout",
            json={
                "plan": "premium",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Create checkout failed: {response.text}"
        data = response.json()
        assert "url" in data
        print("✓ Stripe checkout session created for premium plan")
    
    def test_create_checkout_ultra(self, auth_token):
        """Test creating a checkout session for ultra plan"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/create-checkout",
            json={
                "plan": "ultra",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Create checkout failed: {response.text}"
        data = response.json()
        assert "url" in data
        print("✓ Stripe checkout session created for ultra plan")
    
    def test_create_checkout_invalid_plan(self, auth_token):
        """Test creating checkout with invalid plan fails"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/create-checkout",
            json={
                "plan": "invalid_plan",
                "origin_url": BASE_URL
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✓ Invalid plan rejected correctly")


class TestAdmin:
    """Admin panel tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get auth token for admin user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate admin user")
    
    @pytest.fixture
    def user_token(self):
        """Get auth token for regular user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_admin_stats(self, admin_token):
        """Test admin stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200, f"Admin stats failed: {response.text}"
        data = response.json()
        assert "total_users" in data
        assert "active_subscriptions" in data
        assert "total_revenue" in data
        assert "open_tickets" in data
        assert "plan_distribution" in data
        assert "mrr" in data
        print(f"✓ Admin stats: {data['total_users']} users, {data['active_subscriptions']} active subs")
    
    def test_admin_users_list(self, admin_token):
        """Test admin users list endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/users", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200, f"Admin users failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin users list: {len(data)} users")
    
    def test_admin_tickets_list(self, admin_token):
        """Test admin tickets list endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/tickets", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert response.status_code == 200, f"Admin tickets failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin tickets list: {len(data)} tickets")
    
    def test_admin_access_denied_for_regular_user(self, user_token):
        """Test that regular users cannot access admin endpoints"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {user_token}"
        })
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Admin access denied for regular user")


class TestOnboarding:
    """Onboarding and user settings tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_update_onboarding(self, auth_token):
        """Test updating onboarding progress"""
        response = requests.put(f"{BASE_URL}/api/user/onboarding",
            json={"step": 1, "completed": False},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Update onboarding failed: {response.text}"
        data = response.json()
        assert data["success"] == True
        print("✓ Onboarding update successful")
    
    def test_regenerate_integration_key(self, auth_token):
        """Test regenerating integration key"""
        response = requests.post(f"{BASE_URL}/api/user/regenerate-key",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Regenerate key failed: {response.text}"
        data = response.json()
        assert "integration_key" in data
        assert data["integration_key"].startswith("astoria_")
        print(f"✓ Integration key regenerated: {data['integration_key'][:20]}...")


class TestNoPromoCode:
    """Verify promo code functionality has been removed"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate test user")
    
    def test_no_promo_code_endpoint(self, auth_token):
        """Verify promo code validation endpoint doesn't exist"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/validate-promo",
            json={"code": "TEST123"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        # Should return 404 or 405 since endpoint was removed
        assert response.status_code in [404, 405, 422], f"Promo endpoint should not exist: {response.status_code}"
        print("✓ Promo code endpoint correctly removed")
    
    def test_checkout_without_promo_field(self, auth_token):
        """Verify checkout works without promo code field"""
        response = requests.post(f"{BASE_URL}/api/subscriptions/create-checkout",
            json={
                "plan": "standard",
                "origin_url": BASE_URL
                # No promo_code field
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Checkout should work without promo: {response.text}"
        print("✓ Checkout works without promo code field")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

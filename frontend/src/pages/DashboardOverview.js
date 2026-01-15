import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Users, TrendingUp, Clock, Crown, DollarSign, AlertCircle } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import OnboardingWizard from '../components/OnboardingWizard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DashboardOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchLeads();

    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    const plan = params.get('plan');

    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else if (plan) {
      setSelectedPlan(plan);
    }
  }, [location]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur auth:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Erreur leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    if (attempts >= maxAttempts) {
      toast.error('Délai de vérification du paiement dépassé');
      setIsCheckingPayment(false);
      return;
    }

    setIsCheckingPayment(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/subscriptions/checkout-status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.payment_status === 'paid') {
        toast.success('🎉 Abonnement activé avec succès !');
        await fetchUserData();
        setIsCheckingPayment(false);
        window.history.replaceState({}, document.title, '/dashboard');
      } else {
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      toast.error('Erreur lors de la vérification du paiement');
      setIsCheckingPayment(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API}/subscriptions/create-checkout`, 
        { plan, origin_url: originUrl, promo_code: promoCode || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.free_activation) {
        toast.success(response.data.message);
        await fetchUserData();
        setSelectedPlan(null);
        setPromoCode('');
        setShowPromoInput(false);
      } else if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la création de l\'abonnement';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  if (isCheckingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#D4AF37] mx-auto mb-4" size={48} />
          <p className="text-xl font-semibold text-slate-900">Vérification du paiement...</p>
          <p className="text-slate-600 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.score.includes('Chaud')).length,
    warm: leads.filter(l => l.score.includes('Tiède')).length,
    cold: leads.filter(l => l.score.includes('Froid')).length
  };

  return (
    <DashboardLayout user={user}>
      {!user?.onboarding_completed && (
        <OnboardingWizard user={user} onComplete={fetchUserData} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Subscription Banner */}
        {user?.subscription_status !== 'active' && (
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-white rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center space-x-2">
                  <Crown size={32} />
                  <span>Activez votre abonnement</span>
                </h2>
                <p className="text-white/90 text-lg">Débloquez toutes les fonctionnalités premium d'Astoria Mandat IA</p>
              </div>
              <button
                onClick={() => setSelectedPlan('premium')}
                className="bg-white text-[#D4AF37] px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all shadow-lg text-lg"
              >
                Voir les offres
              </button>
            </div>
          </div>
        )}

        {/* Plan Selector */}
        {selectedPlan && user?.subscription_status !== 'active' && (
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Choisissez votre plan</h3>
            
            {/* Code Promo */}
            <div className="mb-6 bg-slate-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-slate-900 text-lg">Code promo</label>
                <button
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="text-sm text-[#D4AF37] hover:text-[#B4941F] font-medium"
                >
                  {showPromoInput ? 'Masquer' : 'J\'ai un code'}
                </button>
              </div>
              {showPromoInput && (
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Entrez votre code (ex: TEST2025)"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] uppercase text-lg"
                />
              )}
              {promoCode && (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  ✓ Code "{promoCode}" sera appliqué
                </p>
              )}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Code test :</strong> <code className="bg-blue-100 px-2 py-1 rounded font-mono text-blue-900">TEST2025</code> pour activer gratuitement
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'standard', name: 'Standard', price: '199€', features: ['IA 24/7', 'Export Sheets', '1 agence'] },
                { id: 'premium', name: 'Premium', price: '349€', highlight: true, features: ['Tout Standard', 'Multi-agences', 'CRM', 'Analytics'] },
                { id: 'ultra', name: 'Ultra-Premium', price: '499€', features: ['Tout Premium', 'Personnalisation', 'Support 24/7', 'Installation'] }
              ].map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                    plan.highlight
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md transform scale-105'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl font-bold text-slate-900 mb-2">{plan.name}</div>
                  <div className="text-4xl font-bold text-[#D4AF37] mb-4">{plan.price}<span className="text-lg text-slate-600">/mois</span></div>
                  <ul className="space-y-2 text-left text-sm text-slate-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-[#D4AF37]">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-slate-600" size={28} />
              <span className="text-4xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-slate-600 font-medium text-lg">Total Leads</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-red-600" size={28} />
              <span className="text-4xl font-bold text-red-600">{stats.hot}</span>
            </div>
            <p className="text-slate-600 font-medium text-lg">🔥 Chauds</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-yellow-600" size={28} />
              <span className="text-4xl font-bold text-yellow-600">{stats.warm}</span>
            </div>
            <p className="text-slate-600 font-medium text-lg">🟡 Tièdes</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-blue-600" size={28} />
              <span className="text-4xl font-bold text-blue-600">{stats.cold}</span>
            </div>
            <p className="text-slate-600 font-medium text-lg">❄️ Froids</p>
          </div>
        </div>

        {/* Quick Actions */}
        {user?.subscription_status === 'active' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { to: '/dashboard/leads', icon: Users, label: 'Voir mes leads', color: 'blue' },
                { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', color: 'purple' },
                { to: '/dashboard/integration', icon: Code, label: 'Code d\'intégration', color: 'green' },
                { to: '/dashboard/support', icon: MessageSquare, label: 'Contacter le support', color: 'orange' }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.to)}
                  className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300 group"
                >
                  <action.icon className={`text-${action.color}-600 mb-3`} size={32} />
                  <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;

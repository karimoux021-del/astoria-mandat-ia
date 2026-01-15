import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Users, TrendingUp, Clock, Crown, Code, MessageSquare, BarChart3, Check } from 'lucide-react';
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
  const [isSubscribing, setIsSubscribing] = useState(false);

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

    if (sessionId) {
      pollPaymentStatus(sessionId);
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
    const maxAttempts = 10;
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
    setIsSubscribing(true);
    try {
      const token = localStorage.getItem('token');
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API}/subscriptions/create-checkout`, 
        { plan, origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la création de l\'abonnement';
      toast.error(errorMessage);
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
    hot: leads.filter(l => l.score?.includes('Chaud')).length,
    warm: leads.filter(l => l.score?.includes('Tiède')).length,
    cold: leads.filter(l => l.score?.includes('Froid')).length
  };

  const plans = [
    { 
      id: 'standard', 
      name: 'Standard', 
      price: '199', 
      features: ['Chatbot IA 24/7', 'Export Google Sheets', '1 agence', 'Support email'] 
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      price: '349', 
      highlight: true, 
      features: ['Tout Standard', 'Multi-agences', 'Intégration CRM', 'Analytics avancés', 'Support prioritaire'] 
    },
    { 
      id: 'ultra', 
      name: 'Ultra-Premium', 
      price: '499', 
      features: ['Tout Premium', 'Personnalisation chatbot', 'API dédiée', 'Support 24/7', 'Installation offerte'] 
    }
  ];

  return (
    <DashboardLayout user={user}>
      {!user?.onboarding_completed && (
        <OnboardingWizard user={user} onComplete={fetchUserData} />
      )}

      <div className="max-w-7xl mx-auto" data-testid="dashboard-overview">
        {/* Subscription Banner */}
        {user?.subscription_status !== 'active' && !selectedPlan && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 mb-8 shadow-xl" data-testid="subscription-banner">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center space-x-3">
                  <Crown className="text-[#D4AF37]" size={28} />
                  <span>Activez votre abonnement</span>
                </h2>
                <p className="text-slate-300">Débloquez toutes les fonctionnalités premium d'Astoria Mandat IA</p>
              </div>
              <button
                onClick={() => setSelectedPlan('show')}
                className="bg-[#D4AF37] text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-[#E5C348] transition-all shadow-lg"
                data-testid="view-plans-btn"
              >
                Voir les offres
              </button>
            </div>
          </div>
        )}

        {/* Plan Selector Modal */}
        {selectedPlan && user?.subscription_status !== 'active' && (
          <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm" data-testid="plan-selector">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Choisissez votre plan</h3>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-slate-500 hover:text-slate-700 font-medium"
              >
                ✕ Fermer
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    plan.highlight
                      ? 'border-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/5 to-white shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#D4AF37] text-white text-xs font-bold px-4 py-1 rounded-full">
                        POPULAIRE
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}€</span>
                      <span className="text-slate-600 ml-1">/mois</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-slate-600">
                        <Check className="text-[#D4AF37] flex-shrink-0" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribing}
                    className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                      plan.highlight
                        ? 'bg-[#D4AF37] text-white hover:bg-[#B4941F]'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                    data-testid={`subscribe-${plan.id}-btn`}
                  >
                    {isSubscribing ? (
                      <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                      'Choisir ce plan'
                    )}
                  </button>
                </div>
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
            <p className="text-slate-600 font-medium">Total Leads</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-red-600" size={28} />
              <span className="text-4xl font-bold text-red-600">{stats.hot}</span>
            </div>
            <p className="text-slate-600 font-medium">🔥 Chauds</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-yellow-600" size={28} />
              <span className="text-4xl font-bold text-yellow-600">{stats.warm}</span>
            </div>
            <p className="text-slate-600 font-medium">🟡 Tièdes</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-blue-600" size={28} />
              <span className="text-4xl font-bold text-blue-600">{stats.cold}</span>
            </div>
            <p className="text-slate-600 font-medium">❄️ Froids</p>
          </div>
        </div>

        {/* Quick Actions */}
        {user?.subscription_status === 'active' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Actions rapides</h3>
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
                  className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300 group text-left"
                  data-testid={`quick-action-${action.label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                >
                  <action.icon className="text-slate-600 mb-3 group-hover:text-slate-900" size={28} />
                  <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for non-subscribed users */}
        {user?.subscription_status !== 'active' && !selectedPlan && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Crown className="text-slate-300 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Activez votre compte</h3>
            <p className="text-slate-600 mb-6">Souscrivez à un abonnement pour commencer à générer des leads qualifiés</p>
            <button
              onClick={() => setSelectedPlan('show')}
              className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all"
            >
              Découvrir les offres
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;

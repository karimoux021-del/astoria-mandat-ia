import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, LogOut, Users, TrendingUp, Clock, Mail, Phone, MapPin, Calendar, DollarSign, MessageSquare, Download, Crown } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
      toast.error('Erreur lors du chargement des leads');
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
        { plan, origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
      toast.error('Erreur lors de la création de l\'abonnement');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const exportLeads = () => {
    const csv = [
      ['Prénom', 'Nom', 'Email', 'Téléphone', 'Type Projet', 'Type Bien', 'Ville', 'Budget', 'Délai', 'Score', 'Date'].join(','),
      ...leads.map(lead => [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone,
        lead.project_type,
        lead.property_type,
        lead.city,
        lead.budget,
        lead.deadline,
        lead.score,
        new Date(lead.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export réussi !');
  };

  const getScoreColor = (score) => {
    if (score.includes('Chaud')) return 'text-red-600 bg-red-100';
    if (score.includes('Tiède')) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.score.includes('Chaud')).length,
    warm: leads.filter(l => l.score.includes('Tiède')).length,
    cold: leads.filter(l => l.score.includes('Froid')).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="dashboard-loading">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  if (isCheckingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="dashboard-checking-payment">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#D4AF37] mx-auto mb-4" size={48} />
          <p className="text-xl font-semibold text-slate-900">Vérification du paiement...</p>
          <p className="text-slate-600 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard-page">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Astoria Mandat IA</h1>
              <p className="text-sm text-slate-600">{user?.agency_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.contact_name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              data-testid="dashboard-logout-button"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Subscription Status */}
        {user?.subscription_status !== 'active' && (
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-white rounded-2xl p-6 mb-8" data-testid="dashboard-subscription-banner">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🚀 Activez votre abonnement</h2>
                <p className="text-white/90">Débloquez toutes les fonctionnalités d'Astoria Mandat IA</p>
              </div>
              <button
                onClick={() => setSelectedPlan('premium')}
                className="bg-white text-[#D4AF37] px-6 py-3 rounded-full font-semibold hover:bg-slate-50 transition-all"
                data-testid="dashboard-activate-subscription-button"
              >
                Voir les offres
              </button>
            </div>
          </div>
        )}

        {selectedPlan && user?.subscription_status !== 'active' && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200" data-testid="dashboard-plan-selector">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Choisissez votre plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'standard', name: 'Standard', price: '199€/mois' },
                { id: 'premium', name: 'Premium', price: '349€/mois', highlight: true },
                { id: 'ultra', name: 'Ultra-Premium', price: '499€/mois' }
              ].map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    plan.highlight
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  data-testid={`dashboard-plan-${plan.id}`}
                >
                  <div className="text-lg font-bold text-slate-900">{plan.name}</div>
                  <div className="text-2xl font-bold text-[#D4AF37] mt-2">{plan.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {user?.subscription_status === 'active' && (
          <div className="bg-white rounded-2xl p-4 mb-8 border border-green-200" data-testid="dashboard-active-subscription">
            <div className="flex items-center space-x-3">
              <Crown className="text-[#D4AF37]" size={24} />
              <div>
                <p className="font-semibold text-slate-900">
                  Abonnement actif : <span className="text-[#D4AF37]">{user.subscription_plan}</span>
                </p>
                <p className="text-sm text-slate-600">Votre accès à toutes les fonctionnalités est actif</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200" data-testid="dashboard-stat-total">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-slate-600" size={24} />
              <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <p className="text-slate-600 font-medium">Total Leads</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-red-200" data-testid="dashboard-stat-hot">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-red-600" size={24} />
              <span className="text-3xl font-bold text-red-600">{stats.hot}</span>
            </div>
            <p className="text-slate-600 font-medium">🔥 Chauds</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-yellow-200" data-testid="dashboard-stat-warm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-yellow-600" size={24} />
              <span className="text-3xl font-bold text-yellow-600">{stats.warm}</span>
            </div>
            <p className="text-slate-600 font-medium">🟡 Tièdes</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-200" data-testid="dashboard-stat-cold">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-blue-600" size={24} />
              <span className="text-3xl font-bold text-blue-600">{stats.cold}</span>
            </div>
            <p className="text-slate-600 font-medium">❄️ Froids</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Vos Leads</h2>
            <button
              onClick={exportLeads}
              disabled={leads.length === 0}
              className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="dashboard-export-button"
            >
              <Download size={18} />
              <span>Exporter CSV</span>
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="p-12 text-center" data-testid="dashboard-no-leads">
              <Users className="text-slate-300 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun lead pour le moment</h3>
              <p className="text-slate-600">Les prospects qualifiés apparaîtront ici</p>
            </div>
          ) : (
            <div className="overflow-x-auto" data-testid="dashboard-leads-table">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Projet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Bien</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Localisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Délai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{lead.first_name} {lead.last_name}</div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                          <Mail size={14} />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                          <Phone size={14} />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{lead.project_type}</td>
                      <td className="px-6 py-4 text-slate-900">{lead.property_type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <MapPin size={14} />
                          <span>{lead.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <DollarSign size={14} />
                          <span>{lead.budget}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <Clock size={14} />
                          <span>{lead.deadline}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

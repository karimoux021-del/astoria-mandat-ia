import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users, DollarSign, TrendingUp, AlertCircle, Ban, Check, X, MessageSquare, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketResponse, setTicketResponse] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [userRes, statsRes, usersRes, ticketsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (userRes.data.role !== 'admin') {
        toast.error('Accès refusé');
        navigate('/dashboard');
        return;
      }

      setUser(userRes.data);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 403) {
        toast.error('Accès admin requis');
        navigate('/dashboard');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/users/${userId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Utilisateur modifié');
      await fetchData();
      setSelectedUser(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handleTicketResponse = async (ticketId) => {
    if (!ticketResponse.trim()) {
      toast.error('Veuillez entrer une réponse');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/tickets/${ticketId}`, {
        response: ticketResponse,
        status: 'closed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Réponse envoyée');
      setTicketResponse('');
      setSelectedTicket(null);
      await fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-slate-900" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'tickets', label: 'Support', icon: MessageSquare, badge: stats?.open_tickets }
  ];

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto" data-testid="admin-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Panel Administrateur</h1>
              <p className="text-slate-600">Gestion complète d'Astoria Mandat IA</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div data-testid="admin-overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-600" size={24} />
                  <span className="text-3xl font-bold text-slate-900">{stats.total_users}</span>
                </div>
                <p className="text-slate-600 font-medium">Utilisateurs totaux</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-green-600" size={24} />
                  <span className="text-3xl font-bold text-green-600">{stats.active_subscriptions}</span>
                </div>
                <p className="text-slate-600 font-medium">Abonnements actifs</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-[#D4AF37]" size={24} />
                  <span className="text-3xl font-bold text-[#D4AF37]">{stats.total_revenue}€</span>
                </div>
                <p className="text-slate-600 font-medium">Revenus totaux</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="text-orange-600" size={24} />
                  <span className="text-3xl font-bold text-orange-600">{stats.open_tickets}</span>
                </div>
                <p className="text-slate-600 font-medium">Tickets ouverts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">MRR (Revenu mensuel récurrent)</h3>
                <p className="text-4xl font-bold text-[#D4AF37]">{stats.mrr}€<span className="text-lg text-slate-600">/mois</span></p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Répartition des plans</h3>
                <div className="space-y-2">
                  {Object.entries(stats.plan_distribution).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-slate-600 capitalize">{plan === 'none' ? 'Sans abonnement' : plan}</span>
                      <span className="font-semibold">{count} utilisateur{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" data-testid="admin-users">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Gestion des utilisateurs</h2>
              <p className="text-slate-600 text-sm mt-1">{users.filter(u => u.role !== 'admin').length} utilisateurs enregistrés</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agence</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.filter(u => u.role !== 'admin').map((u) => (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${u.is_banned ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{u.agency_name}</div>
                        <div className="text-sm text-slate-500">{u.contact_name}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.subscription_plan === 'ultra' ? 'bg-purple-100 text-purple-800' :
                          u.subscription_plan === 'premium' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                          u.subscription_plan === 'standard' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.subscription_plan || 'Aucun'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.is_banned ? 'bg-red-100 text-red-800' :
                          u.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.is_banned ? 'Banni' : u.subscription_status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="text-[#D4AF37] hover:text-[#B4941F] font-medium text-sm"
                          data-testid={`edit-user-${u.id}`}
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div data-testid="admin-tickets">
            {tickets.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
                <MessageSquare className="text-slate-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun ticket</h3>
                <p className="text-slate-600">Tous les tickets ont été traités.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm" data-testid={`admin-ticket-${ticket.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{ticket.subject}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {ticket.agency_name} • {ticket.user_email}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status === 'open' ? 'En attente' : 'Résolu'}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-4 bg-slate-50 p-4 rounded-lg">{ticket.message}</p>
                    {ticket.admin_response ? (
                      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-xs text-green-700 mb-2 font-medium">Votre réponse :</p>
                        <p className="text-green-900 text-sm">{ticket.admin_response}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="bg-[#D4AF37] text-white px-6 py-2 rounded-full font-medium hover:bg-[#B4941F] transition-all"
                        data-testid={`respond-ticket-${ticket.id}`}
                      >
                        Répondre
                      </button>
                    )}
                    <p className="text-xs text-slate-400 mt-4">
                      {new Date(ticket.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="user-edit-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Modifier l'utilisateur</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Agence</label>
                <p className="text-slate-900 font-medium">{selectedUser.agency_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                <p className="text-slate-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Actions</h4>
              {!selectedUser.is_banned && (
                <>
                  <button
                    onClick={() => handleUserUpdate(selectedUser.id, { subscription_status: 'active', subscription_plan: 'ultra' })}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    data-testid="activate-ultra-btn"
                  >
                    <Check size={18} />
                    <span>Activer plan Ultra gratuitement</span>
                  </button>
                  <button
                    onClick={() => handleUserUpdate(selectedUser.id, { subscription_status: 'none', subscription_plan: null })}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    data-testid="deactivate-subscription-btn"
                  >
                    <X size={18} />
                    <span>Désactiver l'abonnement</span>
                  </button>
                </>
              )}
              <button
                onClick={() => handleUserUpdate(selectedUser.id, { is_banned: !selectedUser.is_banned })}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                data-testid="ban-user-btn"
              >
                <Ban size={18} />
                <span>{selectedUser.is_banned ? 'Débannir' : 'Bannir'} l'utilisateur</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-4 bg-slate-100 text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              data-testid="close-user-modal-btn"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="ticket-response-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Répondre au ticket</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-500 mb-1"><strong>Sujet :</strong> {selectedTicket.subject}</p>
              <p className="text-sm text-slate-500 mb-3"><strong>De :</strong> {selectedTicket.agency_name}</p>
              <p className="text-slate-700">{selectedTicket.message}</p>
            </div>
            <textarea
              value={ticketResponse}
              onChange={(e) => setTicketResponse(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none mb-4"
              placeholder="Votre réponse..."
              data-testid="ticket-response-input"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleTicketResponse(selectedTicket.id)}
                className="flex-1 bg-[#D4AF37] text-white py-3 rounded-xl font-medium hover:bg-[#B4941F] transition-colors"
                data-testid="send-response-btn"
              >
                Envoyer et fermer le ticket
              </button>
              <button
                onClick={() => { setSelectedTicket(null); setTicketResponse(''); }}
                className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Admin;

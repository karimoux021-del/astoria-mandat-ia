import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users, DollarSign, TrendingUp, AlertCircle, Ban, Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
import DashboardLayout from '../components/DashboardLayout';

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span>Panel Admin</span>
              </h1>
              <p className="text-slate-300 mt-2">Gestion complète d'Astoria Mandat IA</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-medium transition-colors">
              ← Dashboard
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'users', label: 'Utilisateurs' },
              { id: 'tickets', label: 'Support' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-600" size={24} />
                  <span className="text-3xl font-bold text-slate-900">{stats.total_users}</span>
                </div>
                <p className="text-slate-600 font-medium">Utilisateurs totaux</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="text-green-600" size={24} />
                  <span className="text-3xl font-bold text-green-600">{stats.active_subscriptions}</span>
                </div>
                <p className="text-slate-600 font-medium">Abonnements actifs</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-[#D4AF37]" size={24} />
                  <span className="text-3xl font-bold text-[#D4AF37]">{stats.total_revenue}€</span>
                </div>
                <p className="text-slate-600 font-medium">Revenus totaux</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="text-orange-600" size={24} />
                  <span className="text-3xl font-bold text-orange-600">{stats.open_tickets}</span>
                </div>
                <p className="text-slate-600 font-medium">Tickets ouverts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">MRR (Revenu mensuel récurrent)</h3>
                <p className="text-4xl font-bold text-[#D4AF37]">{stats.mrr}€<span className="text-lg text-slate-600">/mois</span></p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Répartition des plans</h3>
                <div className="space-y-2">
                  {Object.entries(stats.plan_distribution).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-slate-600 capitalize">{plan}</span>
                      <span className="font-semibold">{count} user{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Gestion des utilisateurs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Agence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.filter(u => u.role !== 'admin').map((u) => (
                    <tr key={u.id} className={u.is_banned ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 font-medium text-slate-900">{u.agency_name}</td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-medium">
                          {u.subscription_plan || 'none'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.is_banned ? 'bg-red-100 text-red-800' :
                          u.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {u.is_banned ? 'Banni' : u.subscription_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                <MessageSquare className="text-slate-300 mx-auto mb-4" size={48} />
                <p className="text-slate-600">Aucun ticket de support</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{ticket.subject}</h3>
                      <p className="text-sm text-slate-600 mt-1">{ticket.agency_name} ({ticket.user_email})</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status === 'open' ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-4">{ticket.message}</p>
                  {ticket.admin_response ? (
                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-xs text-green-700 mb-2 font-medium">Votre réponse :</p>
                      <p className="text-green-900 text-sm">{ticket.admin_response}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-[#D4AF37] text-white px-6 py-2 rounded-full font-medium hover:bg-[#B4941F] transition-all"
                    >
                      Répondre
                    </button>
                  )}
                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(ticket.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Modifier l'utilisateur</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Agence</label>
                <p className="text-slate-900 font-medium">{selectedUser.agency_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <p className="text-slate-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Actions rapides :</h4>
              {!selectedUser.is_banned && (
                <>
                  <button
                    onClick={() => handleUserUpdate(selectedUser.id, { subscription_status: 'active', subscription_plan: 'ultra' })}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Check className="inline mr-2" size={18} />
                    Activer plan Ultra gratuitement
                  </button>
                  <button
                    onClick={() => handleUserUpdate(selectedUser.id, { subscription_status: 'none', subscription_plan: null })}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <X className="inline mr-2" size={18} />
                    Désactiver l'abonnement
                  </button>
                </>
              )}
              <button
                onClick={() => handleUserUpdate(selectedUser.id, { is_banned: !selectedUser.is_banned })}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Ban className="inline mr-2" size={18} />
                {selectedUser.is_banned ? 'Débannir' : 'Bannir'} l'utilisateur
              </button>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-4 bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Répondre au ticket</h3>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 mb-2"><strong>Sujet:</strong> {selectedTicket.subject}</p>
              <p className="text-sm text-slate-600 mb-2"><strong>De:</strong> {selectedTicket.agency_name}</p>
              <p className="text-slate-700 mt-3">{selectedTicket.message}</p>
            </div>
            <textarea
              value={ticketResponse}
              onChange={(e) => setTicketResponse(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none mb-4"
              placeholder="Votre réponse..."
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleTicketResponse(selectedTicket.id)}
                className="flex-1 bg-[#D4AF37] text-white py-3 rounded-lg font-medium hover:bg-[#B4941F] transition-colors"
              >
                Envoyer et fermer le ticket
              </button>
              <button
                onClick={() => { setSelectedTicket(null); setTicketResponse(''); }}
                className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

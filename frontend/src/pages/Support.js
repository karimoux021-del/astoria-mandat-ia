import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare, Send, CheckCircle, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Support = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

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
      const [userRes, ticketsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/support/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUser(userRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/support/ticket`,
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Ticket créé avec succès !');
      setSubject('');
      setMessage('');
      setShowNewTicket(false);
      await fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création du ticket');
    } finally {
      setIsSending(false);
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

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto" data-testid="support-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Centre de support</h1>
            <p className="text-slate-600 mt-1">Besoin d'aide ? Notre équipe est là pour vous.</p>
          </div>
          <button
            onClick={() => setShowNewTicket(true)}
            className="bg-[#D4AF37] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all flex items-center space-x-2"
            data-testid="new-ticket-btn"
          >
            <Plus size={20} />
            <span>Nouveau ticket</span>
          </button>
        </div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8" data-testid="new-ticket-form">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare size={24} />
                <span>Nouveau ticket</span>
              </h2>
              <button 
                onClick={() => setShowNewTicket(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Ex: Problème avec le chatbot"
                  required
                  data-testid="ticket-subject-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                  placeholder="Décrivez votre problème en détail..."
                  required
                  data-testid="ticket-message-input"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all disabled:opacity-50 flex items-center space-x-2"
                  data-testid="submit-ticket-btn"
                >
                  {isSending ? (
                    <><Loader2 className="animate-spin" size={18} /><span>Envoi...</span></>
                  ) : (
                    <><Send size={18} /><span>Envoyer</span></>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Mes tickets ({tickets.length})</h2>
          
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <MessageSquare className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun ticket</h3>
              <p className="text-slate-600 mb-6">Vous n'avez pas encore créé de ticket de support.</p>
              <button
                onClick={() => setShowNewTicket(true)}
                className="bg-slate-100 text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-slate-200 transition-all"
              >
                Créer mon premier ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all"
                  data-testid={`ticket-${ticket.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 text-lg">{ticket.subject}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      ticket.status === 'open' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status === 'open' ? (
                        <><Clock size={12} /><span>En attente</span></>
                      ) : (
                        <><CheckCircle size={12} /><span>Résolu</span></>
                      )}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{ticket.message}</p>
                  
                  {ticket.admin_response && (
                    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-lg p-4 border-l-4 border-[#D4AF37] mb-4">
                      <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Réponse du support</p>
                      <p className="text-slate-700 text-sm">{ticket.admin_response}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400">
                    Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Questions fréquentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: 'Comment intégrer le chatbot ?', a: 'Rendez-vous dans "Intégration" pour copier votre code.' },
              { q: 'Comment voir mes leads ?', a: 'Consultez la section "Mes Leads" du dashboard.' },
              { q: 'Comment changer de plan ?', a: 'Contactez-nous via un ticket de support.' },
              { q: 'Temps de réponse moyen ?', a: 'Nous répondons sous 24h ouvrées.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-medium text-slate-900 text-sm mb-1">{faq.q}</p>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;

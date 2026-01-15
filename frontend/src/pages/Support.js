import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Support = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">A</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Support</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-slate-900 font-medium">
            ← Retour au dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <MessageSquare size={24} />
                <span>Nouveau ticket</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Ex: Problème avec le chatbot"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                    placeholder="Décrivez votre problème en détail..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#D4AF37] text-white py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <><Loader2 className="animate-spin" size={18} /><span>Envoi...</span></>
                  ) : (
                    <><Send size={18} /><span>Envoyer</span></>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Mes tickets</h2>
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                  <MessageSquare className="text-slate-300 mx-auto mb-4" size={48} />
                  <p className="text-slate-600">Aucun ticket pour le moment</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{ticket.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status === 'open' ? (
                          <><Clock size={12} className="inline mr-1" />Ouvert</>
                        ) : (
                          <><CheckCircle size={12} className="inline mr-1" />Fermé</>
                        )}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{ticket.message}</p>
                    {ticket.admin_response && (
                      <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-[#D4AF37]">
                        <p className="text-xs text-slate-500 mb-2 font-medium">Réponse du support :</p>
                        <p className="text-slate-700 text-sm">{ticket.admin_response}</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-3">
                      {new Date(ticket.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

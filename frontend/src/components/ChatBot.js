import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ChatBot = ({ isDemo = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Bonjour ! Je suis l'assistant virtuel d'Astoria Mandat IA. Pour mieux vous accompagner, puis-je connaître votre prénom ?"
      }]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage,
        user_id: null
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);

      if (response.data.is_complete) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            content: `🎉 Votre demande a été enregistrée ! Score: ${response.data.lead_data?.score || 'Non défini'}`
          }]);
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, une erreur est survenue. Veuillez réessayer."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all hover:scale-110 z-50"
          data-testid="chatbot-open-button"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50" data-testid="chatbot-container">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-semibold" data-testid="chatbot-title">Assistant Astoria IA</h3>
                <p className="text-xs text-slate-300">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-slate-300 transition-colors"
              data-testid="chatbot-close-button"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" data-testid="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'system' ? (
                  <div className="bg-green-100 text-green-800 rounded-2xl p-3 max-w-[85%] text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl p-3 max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}
                    data-testid={`chatbot-message-${msg.role}`}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:border-slate-900 transition-colors"
                disabled={isLoading}
                data-testid="chatbot-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="chatbot-send-button"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2, GripVertical, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import PlanGate from '../components/PlanGate';

import DashboardLayout from '../components/DashboardLayout';
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Customize = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

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
      
      const [userRes, questionsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/chatbot/questions`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setUser(userRes.data);
      setQuestions(questionsRes.data.questions.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 403) {
        toast.error('Plan Ultra-Premium requis');
        navigate('/dashboard');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      key: `custom_${Date.now()}`,
      question: '',
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length <= 5) {
      toast.error('Vous devez conserver au moins 5 questions');
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    newQuestions.forEach((q, i) => q.order = i);
    setQuestions(newQuestions);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedQuestion);
    newQuestions.forEach((q, i) => q.order = i);

    setQuestions(newQuestions);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    // Validation
    const emptyQuestions = questions.filter(q => !q.question.trim());
    if (emptyQuestions.length > 0) {
      toast.error('Toutes les questions doivent être remplies');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/chatbot/questions`,
        { questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Questions sauvegardées avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Voulez-vous vraiment réinitialiser aux questions par défaut ?')) {
      return;
    }
    await fetchData();
    toast.success('Questions réinitialisées');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  return (
    <PlanGate user={user} requiredPlan="ultra">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Personnaliser le chatbot</h1>
                  <p className="text-sm text-slate-600">Modifiez les questions posées par votre assistant IA</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Retour au dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Conseils pour personnaliser vos questions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez un langage naturel et conversationnel</li>
              <li>• Posez une seule question à la fois</li>
              <li>• Utilisez {'{'}first_name{'}'} pour personnaliser avec le prénom du prospect</li>
              <li>• Les questions essentielles (nom, email, téléphone) doivent être conservées</li>
              <li>• Glissez-déposez pour réorganiser l'ordre des questions</li>
            </ul>
          </div>

          {/* Questions List */}
          <div className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <div
                key={question.key}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-xl border-2 p-6 transition-all ${
                  draggedIndex === index
                    ? 'border-[#D4AF37] shadow-lg opacity-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 cursor-move mt-2">
                    <GripVertical className="text-slate-400" size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Question #{index + 1}
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Entrez votre question ici..."
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Clé : <code className="bg-slate-100 px-2 py-1 rounded">{question.key}</code>
                      </div>
                      {questions.length > 5 && (
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm"
                        >
                          <Trash2 size={16} />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            onClick={handleAddQuestion}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl border-2 border-dashed border-slate-300 hover:bg-slate-200 hover:border-slate-400 transition-all flex items-center justify-center space-x-2 font-medium"
          >
            <Plus size={20} />
            <span>Ajouter une question</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <RotateCcw size={18} />
              <span>Réinitialiser</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Sauvegarder les modifications</span>
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-yellow-800">
              ⚠️ Les modifications seront appliquées immédiatement à votre chatbot. Assurez-vous de tester le parcours complet avant de déployer en production.
            </p>
          </div>
        </div>
      </div>
    </PlanGate>
  );
};

export default Customize;

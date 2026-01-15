import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2, GripVertical, Save, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import PlanGate from '../components/PlanGate';

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
      const userRes = await axios.get(`${API}/auth/me`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUser(userRes.data);

      if (userRes.data.subscription_plan === 'ultra') {
        const questionsRes = await axios.get(`${API}/chatbot/questions`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setQuestions(questionsRes.data.questions.sort((a, b) => a.order - b.order));
      }
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
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-slate-900" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <PlanGate user={user} requiredPlan="ultra">
        <div className="max-w-4xl mx-auto" data-testid="customize-page">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Personnaliser le chatbot</h1>
            <p className="text-slate-600 mt-1">Adaptez les questions du chatbot à votre activité</p>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Conseils de personnalisation</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Utilisez un langage naturel et conversationnel</li>
                  <li>• Posez une seule question à la fois</li>
                  <li>• Utilisez <code className="bg-blue-100 px-1 rounded">{'{first_name}'}</code> pour personnaliser avec le prénom</li>
                  <li>• Glissez-déposez pour réorganiser l'ordre des questions</li>
                </ul>
              </div>
            </div>
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
                data-testid={`question-${index}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 cursor-move mt-2">
                    <GripVertical className="text-slate-400 hover:text-slate-600" size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Question #{index + 1}
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Entrez votre question ici..."
                        data-testid={`question-input-${index}`}
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
                          data-testid={`delete-question-${index}`}
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
            data-testid="add-question-btn"
          >
            <Plus size={20} />
            <span>Ajouter une question</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              data-testid="reset-questions-btn"
            >
              <RotateCcw size={18} />
              <span>Réinitialiser</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              data-testid="save-questions-btn"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-amber-800">
              ⚠️ Les modifications seront appliquées immédiatement à votre chatbot. Testez le parcours complet avant de déployer en production.
            </p>
          </div>
        </div>
      </PlanGate>
    </DashboardLayout>
  );
};

export default Customize;

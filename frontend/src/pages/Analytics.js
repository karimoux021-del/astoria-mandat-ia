import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, TrendingUp, Users, Clock, Target, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import PlanGate from '../components/PlanGate';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      const [userRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setUser(userRes.data);
      setAnalytics(analyticsRes.data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={48} />
      </div>
    );
  }

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6'];
  
  const scoreData = [
    { name: 'Chauds', value: analytics?.hot_leads || 0, color: '#EF4444' },
    { name: 'Tièdes', value: analytics?.warm_leads || 0, color: '#F59E0B' },
    { name: 'Froids', value: analytics?.cold_leads || 0, color: '#3B82F6' }
  ];

  const projectData = Object.entries(analytics?.project_types || {}).map(([name, value]) => ({
    name,
    value
  }));

  const hourlyData = (analytics?.hourly_distribution || []).map((count, hour) => ({
    hour: `${hour}h`,
    conversations: count
  }));

  const dailyData = Object.entries(analytics?.daily_leads || {}).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    leads: count
  }));

  return (
    <PlanGate user={user} requiredPlan="premium">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-xl">A</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Analytics Avancées</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Retour au dashboard
            </button>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-slate-600" size={24} />
                <span className="text-3xl font-bold text-slate-900">{analytics?.total_conversations}</span>
              </div>
              <p className="text-slate-600 font-medium">Conversations totales</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Target className="text-green-600" size={24} />
                <span className="text-3xl font-bold text-green-600">{analytics?.total_leads}</span>
              </div>
              <p className="text-slate-600 font-medium">Leads qualifiés</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-[#D4AF37]" size={24} />
                <span className="text-3xl font-bold text-[#D4AF37]">{analytics?.completion_rate}%</span>
              </div>
              <p className="text-slate-600 font-medium">Taux de complétion</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-blue-600" size={24} />
                <span className="text-3xl font-bold text-blue-600">&lt;1s</span>
              </div>
              <p className="text-slate-600 font-medium">Temps de réponse</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Score Distribution */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>Répartition des scores</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Project Types */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                <Target size={20} />
                <span>Types de projets</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 gap-6">
            {/* Daily Leads */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                <Calendar size={20} />
                <span>Évolution des leads (30 derniers jours)</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#D4AF37" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Distribution */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center space-x-2">
                <Clock size={20} />
                <span>Distribution horaire des conversations</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="#0F172A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 mt-6">
            <h3 className="text-2xl font-bold mb-4">💡 Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-2">Meilleur moment</p>
                <p className="text-xl font-semibold">
                  {hourlyData.reduce((max, item) => item.conversations > max.conversations ? item : max, {hour: '0h', conversations: 0}).hour}
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">Projet le plus demandé</p>
                <p className="text-xl font-semibold">
                  {projectData.length > 0 ? projectData.reduce((max, p) => p.value > max.value ? p : max).name : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">Taux de leads chauds</p>
                <p className="text-xl font-semibold">
                  {analytics?.total_leads > 0 ? Math.round((analytics.hot_leads / analytics.total_leads) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlanGate>
  );
};

export default Analytics;

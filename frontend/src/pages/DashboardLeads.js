import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Phone, MapPin, DollarSign, Clock, Download, Users } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DashboardLeads = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
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
      const [userRes, leadsRes] = await Promise.all([
        axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/leads`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUser(userRes.data);
      setLeads(leadsRes.data);
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Mes Leads</h2>
              <p className="text-slate-600 mt-1">{leads.length} lead{leads.length > 1 ? 's' : ''} qualifié{leads.length > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={exportLeads}
              disabled={leads.length === 0}
              className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Download size={20} />
              <span>Exporter CSV</span>
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="text-slate-300 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun lead pour le moment</h3>
              <p className="text-slate-600">Les prospects qualifiés apparaîtront ici</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Projet</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Bien</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Localisation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Délai</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{lead.first_name} {lead.last_name}</div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                          <Mail size={14} />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                          <Phone size={14} />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{lead.project_type}</td>
                      <td className="px-6 py-4 text-slate-900">{lead.property_type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <MapPin size={16} className="text-slate-400" />
                          <span>{lead.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <DollarSign size={16} className="text-slate-400" />
                          <span>{lead.budget}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-slate-900">
                          <Clock size={16} className="text-slate-400" />
                          <span>{lead.deadline}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getScoreColor(lead.score)}`}>
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
    </DashboardLayout>
  );
};

export default DashboardLeads;

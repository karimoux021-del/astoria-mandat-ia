import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlanGate = ({ user, requiredPlan, children }) => {
  const planHierarchy = {
    'standard': 1,
    'premium': 2,
    'ultra': 3
  };

  const userPlanLevel = planHierarchy[user?.subscription_plan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  const hasAccess = user?.subscription_status === 'active' && userPlanLevel >= requiredPlanLevel;

  if (!hasAccess) {
    const planNames = {
      'standard': 'Standard',
      'premium': 'Premium',
      'ultra': 'Ultra-Premium'
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B4941F] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Fonctionnalité {planNames[requiredPlan]}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Cette fonctionnalité est réservée aux abonnés {planNames[requiredPlan]} et supérieurs.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="text-[#D4AF37]" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">
                Passez au plan {planNames[requiredPlan]}
              </h3>
            </div>
            <ul className="text-left space-y-3 text-slate-700">
              {requiredPlan === 'ultra' && (
                <>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Personnalisation complète des questions du chatbot</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Analytics avancées avec graphiques détaillés</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Support prioritaire 24/7</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Installation clé en main</span>
                  </li>
                </>
              )}
              {requiredPlan === 'premium' && (
                <>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Multi-agences (jusqu'à 5)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Intégration CRM</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#D4AF37]">✓</span>
                    <span>Analytics avancées</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard?upgrade=true">
              <button className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B4941F] transition-all">
                Mettre à niveau
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-semibold border border-slate-200 hover:bg-slate-50 transition-all">
                Retour au dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PlanGate;

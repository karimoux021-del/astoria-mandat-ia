import React from 'react';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSelectPlan = (plan) => {
    if (!token) {
      navigate('/register');
    } else {
      navigate(`/dashboard?plan=${plan}`);
    }
  };

  const plans = [
    {
      name: 'Standard',
      price: '199',
      plan_id: 'standard',
      features: [
        'IA de qualification 24/7',
        'Scoring simple (Chaud/Tiède/Froid)',
        'Export Google Sheets',
        '1 agence',
        'Support par email',
        'Historique 30 jours'
      ],
      cta: 'Commencer',
      highlighted: false
    },
    {
      name: 'Premium',
      price: '349',
      plan_id: 'premium',
      features: [
        'Tout du plan Standard',
        'Multi-agences (jusqu\'\u00e0 5)',
        'Intégration CRM',
        'Notifications temps réel',
        'Scoring avancé',
        'Historique illimité',
        'Support prioritaire'
      ],
      cta: 'Le plus populaire',
      highlighted: true
    },
    {
      name: 'Ultra-Premium',
      price: '499',
      plan_id: 'ultra',
      features: [
        'Tout du plan Premium',
        'Tunnel complet personnalisé',
        'Scripts fournis',
        'Installation clé en main',
        'Formation de l\'\u00e9quipe',
        'Dédié account manager',
        'Support téléphonique 24/7'
      ],
      cta: 'Entreprise',
      highlighted: false
    }
  ];

  return (
    <section id="tarifs" className="section-padding bg-slate-50" data-testid="pricing-section">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Tarifs <span className="gold-text">transparents</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sans engagement • Annulation à tout moment • Test gratuit disponible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-2xl ${
                plan.highlighted
                  ? 'border-[#D4AF37] shadow-xl scale-105'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              data-testid={`pricing-plan-${plan.plan_id}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star size={14} fill="white" />
                  <span>Recommandé</span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-xl text-slate-600">€/mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start space-x-3">
                    <Check size={20} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.plan_id)}
                className={`w-full py-3 rounded-full font-medium transition-all ${
                  plan.highlighted
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B4941F] shadow-lg'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                data-testid={`pricing-cta-${plan.plan_id}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            🎁 Options activables à la carte : WhatsApp Business, API personnalisée, etc.
          </p>
          <p className="text-sm text-slate-500">
            Tous les prix sont hors taxes. Facturation mensuelle automatique via Stripe.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

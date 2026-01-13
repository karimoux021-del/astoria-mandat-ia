import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, RefreshCw, ExternalLink, Code, Zap } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OnboardingWizard = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(user?.onboarding_step || 0);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStepComplete = async (step) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/user/onboarding`,
        { step: step + 1, completed: step === 3 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (step === 3) {
        toast.success('🎉 Onboarding terminé ! Bienvenue sur Astoria Mandat IA');
        onComplete();
      } else {
        setCurrentStep(step + 1);
      }
    } catch (error) {
      console.error('Erreur onboarding:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const integrationCode = `<!-- Astoria Mandat IA Chatbot -->
<script>
  (function(w,d,s,id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://astoria-mandat-ia.fr/widget.js";
    js.setAttribute('data-key', '${user?.integration_key || 'VOTRE_CLE_ICI'}');
    fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'astoria-chatbot'));
</script>`;

  const steps = [
    {
      title: '👋 Bienvenue sur Astoria Mandat IA',
      description: 'Votre compte a été créé avec succès. Nous allons vous guider pour configurer votre chatbot en quelques minutes.',
      action: () => handleStepComplete(0)
    },
    {
      title: '🔑 Votre clé d\'intégration',
      description: (
        <div className="space-y-4">
          <p>Voici votre clé d'intégration unique. Vous en aurez besoin pour connecter le chatbot à votre site.</p>
          <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-sm flex items-center justify-between">
            <code className="break-all" data-testid="integration-key-display">{user?.integration_key}</code>
            <button
              onClick={() => handleCopyCode(user?.integration_key)}
              className="ml-2 p-2 hover:bg-slate-800 rounded transition-colors"
              data-testid="copy-key-button"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-sm text-slate-600">⚠️ Gardez cette clé en sécurité. Elle permet d'identifier votre agence.</p>
        </div>
      ),
      action: () => handleStepComplete(1)
    },
    {
      title: '💻 Installer le chatbot sur votre site',
      description: (
        <div className="space-y-4">
          <p>Copiez ce code et collez-le juste avant la balise <code className="bg-slate-100 px-2 py-1 rounded">&lt;/body&gt;</code> de votre site web :</p>
          <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-xs overflow-x-auto relative">
            <pre className="whitespace-pre-wrap break-all">{integrationCode}</pre>
            <button
              onClick={() => handleCopyCode(integrationCode)}
              className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              data-testid="copy-code-button"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">🎯 Plateformes supportées :</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• WordPress, Wix, Shopify</li>
              <li>• HTML/CSS personnalisé</li>
              <li>• React, Vue, Angular</li>
            </ul>
          </div>
        </div>
      ),
      action: () => handleStepComplete(2)
    },
    {
      title: '✅ Vérification et activation',
      description: (
        <div className="space-y-4">
          <p>Pour vérifier que tout fonctionne :</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Ouvrez votre site web dans un navigateur</li>
            <li>Un bouton rond devrait apparaître en bas à droite</li>
            <li>Cliquez dessus et testez une conversation</li>
            <li>Vérifiez que le lead apparaît dans votre dashboard</li>
          </ol>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-900 font-medium mb-2">📚 Besoin d'aide ?</p>
            <p className="text-sm text-green-800">Consultez notre guide complet d'intégration ou contactez le support.</p>
          </div>
        </div>
      ),
      action: () => handleStepComplete(3)
    }
  ];

  if (user?.onboarding_completed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="onboarding-wizard">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Étape {currentStep + 1} sur {steps.length}</span>
              <span className="text-sm font-medium text-slate-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{steps[currentStep].title}</h2>
            <div className="text-slate-700 leading-relaxed">
              {typeof steps[currentStep].description === 'string' ? (
                <p>{steps[currentStep].description}</p>
              ) : (
                steps[currentStep].description
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-slate-600 hover:text-slate-900 font-medium"
                data-testid="onboarding-back-button"
              >
                ← Retour
              </button>
            )}
            <button
              onClick={steps[currentStep].action}
              className="ml-auto bg-[#D4AF37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#B4941F] transition-all flex items-center space-x-2"
              data-testid="onboarding-next-button"
            >
              <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Continuer'}</span>
              {currentStep === steps.length - 1 ? <CheckCircle2 size={20} /> : <span>→</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;

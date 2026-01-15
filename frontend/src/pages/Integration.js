import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Check, RefreshCw, ExternalLink, FileText, Code, Globe, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Integration = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur auth:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copié dans le presse-papiers !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = async () => {
    if (!window.confirm('⚠️ Attention : Régénérer la clé désactivera l\'ancienne clé. Votre chatbot cessera de fonctionner sur votre site jusqu\'à ce que vous mettiez à jour le code. Continuer ?')) {
      return;
    }

    setRegenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/user/regenerate-key`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, integration_key: response.data.integration_key });
      toast.success('Nouvelle clé générée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la régénération');
    } finally {
      setRegenerating(false);
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

  const wordpressCode = `// Pour WordPress, ajoutez dans functions.php :
add_action('wp_footer', function() {
  echo '${integrationCode.replace(/\n/g, ' ').replace(/'/g, "\\'")}';
});`;

  if (!user) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-4">Guide d'intégration rapide</h2>
        <p className="text-slate-200 text-lg mb-4">
          Intégrez le chatbot Astoria Mandat IA sur votre site en moins de 5 minutes
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Installation facile</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Compatible tous sites</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="text-green-400" size={20} />
            <span>Disponible 24/7</span>
          </div>
        </div>
      </div>

        {/* Étape 1 : Clé d'intégration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6" data-testid="integration-key-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">🔑 Étape 1 : Votre clé d'intégration</h3>
              <p className="text-slate-600">Cette clé unique identifie votre agence</p>
            </div>
            <button
              onClick={handleRegenerateKey}
              disabled={regenerating}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
              data-testid="regenerate-key-button"
            >
              <RefreshCw size={18} className={regenerating ? 'animate-spin' : ''} />
              <span>Régénérer</span>
            </button>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-sm flex items-center justify-between">
            <code className="break-all flex-1" data-testid="integration-key">{user.integration_key}</code>
            <button
              onClick={() => handleCopy(user.integration_key)}
              className="ml-4 p-2 hover:bg-slate-800 rounded transition-colors"
              data-testid="copy-key-button"
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-3">⚠️ Gardez cette clé en sécurité. Ne la partagez jamais publiquement.</p>
        </div>

        {/* Étape 2 : Code d'intégration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6" data-testid="integration-code-section">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">💻 Étape 2 : Installer le code</h3>
          <p className="text-slate-600 mb-6">Copiez ce code et collez-le juste avant la balise <code className="bg-slate-100 px-2 py-1 rounded">&lt;/body&gt;</code> de votre site</p>
          
          <div className="relative">
            <div className="bg-slate-900 text-white p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap break-all">{integrationCode}</pre>
            </div>
            <button
              onClick={() => handleCopy(integrationCode)}
              className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
              data-testid="copy-integration-code"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Plateformes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">🌐 Instructions par plateforme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="text-[#D4AF37]" size={24} />
                <h4 className="font-semibold text-slate-900">Site HTML/Custom</h4>
              </div>
              <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Ouvrez votre fichier HTML principal</li>
                <li>Collez le code avant <code>&lt;/body&gt;</code></li>
                <li>Enregistrez et rafraîchissez</li>
              </ol>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="text-[#D4AF37]" size={24} />
                <h4 className="font-semibold text-slate-900">WordPress</h4>
              </div>
              <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Installez le plugin "Insert Headers and Footers"</li>
                <li>Allez dans Réglages → Insert Headers</li>
                <li>Collez dans "Scripts in Footer"</li>
              </ol>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Code className="text-[#D4AF37]" size={24} />
                <h4 className="font-semibold text-slate-900">Wix</h4>
              </div>
              <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Paramètres → Suivi et analytiques</li>
                <li>+ Nouvel outil → Code personnalisé</li>
                <li>Choisissez "Body - end"</li>
              </ol>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="text-[#D4AF37]" size={24} />
                <h4 className="font-semibold text-slate-900">Shopify</h4>
              </div>
              <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
                <li>Boutique en ligne → Thèmes</li>
                <li>Actions → Modifier le code</li>
                <li>Ouvrez theme.liquid, collez avant <code>&lt;/body&gt;</code></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Vérification */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-green-900 mb-4">✅ Étape 3 : Vérifier l'installation</h3>
          <ol className="space-y-3 text-green-800">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Ouvrez votre site dans un navigateur</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Un bouton rond devrait apparaître en bas à droite</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Cliquez et testez une conversation complète</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Vérifiez que le lead apparaît dans votre dashboard</span>
            </li>
          </ol>
        </div>

        {/* Documentation */}
        <div className="bg-slate-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">📚 Besoin d'aide ?</h3>
          <p className="text-slate-600 mb-6">Consultez notre guide complet ou contactez le support</p>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://docs.astoria-mandat-ia.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white text-slate-900 px-6 py-3 rounded-full font-medium hover:bg-slate-50 transition-all border border-slate-200"
            >
              <FileText size={18} />
              <span>Documentation</span>
              <ExternalLink size={14} />
            </a>
            <Link
              to="/support"
              className="flex items-center space-x-2 bg-[#D4AF37] text-white px-6 py-3 rounded-full font-medium hover:bg-[#B4941F] transition-all"
            >
              <span>Contacter le support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;

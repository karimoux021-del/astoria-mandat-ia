import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import ChatBot from '../components/ChatBot';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Clock, BarChart3, Shield, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="hero-bg pt-32 pb-20 relative" data-testid="hero-section">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-sm font-medium text-[#D4AF37]">✨ Solution IA pour agences immobilières</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Qualifiez vos prospects immobiliers <span className="gold-text">24/7 avec l'IA</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              Astoria Mandat IA transforme vos visiteurs en leads qualifiés automatiquement. Plus de formulaires flous, plus de temps perdu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" data-testid="hero-cta-register">
                <button className="btn-accent text-lg px-10 py-4">
                  Essayer gratuitement
                </button>
              </Link>
              <a href="#demo" data-testid="hero-cta-demo">
                <button className="btn-secondary text-lg px-10 py-4">
                  Voir la démo
                </button>
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-300">
              ✅ Sans engagement • ✅ Installation en 5 minutes • ✅ Support en français
            </p>
          </div>
        </div>
      </section>

      {/* Problèmes Section */}
      <section className="section-padding bg-white" data-testid="problems-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Les <span className="gold-text">problèmes</span> des agences immobilières
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Vous perdez du temps et des opportunités chaque jour
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Formulaires flous</h3>
              <p className="text-slate-600">
                Les prospects remplissent des formulaires incomplets sans détails sur leur projet réel
              </p>
            </div>

            <div className="card text-center group hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⏳</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Temps perdu</h3>
              <p className="text-slate-600">
                Vos équipes passent des heures à recontacter des prospects non qualifiés
              </p>
            </div>

            <div className="card text-center group hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Leads perdus</h3>
              <p className="text-slate-600">
                Les prospects qui arrivent hors horaires ou le week-end ne sont jamais contactés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-slate-50" data-testid="solution-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              La <span className="gold-text">solution</span> Astoria Mandat IA
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Un assistant IA qui qualifie intelligemment chaque prospect
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">IA conversationnelle naturelle</h3>
                  <p className="text-slate-600">Pose une question à la fois, comprend les réponses libres, même avec des fautes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Qualification précise</h3>
                  <p className="text-slate-600">Collecte 10 données essentielles : type de projet, bien, ville, budget, délai...</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Scoring automatique</h3>
                  <p className="text-slate-600">🔥 Chaud (&lt;3 mois) • 🟡 Tiède (3-6 mois) • ❄️ Froid (+6 mois)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Disponible 24/7</h3>
                  <p className="text-slate-600">Aucun prospect ne passe à travers les mailles, même à 3h du matin</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559209537-dafe2fe2886b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjByZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBvZmZpY2V8ZW58MHx8fHwxNzY4MzA5NDYxfDA&ixlib=rb-4.1.0&q=85"
                alt="Espace de travail moderne"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="section-padding bg-white" data-testid="how-it-works-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Comment <span className="gold-text">ça marche</span> ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              4 étapes simples pour transformer vos prospects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap />, title: 'Visiteur arrive', desc: 'Un prospect visite votre site' },
              { icon: <Sparkles />, title: 'IA engage', desc: 'Le chatbot l\'accueille et pose des questions' },
              { icon: <CheckCircle2 />, title: 'Données collectées', desc: 'L\'IA récupère toutes les infos nécessaires' },
              { icon: <TrendingUp />, title: 'Lead qualifié', desc: 'Le prospect est scoré et envoyé dans votre dashboard' }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative">
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent" />
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37] relative z-10">
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">Étape {idx + 1}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Données collectées */}
      <section className="section-padding bg-slate-50" data-testid="data-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Données <span className="gold-text">collectées</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              10 informations essentielles pour chaque prospect
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {[
              'Prénom & Nom',
              'Email',
              'Téléphone',
              'Type de projet',
              'Type de bien',
              'Ville / Secteur',
              'Budget',
              'Délai',
              'Message libre',
              'Score auto'
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 text-center border border-slate-200 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espace client */}
      <section className="section-padding bg-white" data-testid="dashboard-preview-section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Espace client <span className="gold-text">sécurisé</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Gérez tous vos leads en temps réel depuis un tableau de bord intuitif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <Shield className="text-[#D4AF37] mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sécurisé & Conforme RGPD</h3>
              <p className="text-slate-600">Vos données et celles de vos clients sont protégées</p>
            </div>
            <div className="card">
              <BarChart3 className="text-[#D4AF37] mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Statistiques en temps réel</h3>
              <p className="text-slate-600">Suivez vos leads, taux de conversion, et performances</p>
            </div>
            <div className="card">
              <TrendingUp className="text-[#D4AF37] mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Export & Intégrations</h3>
              <p className="text-slate-600">Téléchargez vos leads ou connectez votre CRM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Démo interactive */}
      <section id="demo" className="section-padding bg-slate-900 text-white" data-testid="demo-section">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Testez <span className="gold-text">maintenant</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Cliquez sur le chatbot en bas à droite pour tester l'IA en direct
          </p>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            <span className="text-[#D4AF37]">👉</span>
            <span className="text-sm font-medium">Le chatbot apparaît en bas à droite de votre écran</span>
          </div>
        </div>
      </section>

      <PricingSection />
      <FAQSection />

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-br from-slate-900 to-slate-800 text-white" data-testid="final-cta-section">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer vos prospects en <span className="gold-text">mandats</span> ?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez les agences immobilières qui ont choisi Astoria Mandat IA
          </p>
          <Link to="/register" data-testid="final-cta-button">
            <button className="btn-accent text-lg px-12 py-4">
              Commencer gratuitement
            </button>
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Installation en 5 minutes • Sans engagement • Annulation à tout moment
          </p>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Landing;

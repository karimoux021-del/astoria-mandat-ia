import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Comment fonctionne l'IA de qualification ?",
      answer: "Notre IA pose une question à la fois pour comprendre les besoins de vos prospects. Elle utilise le traitement du langage naturel (NLP) pour comprendre les réponses libres, même avec des fautes d'orthographe. Elle collecte 10 données essentielles et attribue automatiquement un score (Chaud/Tiède/Froid) selon le délai du projet."
    },
    {
      question: "Puis-je essayer avant de m'abonner ?",
      answer: "Oui ! Vous pouvez tester le chatbot interactif directement sur cette page. Pour accéder à l'espace client complet et voir vos leads, créez un compte gratuitement. Aucune carte bancaire n'est requise pour l'essai."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Absolument. Tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment depuis votre espace client. L'annulation est immédiate et aucun frais supplémentaire n'est appliqué."
    },
    {
      question: "Quelles intégrations sont disponibles ?",
      answer: "Selon votre plan : Google Sheets (Standard), intégrations CRM principales (Premium), WhatsApp Business, API personnalisée, et plus encore (Ultra-Premium). Toutes les intégrations sont activables/désactivables depuis votre espace client."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui, toutes les données sont stockées de manière sécurisée et conforme au RGPD. Nous utilisons un chiffrement SSL/TLS pour toutes les communications. Vos leads restent votre propriété et vous pouvez les exporter à tout moment."
    },
    {
      question: "L'IA fonctionne-t-elle vraiment 24/7 ?",
      answer: "Oui ! Le chatbot IA est disponible 24h/24, 7j/7, même les week-ends et jours fériés. Il ne prend jamais de congés et qualifie vos prospects instantanément, même à 3h du matin."
    },
    {
      question: "Combien de leads puis-je gérer ?",
      answer: "Il n'y a pas de limite au nombre de leads. Le plan Standard convient jusqu'à 100 leads/mois, Premium jusqu'à 500 leads/mois, et Ultra-Premium est illimité. Vous pouvez évoluer vers un plan supérieur à tout moment."
    },
    {
      question: "Proposez-vous un support en français ?",
      answer: "Oui ! Notre support est entièrement en français. Support par email pour tous, support prioritaire pour Premium, et support téléphonique 24/7 pour Ultra-Premium. Notre équipe connaît parfaitement le marché immobilier français."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-white" data-testid="faq-section">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Questions <span className="gold-text">fréquentes</span>
          </h2>
          <p className="text-lg text-slate-600">
            Tout ce que vous devez savoir sur Astoria Mandat IA
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="bg-slate-50 rounded-xl px-6 border border-slate-200"
              data-testid={`faq-item-${idx}`}
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-slate-700">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Vous avez une autre question ?</p>
          <a href="mailto:contact@astoria-mandat.fr" className="text-[#D4AF37] hover:text-[#B4941F] font-medium">
            Contactez-nous par email →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

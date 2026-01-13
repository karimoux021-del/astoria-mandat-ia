import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-xl">A</span>
              </div>
              <span className="text-lg font-semibold">Astoria Mandat IA</span>
            </div>
            <p className="text-slate-400 text-sm">
              La solution IA pour qualifier vos prospects immobiliers 24/7
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#D4AF37]">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#fonctionnalites" className="text-slate-400 hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#tarifs" className="text-slate-400 hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Connexion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#D4AF37]">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">CGU</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#D4AF37]">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-slate-400">
                <Mail size={16} />
                <span>contact@astoria-mandat.fr</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Phone size={16} />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <MapPin size={16} />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>© 2025 Astoria Mandat IA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

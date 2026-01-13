import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navClass = transparent
    ? 'fixed top-0 left-0 right-0 z-50 glassmorphism'
    : 'bg-white border-b border-slate-200';

  return (
    <nav className={navClass} data-testid="navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">Astoria Mandat IA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" data-testid="nav-features">Fonctionnalités</a>
            <a href="#tarifs" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" data-testid="nav-pricing">Tarifs</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 font-medium transition-colors" data-testid="nav-faq">FAQ</a>
            
            {token ? (
              <>
                <Link to="/dashboard" data-testid="nav-dashboard">
                  <button className="btn-primary">Tableau de bord</button>
                </Link>
                <button onClick={handleLogout} className="btn-secondary" data-testid="nav-logout">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="nav-login">
                  <button className="btn-secondary">Connexion</button>
                </Link>
                <Link to="/register" data-testid="nav-register">
                  <button className="btn-accent">Essai gratuit</button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="nav-mobile-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4" data-testid="nav-mobile-menu">
            <a href="#fonctionnalites" className="block text-slate-600 hover:text-slate-900">Fonctionnalités</a>
            <a href="#tarifs" className="block text-slate-600 hover:text-slate-900">Tarifs</a>
            <a href="#faq" className="block text-slate-600 hover:text-slate-900">FAQ</a>
            {token ? (
              <>
                <Link to="/dashboard" className="block">
                  <button className="btn-primary w-full">Tableau de bord</button>
                </Link>
                <button onClick={handleLogout} className="btn-secondary w-full">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <button className="btn-secondary w-full">Connexion</button>
                </Link>
                <Link to="/register" className="block">
                  <button className="btn-accent w-full">Essai gratuit</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

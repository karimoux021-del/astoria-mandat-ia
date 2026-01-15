import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, BarChart3, Settings, Code, MessageSquare, Crown, LogOut, Shield } from 'lucide-react';

const DashboardLayout = ({ children, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Vue d\'ensemble', testId: 'nav-overview' },
    { path: '/dashboard/leads', icon: Users, label: 'Mes Leads', testId: 'nav-leads' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', testId: 'nav-analytics', badge: user?.subscription_plan === 'premium' || user?.subscription_plan === 'ultra' },
    { path: '/dashboard/customize', icon: Settings, label: 'Personnaliser', testId: 'nav-customize', badge: user?.subscription_plan === 'ultra' },
    { path: '/dashboard/integration', icon: Code, label: 'Intégration', testId: 'nav-integration' },
    { path: '/dashboard/support', icon: MessageSquare, label: 'Support', testId: 'nav-support' }
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/dashboard/admin', icon: Shield, label: 'Admin Panel', testId: 'nav-admin', isAdmin: true });
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Astoria Mandat IA</h1>
              {user?.subscription_plan && (
                <span className="text-xs text-[#D4AF37] font-medium flex items-center space-x-1">
                  <Crown size={12} />
                  <span className="capitalize">{user.subscription_plan}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? item.isAdmin
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                  data-testid={item.testId}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Pro
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-bold text-sm">
                {user?.contact_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.contact_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.agency_name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            data-testid="sidebar-logout"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Bienvenue,</p>
              <h2 className="text-xl font-bold text-slate-900">{user?.contact_name}</h2>
            </div>
            {user?.subscription_status !== 'active' && (
              <NavLink to="/dashboard">
                <button className="bg-[#D4AF37] text-white px-6 py-2 rounded-full font-medium hover:bg-[#B4941F] transition-all shadow-sm">
                  Activer mon abonnement
                </button>
              </NavLink>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

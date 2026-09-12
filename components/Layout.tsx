import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Users, PieChart, Settings, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Search, label: 'New Analysis', path: '/analyze' },
    { icon: Users, label: 'CRM Leads', path: '/leads' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">W</div>
          <span className="font-bold text-xl tracking-tight">Wethaq AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/settings" className={`flex items-center gap-3 px-4 py-2 hover:text-white cursor-pointer transition-colors ${isActive('/settings') ? 'text-white' : 'text-slate-400'}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <span className="font-bold text-lg text-slate-900">Wethaq AI</span>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-slate-600">
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="absolute top-16 left-0 w-full bg-slate-900 text-white z-50 p-4 pb-8 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-4 border-b border-slate-800"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
                to="/settings"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 text-slate-400"
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
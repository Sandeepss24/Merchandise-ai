import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Calendar, ScanLine, Clock, User as UserIcon, LogOut, BarChart3, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['MERCHANDISER', 'RETAIL_OPS_HEAD'] },
    { name: 'Store Insights', path: '/insights', icon: BarChart3, roles: ['RETAIL_OPS_HEAD'] },
    { name: 'Locations', path: '/locations', icon: MapPin, roles: ['MERCHANDISER', 'RETAIL_OPS_HEAD'] },
    { name: 'Schedule', path: '/schedule', icon: Calendar, roles: ['MERCHANDISER', 'RETAIL_OPS_HEAD'] },
    { name: 'Scan Merch Forms', path: '/scan', icon: ScanLine, roles: ['MERCHANDISER'] },
    { name: 'Audit History', path: '/audits', icon: Clock, roles: ['MERCHANDISER', 'RETAIL_OPS_HEAD'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
        <span className="text-xl font-bold text-text flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <ScanLine className="w-5 h-5" />
          </div>
          Merch AI
        </span>
        <button 
          className="md:hidden p-1 text-text-secondary hover:bg-gray-100 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                  isActive 
                    ? "bg-primary-light text-primary" 
                    : "text-text-secondary hover:bg-gray-50 hover:text-text"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mr-3 flex-shrink-0",
                  "text-current"
                )} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-1.5 flex-shrink-0">
        <NavLink
          to="/profile"
          className={({ isActive }) => cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
            isActive ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-gray-50 hover:text-text"
          )}
        >
          <UserIcon className="w-5 h-5 mr-3" />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:bg-gray-50 hover:text-error transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

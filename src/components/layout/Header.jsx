import React, { useState } from 'react';
import { Bell, Search, Menu, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../context/MockDataContext';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { notifications = [] } = useMockData();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden p-2 -ml-2 text-text-secondary hover:bg-gray-100 rounded-md"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores, audits..."
            className="h-9 w-64 rounded-md border border-border bg-gray-50/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-text-secondary hover:text-text rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface"></span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-border shadow-lg rounded-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-text text-sm">Notifications</h3>
                  {unreadCount > 0 && <span className="text-xs text-primary font-bold">{unreadCount} unread</span>}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {userNotifications.length > 0 ? (
                    <div className="divide-y divide-border">
                      {userNotifications.map((notif) => (
                        <div key={notif.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-primary-surface/30' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'error' ? 'bg-error' : notif.type === 'warning' ? 'bg-warning' : notif.type === 'success' ? 'bg-success' : 'bg-primary'}`} />
                            <div>
                              <p className="text-sm font-bold text-text leading-tight">{notif.title}</p>
                              <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-2 font-medium">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-text-secondary">
                      <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-border bg-gray-50 text-center">
                  <button className="text-xs font-bold text-primary hover:underline">Mark all as read</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-text-secondary mt-1 tracking-wide">
              {user?.role === 'MERCHANDISER' ? 'Merchandiser' : 'Retail Ops Head'}
            </p>
          </div>
          <img
            src={user?.avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

const Navbar = ({ role = 'patient', userName = 'John Doe', setIsSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample notifications
  const notifications = [
    { id: 1, title: 'New Appointment', message: 'You have a new appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, title: 'Lab Results Ready', message: 'Your test results are now available', time: '1 hour ago', unread: true },
    { id: 3, title: 'Prescription Updated', message: 'Your prescription has been updated', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    // TODO: Add logout logic here
    console.log('Logging out...');
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* Left Section - Menu & Search */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-4 py-2 w-full max-w-md">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Search Icon (Mobile) */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-blue-100 text-xs">{unreadCount} unread notifications</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notif.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800">{notif.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-600 capitalize">{role} Account</p>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
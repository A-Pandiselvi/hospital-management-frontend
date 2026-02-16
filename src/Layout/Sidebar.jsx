import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Calendar, 
  FileText, 
  Settings, 
  Stethoscope,
  ClipboardList,
  Clock,
  UserCircle,
  CalendarPlus,
  FolderOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role = 'patient', isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
const navigate = useNavigate();
  // Menu items based on role
  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { id: 'doctors', label: 'Manage Doctors', icon: UserCog, path: '/admin/doctors' },
      { id: 'patients', label: 'Manage Patients', icon: Users, path: '/admin/patients' },
      { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
      { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
    doctor: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
      { id: 'appointments', label: 'My Appointments', icon: Calendar, path: '/doctor/appointments' },
      { id: 'patients', label: 'My Patients', icon: Users, path: '/doctor/patients' },
      { id: 'schedule', label: 'Schedule', icon: Clock, path: '/doctor/schedule' },
      { id: 'profile', label: 'Profile', icon: UserCircle, path: '/doctor/profile' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/doctor/settings' },
    ],
    patient: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/patient/dashboard' },
      { id: 'book', label: 'Book Appointment', icon: CalendarPlus, path: '/patient/book-appointment' },
      { id: 'appointments', label: 'My Appointments', icon: Calendar, path: '/patient/appointments' },
      { id: 'records', label: 'Medical Records', icon: FolderOpen, path: '/patient/records' },
      { id: 'profile', label: 'Profile', icon: UserCircle, path: '/patient/profile' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/patient/settings' },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.patient;

const handleMenuClick = (item) => {
  setActiveTab(item.id);
  navigate(item.path);

  // close sidebar in mobile & tablet
  if (window.innerWidth < 1024) {
    setIsOpen(false);
  }
};

  return (
    <>
      {/* Sidebar */}
      <aside
    className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white z-40 transition-all duration-300
${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} lg:translate-x-0 ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}

      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">HMS</h2>
                <p className="text-xs text-blue-200">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </p>
              </div>
            </div>
          )}
          
          {!isOpen && (
            <div className="bg-white/20 p-2 rounded-lg mx-auto">
              <Stethoscope className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {currentMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-blue-900 shadow-lg'
                        : 'text-blue-100 hover:bg-blue-700/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-900' : ''}`} />
                    {isOpen && (
                      <span className={`font-medium ${isActive ? 'text-blue-900' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
       <button
  onClick={() => setIsOpen(!isOpen)}
className={`absolute -right-3 top-20 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-500 transition-colors items-center justify-center
${isOpen ? 'flex' : 'hidden'} lg:flex`}
>

          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Role Badge at Bottom */}
        <div className="p-4 border-t border-blue-700">
          {isOpen ? (
            <div className="bg-blue-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-200">Logged in as</p>
              <p className="font-semibold text-sm mt-1">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          ) : (
            <div className="bg-blue-700/50 rounded-lg p-2 text-center">
              <p className="font-semibold text-xs">
                {role.charAt(0).toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
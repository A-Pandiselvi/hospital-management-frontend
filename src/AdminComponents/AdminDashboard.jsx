import React from 'react';
import { Users, UserCog, Calendar, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { 
      id: 1, 
      title: 'Total Patients', 
      value: '1,234', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 2, 
      title: 'Total Doctors', 
      value: '56', 
      change: '+5%', 
      icon: UserCog, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 3, 
      title: 'Appointments Today', 
      value: '89', 
      change: '+8%', 
      icon: Calendar, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 4, 
      title: 'Revenue', 
      value: '$45,678', 
      change: '+15%', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                  <p className="text-green-600 text-sm mt-2 font-semibold">{stat.change} from last month</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">P{item}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Patient Name {item}</p>
                    <p className="text-sm text-gray-600">Dr. Smith - Cardiology</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2:00 PM</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">New Registrations</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">N{item}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">New User {item}</p>
                    <p className="text-sm text-gray-600">Patient Registration</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
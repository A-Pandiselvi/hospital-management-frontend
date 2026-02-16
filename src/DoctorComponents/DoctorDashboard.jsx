import React from 'react';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const stats = [
    { 
      id: 1, 
      title: 'Today\'s Appointments', 
      value: '12', 
      icon: Calendar, 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 2, 
      title: 'Total Patients', 
      value: '234', 
      icon: Users, 
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 3, 
      title: 'Pending', 
      value: '5', 
      icon: Clock, 
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 4, 
      title: 'Completed', 
      value: '7', 
      icon: CheckCircle, 
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  const todayAppointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Consultation', status: 'completed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'completed' },
    { id: 3, patient: 'Mike Johnson', time: '11:00 AM', type: 'Consultation', status: 'in-progress' },
    { id: 4, patient: 'Sarah Wilson', time: '02:00 PM', type: 'Check-up', status: 'pending' },
    { id: 5, patient: 'Tom Brown', time: '03:30 PM', type: 'Consultation', status: 'pending' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Dr. Smith! You have 5 appointments pending today.</p>
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
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
        </div>

        <div className="space-y-3">
          {todayAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {appointment.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-800">{appointment.time}</p>
                  <span 
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                {appointment.status === 'pending' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Start
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
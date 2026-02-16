import React from 'react';
import { Calendar, FileText, Clock, Activity } from 'lucide-react';

const PatientDashboard = () => {
  const quickStats = [
    { 
      id: 1, 
      title: 'Upcoming Appointments', 
      value: '2', 
      icon: Calendar, 
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 2, 
      title: 'Medical Records', 
      value: '15', 
      icon: FileText, 
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 3, 
      title: 'Last Visit', 
      value: '3 days ago', 
      icon: Clock, 
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 4, 
      title: 'Health Score', 
      value: '92%', 
      icon: Activity, 
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  const upcomingAppointments = [
    { 
      id: 1, 
      doctor: 'Dr. Sarah Johnson', 
      specialty: 'Cardiologist', 
      date: 'Feb 18, 2026', 
      time: '10:00 AM',
      type: 'Follow-up'
    },
    { 
      id: 2, 
      doctor: 'Dr. Michael Chen', 
      specialty: 'Dentist', 
      date: 'Feb 22, 2026', 
      time: '02:30 PM',
      type: 'Check-up'
    },
  ];

  const recentRecords = [
    { id: 1, title: 'Blood Test Results', date: 'Feb 13, 2026', doctor: 'Dr. Sarah Johnson' },
    { id: 2, title: 'X-Ray Report', date: 'Feb 10, 2026', doctor: 'Dr. Michael Chen' },
    { id: 3, title: 'Prescription', date: 'Feb 8, 2026', doctor: 'Dr. Sarah Johnson' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your health overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {appointment.doctor.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {appointment.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all">
            Book New Appointment
          </button>
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Medical Records</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>

          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{record.title}</p>
                    <p className="text-xs text-gray-600">{record.doctor}</p>
                    <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Health Tip */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">💡 Health Tip</p>
            <p className="text-sm text-blue-700">
              Remember to stay hydrated and take your medications on time. Schedule regular check-ups for better health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
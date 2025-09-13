import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaHome, FaSubscript, FaUserFriends, FaCreditCard, FaFileAlt, FaBars, FaTimes } from 'react-icons/fa';
import SubscribersPage from '../components/SubscribersPage';
import DashboardContent from '../components/DashboardContent';
import SubscriptionManagement from '../components/SubscriptionManagement';
import ActiveSubscribersPage from '../components/ActiveSubscribersPage';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'subscriptions', label: 'Subscriptions', icon: FaSubscript },
    { id: 'subscribers', label: 'Subscribers', icon: FaUserFriends },
    { id: 'transactions', label: 'Transactions', icon: FaCreditCard },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-pink-600 rounded-full blur-3xl"></div>
      </div>
      
      {/* Sidebar */}
      <div className={`bg-white/80 backdrop-blur-md shadow-xl border-r border-white/20 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} lg:w-64 relative z-10`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <FaHome className="text-white text-xl" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Panel</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 rounded-lg mx-2 ${
                  activeTab === item.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-600 text-blue-700 shadow-md' : 'text-gray-700'
                }`}
              >
                <Icon className="text-lg mr-3" />
                <span className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg mx-2 transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg mr-3" />
            <span className={`${sidebarOpen ? 'block' : 'hidden'} lg:block font-medium`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-500 hover:text-blue-600 mr-4 transition-colors duration-200"
                >
                  <FaBars />
                </button>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent capitalize">{activeTab}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Welcome, {user?.name || user?.email} 👋</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 relative z-10">
          {activeTab === 'dashboard' && (
            <DashboardContent onShowActiveSubscribers={() => setActiveTab('active-subscribers')} />
          )}

          {activeTab === 'active-subscribers' && (
            <ActiveSubscribersPage onBack={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionManagement />
          )}

          {activeTab === 'subscribers' && (
            <SubscribersPage />
          )}

          {activeTab === 'transactions' && (
            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Transaction History 💳</h3>
              <p className="text-gray-600">View all payment transactions and billing history.</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reports & Analytics 📊</h3>
              <p className="text-gray-600">Generate and view detailed reports.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
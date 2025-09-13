import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome, FaBell, FaFileAlt, FaSubscript, FaCreditCard, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [subsRes, transRes] = await Promise.all([
        axios.get('http://localhost:8000/api/subscriptions/'),
        axios.get('http://localhost:8000/api/transactions/')
      ]);
      
      // Filter data for current user - only active subscriptions
      const userSubs = subsRes.data.filter(sub => 
        sub.user_email === user.email && sub.status === 'active'
      );
      const userTrans = transRes.data.filter(trans => 
        trans.user_name && (trans.user_name.includes(user.name) || trans.user_name.includes(user.email))
      );
      
      setUserSubscriptions(userSubs);
      setUserTransactions(userTrans);
      
      // Set Lumen Technologies products
      const lumenProducts = [
        {
          product_id: 1,
          name: 'Dedicated Internet Access',
          description: 'High-speed dedicated internet connectivity',
          price: 299,
          billing_type: 'Monthly',
          category: 'Connectivity'
        },
        {
          product_id: 2,
          name: 'DDoS Hyper Protection',
          description: 'Advanced DDoS mitigation and security service',
          price: 199,
          billing_type: 'Monthly',
          category: 'Security'
        },
        {
          product_id: 3,
          name: 'SASE with Fortinet',
          description: 'Secure Access Service Edge with SD-WAN',
          price: 449,
          billing_type: 'Monthly',
          category: 'Security & Networking'
        },
        {
          product_id: 4,
          name: 'Edge Bare Metal',
          description: 'High-performance edge infrastructure',
          price: 599,
          billing_type: 'Monthly',
          category: 'Infrastructure'
        },
        {
          product_id: 5,
          name: 'Colocation & Dark Fiber',
          description: 'Data center colocation and fiber connectivity',
          price: 899,
          billing_type: 'Monthly',
          category: 'Infrastructure'
        },
        {
          product_id: 6,
          name: 'UC&C Cloud Voice',
          description: 'Unified communications and cloud voice services',
          price: 149,
          billing_type: 'Monthly',
          category: 'Communications'
        },
        {
          product_id: 7,
          name: 'Managed Services',
          description: 'Comprehensive managed IT services and support',
          price: 799,
          billing_type: 'Monthly',
          category: 'Managed Services'
        }
      ];
      
      setAvailablePlans(lumenProducts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when component becomes visible (after returning from payment)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.email) {
        fetchUserData();
      }
    };

    const handleFocus = () => {
      if (user?.email) {
        fetchUserData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleCancelSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      try {
        const response = await axios.put(`http://localhost:8000/api/subscriptions/${subscriptionId}/update/`, {
          status: 'cancelled',
          terminated_date: new Date().toISOString().split('T')[0]
        });
        
        if (response.status === 200) {
          alert('Subscription cancelled successfully.');
          fetchUserData(); // Refresh data
        }
      } catch (error) {
        alert('Error cancelling subscription. Please try again.');
        console.error('Cancel subscription error:', error);
      }
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-pink-600 rounded-full blur-3xl"></div>
      </div>
      

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <FaHome className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>

            <div className="relative z-10 px-6 py-8 text-white">
              <h3 className="text-2xl font-bold mb-3">
                Welcome back, {user?.name || 'User'}! 🎉
              </h3>
              <p className="text-blue-100 text-lg">
                You have {userSubscriptions.length} active subscription(s) and {userTransactions.length} transaction(s).
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 relative z-10">
              <p className="text-white/80 text-sm">Manage your subscriptions and track your activity from your personalized dashboard.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
                    <FaSubscript className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">My Subscriptions</p>
                    <p className="text-3xl font-bold text-gray-900">{userSubscriptions.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div 
              className="bg-white/70 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/transactions')}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl mr-4">
                    <FaCreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Transactions</p>
                    <p className="text-3xl font-bold text-gray-900">{userTransactions.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                    <FaBell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Notifications</p>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl mr-4">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Status</p>
                    <p className={`text-xl font-bold ${
                      userSubscriptions.length > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {userSubscriptions.length > 0 ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Active Subscriptions */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl mb-8 border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-transparent opacity-50"></div>
            <div className="px-6 py-5 border-b border-gray-200/50 relative z-10">
              <h3 className="text-xl font-bold text-gray-900">My Active Plans 💼</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : userSubscriptions.length > 0 ? (
                <div className="space-y-4">
                  {userSubscriptions.map((subscription) => (
                    <div key={subscription.subscription_id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{subscription.plan_name}</h4>
                          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{subscription.subscription_type} subscription</p>
                          <p className="text-sm text-gray-600 mt-2">Started: {subscription.start_date}</p>
                          <p className="text-sm text-gray-600">Last Billed: {subscription.last_billed_date || 'Not billed yet'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${subscription.plan_price}</p>
                          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
                            ✓ Active Plan
                          </span>
                          <p className="text-xs text-gray-500 mt-2">Next billing: {subscription.last_renewed_date || 'TBD'}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCancelSubscription(subscription.subscription_id)}
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200 font-medium"
                        >
                          <FaTimes className="mr-2" />
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No active plans found.</p>
                  <button 
                    onClick={() => navigate('/services')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🔍 Browse Lumen Services
                  </button>
                </div>
              )}
            </div>
          </div>


        </div>
      </main>

      {/* Browse Plans Modal */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Lumen Technologies Services</h3>
                <p className="text-gray-600">Enterprise-grade connectivity and technology solutions</p>
              </div>
              <button
                onClick={() => setShowPlansModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div key={plan.product_id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plan.category}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">${plan.price}</div>
                        <div className="text-xs text-gray-500">{plan.billing_type}</div>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Enterprise-grade reliability
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      24/7 technical support
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Scalable solutions
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      SLA guaranteed
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowPlansModal(false);
                      navigate('/payment', { state: { plan } });
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Subscribe Now
                  </button>
                </div>
              ))}
            </div>
            
            {availablePlans.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No Lumen services available at the moment.</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPlansModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Transaction ID</span>
                  <span className="text-sm font-bold text-gray-900">#{selectedTransaction.billing_id}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Plan</span>
                  <span className="text-sm font-bold text-gray-900">{selectedTransaction.plan_name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Amount</span>
                  <span className="text-lg font-bold text-blue-600">${selectedTransaction.amount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Date</span>
                  <span className="text-sm font-bold text-gray-900">{selectedTransaction.billing_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedTransaction.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedTransaction.payment_status}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h4>
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Credit Card</p>
                    <p className="text-xs text-gray-500">**** **** **** 1234</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Billing Information</h4>
                <p className="text-xs text-gray-600">John Doe</p>
                <p className="text-xs text-gray-600">123 Main Street</p>
                <p className="text-xs text-gray-600">New York, NY 10001</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
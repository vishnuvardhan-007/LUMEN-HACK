import React, { useState, useEffect } from 'react';
import { FaSubscript, FaUserFriends, FaCreditCard, FaFileAlt } from 'react-icons/fa';
import { SimplePieChart, SimpleBarChart } from './SimpleCharts';
import axios from 'axios';

const DashboardContent = ({ onShowActiveSubscribers }) => {
  const [stats, setStats] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, subscribersRes, subscriptionsRes, transactionsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/dashboard-stats/'),
        axios.get('http://localhost:8000/api/subscribers/'),
        axios.get('http://localhost:8000/api/subscriptions/'),
        axios.get('http://localhost:8000/api/transactions/')
      ]);

      setStats(statsRes.data);
      setSubscribers(subscribersRes.data);
      setSubscriptions(subscriptionsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const activeSubscribersData = {
    active: subscribers.filter(s => s.status === 'active').length,
    inactive: subscribers.filter(s => s.status === 'inactive').length,
  };

  const subscriptionTypesData = {
    labels: [...new Set(subscriptions.map(s => s.subscription_type))],
    values: [...new Set(subscriptions.map(s => s.subscription_type))].map(type =>
      subscriptions.filter(s => s.subscription_type === type).length
    ),
  };

  const userTypesData = {
    labels: ['Active Users', 'Inactive Users'],
    values: [activeSubscribersData.active, activeSubscribersData.inactive],
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [12000, 15000, 18000, 22000, 25000, 28000],
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white shadow rounded-lg p-5">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-blue-100">Real-time insights and analytics for your subscription business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FaSubscript className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">vs last month</p>
                <p className="text-sm text-green-600 font-bold">+12.5%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subscriptions</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total_subscriptions || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Active subscription plans</p>
            </div>
          </div>
        </div>
        <div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          onClick={onShowActiveSubscribers}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FaUserFriends className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">vs last month</p>
                <p className="text-sm text-green-600 font-bold">+8.3%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Subscribers</p>
              <p className="text-4xl font-bold text-gray-900">{stats.active_subscribers || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Click to view all active users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FaCreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">vs last month</p>
                <p className="text-sm text-green-600 font-bold">+15.7%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transactions</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total_transactions || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Successful payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <FaFileAlt className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">vs last month</p>
                <p className="text-sm text-green-600 font-bold">+22.1%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-gray-900">${stats.revenue || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Monthly recurring revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Status Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Status</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <SimplePieChart data={activeSubscribersData} title="" />
        </div>

        {/* Subscription Types */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Subscription Plans</h3>
            <span className="text-sm text-gray-500">Distribution</span>
          </div>
          <SimpleBarChart data={subscriptionTypesData} title="" />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Revenue Growth</h3>
            <span className="text-sm text-green-600 font-semibold">↗ +18.5%</span>
          </div>
          <SimpleBarChart data={monthlyRevenueData} title="" />
        </div>
      </div>


    </div>
  );
};

export default DashboardContent;
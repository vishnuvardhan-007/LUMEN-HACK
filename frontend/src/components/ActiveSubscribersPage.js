import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const ActiveSubscribersPage = ({ onBack }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActiveSubscribers();
  }, []);

  const fetchActiveSubscribers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/subscribers/');
      setSubscribers(response.data.filter(sub => sub.status === 'active'));
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg mr-4 transition-colors"
            >
              <FaArrowLeft className="text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Active Subscribers</h1>
              <p className="text-green-100">Manage and view all active subscribers</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{subscribers.length}</div>
              <div className="text-sm text-green-100">Total Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center">
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Subscribers Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48"></div>
              </div>
            ))}
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.user_id} className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-4">
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUserFriends className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{subscriber.name}</h3>
                  <p className="text-sm text-gray-600">{subscriber.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="text-sm font-medium text-gray-900">{subscriber.phone}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User ID</span>
                      <span className="text-sm font-medium text-gray-900">#{subscriber.user_id}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-green-200">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUserFriends className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscribers Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No active subscribers available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSubscribersPage;
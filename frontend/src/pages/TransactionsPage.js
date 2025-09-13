import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaCreditCard, FaCalendarAlt, FaReceipt } from 'react-icons/fa';
import axios from 'axios';

const TransactionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/transactions/');
      const userTransactions = response.data.filter(trans => 
        trans.user_name && (trans.user_name.includes(user.name) || trans.user_name.includes(user.email))
      );
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/user-dashboard')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Transactions
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
          <div className="px-6 py-5 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900">Transaction History 💳</h2>
            <p className="text-gray-600 mt-1">All your subscription payments and billing history</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.billing_id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <FaReceipt className="text-blue-600 mr-3" />
                          <h3 className="text-lg font-bold text-gray-900">
                            {transaction.plan_name || 'Subscription Payment'}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <div>
                              <p className="text-gray-500">Transaction Date</p>
                              <p className="font-semibold text-gray-900">{transaction.billing_date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <FaCreditCard className="text-gray-400 mr-2" />
                            <div>
                              <p className="text-gray-500">Payment Method</p>
                              <p className="font-semibold text-gray-900">Credit Card ****1234</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="font-semibold text-gray-900">#{transaction.billing_id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${transaction.amount}
                        </p>
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                          transaction.payment_status === 'paid' 
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                        }`}>
                          {transaction.payment_status === 'paid' ? '✓ Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Subscription: {transaction.plan_name}</span>
                        <span>Processed on {transaction.billing_date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
                <p className="text-gray-500">You haven't made any subscription payments yet.</p>
                <button
                  onClick={() => navigate('/user-dashboard')}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  Browse Plans
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;
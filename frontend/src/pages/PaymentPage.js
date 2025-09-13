import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCreditCard, FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    const plan = location.state?.plan;
    if (plan) {
      setSelectedPlan(plan);
    } else {
      navigate('/user-dashboard');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Find user in database or create if not exists
      const usersResponse = await fetch('http://localhost:8000/api/subscribers/');
      const users = await usersResponse.json();
      let currentUser = users.find(u => u.email === user.email);
      
      if (!currentUser) {
        // Create user in UserData table
        const newUserId = Math.floor(Math.random() * 10000) + 1000;
        const createUserResponse = await fetch('http://localhost:8000/api/create-user/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: newUserId,
            name: user.name || user.email.split('@')[0],
            phone: '0000000000',
            email: user.email,
            status: 'active'
          })
        });
        
        if (createUserResponse.ok) {
          currentUser = {
            user_id: newUserId,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            status: 'active'
          };
        } else {
          alert('Error creating user profile. Please try again.');
          return;
        }
      }

      // Generate unique subscription ID
      const subscriptionId = Math.floor(Math.random() * 10000) + 1000;
      
      // Create subscription
      const subscriptionData = {
        subscription_id: subscriptionId,
        subscription_type: 'monthly',
        product_id: selectedPlan.product_id,
        user_id: currentUser.user_id,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        last_billed_date: new Date().toISOString().split('T')[0],
        grace_time: 5
      };

      const response = await fetch('http://localhost:8000/api/subscriptions/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData)
      });

      if (response.ok) {
        // Create billing record for the transaction
        const billingData = {
          billing_id: Math.floor(Math.random() * 10000) + 1000,
          subscription_id: subscriptionId,
          amount: selectedPlan.price,
          billing_date: new Date().toISOString().split('T')[0],
          payment_status: 'paid'
        };

        const billingResponse = await fetch('http://localhost:8000/api/create-billing/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(billingData)
        });

        if (billingResponse.ok) {
          alert('Payment processed successfully! Your subscription is now active.');
          // Force refresh of dashboard data
          window.location.href = '/user-dashboard';
        } else {
          alert('Subscription created but billing record failed. Please contact support.');
          navigate('/user-dashboard');
        }
      } else {
        const errorData = await response.json();
        alert('Error creating subscription: ' + (errorData.error || 'Please try again'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (!selectedPlan) {
    return <div>Loading...</div>;
  }

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
              Complete Your Subscription
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Monthly subscription</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">${selectedPlan.price}</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-green-500 mr-2" />
                Full access to features
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-green-500 mr-2" />
                24/7 customer support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-green-500 mr-2" />
                Regular updates
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${selectedPlan.price}/month</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <FaLock className="text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address
                </label>
                <input
                  type="text"
                  name="billingAddress"
                  value={paymentData.billingAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={paymentData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={paymentData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Complete Payment - ${selectedPlan.price}/month
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
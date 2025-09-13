import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaSearch, FaFilter, FaNetworkWired, FaShieldAlt, FaServer, FaPhone, FaCog } from 'react-icons/fa';

const ServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const lumenServices = [
    {
      product_id: 1,
      name: 'Dedicated Internet Access',
      description: 'High-speed dedicated internet connectivity with guaranteed bandwidth and enterprise-grade reliability',
      price: 299,
      billing_type: 'Monthly',
      category: 'Connectivity',
      icon: FaNetworkWired,
      features: ['Guaranteed bandwidth', 'SLA uptime 99.9%', 'Symmetric speeds', 'Priority support']
    },
    {
      product_id: 2,
      name: 'DDoS Hyper Protection',
      description: 'Advanced DDoS mitigation and security service protecting against cyber threats',
      price: 199,
      billing_type: 'Monthly',
      category: 'Security',
      icon: FaShieldAlt,
      features: ['Real-time threat detection', 'Multi-layer protection', '24/7 monitoring', 'Instant mitigation']
    },
    {
      product_id: 3,
      name: 'SASE with Fortinet',
      description: 'Secure Access Service Edge with SD-WAN for comprehensive network security',
      price: 449,
      billing_type: 'Monthly',
      category: 'Security',
      icon: FaShieldAlt,
      features: ['Zero Trust architecture', 'Cloud-native security', 'SD-WAN integration', 'Global PoPs']
    },
    {
      product_id: 4,
      name: 'Edge Bare Metal',
      description: 'High-performance edge infrastructure for low-latency applications',
      price: 599,
      billing_type: 'Monthly',
      category: 'Infrastructure',
      icon: FaServer,
      features: ['Ultra-low latency', 'Dedicated hardware', 'Edge locations', 'Custom configurations']
    },
    {
      product_id: 5,
      name: 'Colocation & Dark Fiber',
      description: 'Data center colocation services with dedicated fiber connectivity',
      price: 899,
      billing_type: 'Monthly',
      category: 'Infrastructure',
      icon: FaServer,
      features: ['Tier 3 data centers', 'Dark fiber access', 'Power redundancy', 'Physical security']
    },
    {
      product_id: 6,
      name: 'UC&C Cloud Voice',
      description: 'Unified communications and cloud voice services for modern businesses',
      price: 149,
      billing_type: 'Monthly',
      category: 'Communications',
      icon: FaPhone,
      features: ['Cloud-based PBX', 'Video conferencing', 'Mobile integration', 'Call analytics']
    },
    {
      product_id: 7,
      name: 'Managed Services',
      description: 'Comprehensive managed IT services and support for enterprise operations',
      price: 799,
      billing_type: 'Monthly',
      category: 'Managed Services',
      icon: FaCog,
      features: ['24/7 monitoring', 'Proactive maintenance', 'Expert support', 'Custom SLAs']
    }
  ];

  const categories = ['All', 'Connectivity', 'Security', 'Infrastructure', 'Communications', 'Managed Services'];

  const filteredServices = lumenServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = (service) => {
    const { icon, ...serviceData } = service;
    navigate('/payment', { state: { plan: serviceData } });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
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
              Lumen Technologies Services
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Enterprise Technology Solutions</h1>
          <p className="text-xl text-blue-100 mb-6">Discover our comprehensive suite of connectivity, security, and infrastructure services designed for modern enterprises.</p>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{lumenServices.length}</div>
              <div className="text-blue-100">Services Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100">Expert Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-blue-100">SLA Uptime</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.product_id} className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {service.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">${service.price}</div>
                    <div className="text-sm text-gray-500">{service.billing_type}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSubscribe(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Subscribe Now
                </button>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesPage;
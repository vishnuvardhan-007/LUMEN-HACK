import React from 'react';

export const SimplePieChart = ({ data, title }) => {
  const total = data.active + data.inactive;
  const activePercentage = total > 0 ? (data.active / total) * 100 : 0;
  const inactivePercentage = total > 0 ? (data.inactive / total) * 100 : 0;

  return (
    <div className="text-center">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="relative w-56 h-56 mx-auto">
        <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth="4"
          />
          {/* Inactive segment */}
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="url(#redGradient)"
            strokeWidth="4"
            strokeDasharray={`${inactivePercentage} ${100 - inactivePercentage}`}
            strokeDashoffset="0"
            className="transition-all duration-1000 ease-out"
          />
          {/* Active segment */}
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="url(#greenGradient)"
            strokeWidth="4"
            strokeDasharray={`${activePercentage} ${100 - activePercentage}`}
            strokeDashoffset={`-${inactivePercentage}`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-full p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{total}</div>
            <div className="text-sm font-medium text-gray-600">Total Users</div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-green-800">Active</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-lg font-bold text-green-700">{data.active}</span>
            <span className="text-xs text-green-600 ml-1">({activePercentage.toFixed(1)}%)</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-3">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-red-800">Inactive</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-lg font-bold text-red-700">{data.inactive}</span>
            <span className="text-xs text-red-600 ml-1">({inactivePercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.values);
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ];

  return (
    <div>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="space-y-4">
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const colorClass = colors[index % colors.length];
          
          return (
            <div key={label} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <span className="text-sm font-bold text-gray-900">{value}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 transform translate-y-4">
                  <span className="text-xs font-medium text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total</div>
          <div className="text-lg font-bold text-blue-800">{data.values.reduce((a, b) => a + b, 0)}</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Max</div>
          <div className="text-lg font-bold text-green-800">{maxValue}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Avg</div>
          <div className="text-lg font-bold text-purple-800">{Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)}</div>
        </div>
      </div>
    </div>
  );
};
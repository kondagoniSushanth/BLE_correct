import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center space-y-16 max-w-md mx-auto">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Image */}
          <div className="w-64 h-64 flex items-center justify-center">
            <img 
              src="/footryx_healthcare_pvt_ltd_logo.jpg" 
              alt="FootRYX Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Brand Text */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-wider">
              <span className="text-red-500">FOOT</span>
              <span className="text-teal-700">RYX</span>
            </h1>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-80 bg-red-500 hover:bg-red-600 text-white text-xl font-medium py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex flex-col items-center justify-center px-6">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center space-y-12 max-w-md w-full">
        
        {/* Logo Container */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Image */}
          <div className="relative">
            <img 
              src="/generated-image copy.png" 
              alt="FootRyx Logo" 
              className="w-64 h-64 object-contain drop-shadow-lg"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback Logo */}
            <div className="hidden w-64 h-64 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-white text-4xl font-bold">
                FOOTRYX
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full max-w-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Get Started
        </button>

        {/* Subtitle */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 text-lg font-medium">
            Real-Time Foot Pressure Analysis
          </p>
          <p className="text-gray-500 text-sm">
            Advanced BLE sensor technology for precise plantar pressure mapping
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-400 text-sm">
          Powered by ESP32 BLE Technology
        </p>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-green-100 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};
import React from 'react';
import { ArrowRight, Activity, Bluetooth, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/footryx_healthcare_pvt_ltd_logo.jpg" 
              alt="FootRYX Healthcare" 
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center space-x-2">
              <Bluetooth className="h-4 w-4 text-blue-600" />
              <span>BLE Enabled</span>
            </span>
            <span className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span>Real-time Analysis</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Logo */}
          <div className="mb-8">
            <img 
              src="/footryx_healthcare_pvt_ltd_logo.jpg" 
              alt="FootRYX Healthcare" 
              className="h-32 w-auto mx-auto mb-6 drop-shadow-lg"
            />
          </div>

          {/* Hero Text */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Foot Pressure
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
                Mapping System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced real-time plantar pressure analysis using ESP32 BLE sensors. 
              Monitor, analyze, and export foot pressure data with precision.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bluetooth className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">BLE Connectivity</h3>
              <p className="text-gray-600 text-sm">
                Seamless wireless connection to ESP32 sensors for real-time data streaming
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Visualization</h3>
              <p className="text-gray-600 text-sm">
                Interactive heatmaps and real-time pressure visualization for both feet
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analysis</h3>
              <p className="text-gray-600 text-sm">
                Advanced analytics with test mode recording and Excel export capabilities
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-green-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Technical Specs */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>Compatible with Chrome, Edge, and Opera browsers</p>
            <p>Requires HTTPS for Web Bluetooth API functionality</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/footryx_healthcare_pvt_ltd_logo.jpg" 
              alt="FootRYX Healthcare" 
              className="h-6 w-auto"
            />
            <span>© 2025 FootRYX Healthcare Pvt Ltd. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>Advanced Foot Pressure Analysis</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>System Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
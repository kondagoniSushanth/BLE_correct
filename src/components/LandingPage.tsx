import React from 'react';
import { Activity, Users, Stethoscope, Heart, Shield, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-green-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Advanced Healthcare Technology</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Real-Time Foot
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Pressure Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional-grade plantar pressure mapping system for healthcare providers, 
            researchers, and patients seeking precise biomechanical insights.
          </p>
        </div>

        {/* Logo Section with Company Name */}
        <div className="mb-12 text-center">
          <div className="w-80 h-80 flex items-center justify-center bg-white rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 mb-6">
            <img 
              src="/generated-image2 copy.png" 
              alt="FootRYX Logo" 
              className="w-64 h-64 object-contain"
            />
          </div>
          
          {/* Company Name */}
          <div className="text-4xl md:text-5xl font-bold tracking-wide">
            <span className="text-red-500">Foot</span>
            <span className="text-green-600">RYX</span>
          </div>
          <div className="text-lg text-gray-600 mt-2 font-medium">
            Healthcare Solutions
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Patients</h3>
            <p className="text-gray-600 text-sm">Monitor your foot health with real-time pressure visualization and detailed analytics.</p>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Doctors</h3>
            <p className="text-gray-600 text-sm">Advanced diagnostic tools for gait analysis, diabetic foot care, and treatment planning.</p>
          </div>

          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Researchers</h3>
            <p className="text-gray-600 text-sm">Comprehensive data collection and export capabilities for biomechanical research.</p>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-sm text-gray-600">Pressure Sensors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">Real-Time</div>
              <div className="text-sm text-gray-600">BLE Connectivity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">HD</div>
              <div className="text-sm text-gray-600">Heatmap Visualization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">Export</div>
              <div className="text-sm text-gray-600">Data & Reports</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group relative bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-xl font-semibold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
        >
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 group-hover:animate-pulse" />
            <span>Start Pressure Analysis</span>
          </div>
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Trusted by healthcare professionals worldwide</span>
          </p>
        </div>
      </div>
    </div>
  );
};
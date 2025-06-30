import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, CheckCircle, Users, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBanner from './NotificationBanner';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleStartLearning = () => {
    navigate('/study-materials');
  };

    return (
    <div className="bg-white">
                <NotificationBanner url="https://woxsen.edu.in/apply" />

      {/* Main Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white min-h-screen flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-8 h-8 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Build your online brand <br />
                <span className="text-cyan-300">identity with Vidyavani</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Get your own brand's teaching app, create your own website & sell courses
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">3,300+</div>
                  <div className="text-blue-200">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">1 Lakh+</div>
                  <div className="text-blue-200">Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">5 Crore+</div>
                  <div className="text-blue-200">Students</div>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                className="bg-cyan-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-300 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
        </div>
        
            {/* Right Content - Image/Illustration */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Users className="w-16 h-16 text-blue-600" />
                    </div>
                    <p className="text-white font-semibold text-lg">Join Millions of Learners</p>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                  <Award className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </div>
          </div>
        </div>
        
        {/* Call to Action Overlay */}
        <div className="absolute bottom-0 right-0 bg-cyan-400 text-blue-900 p-10 mr-10 rounded-3xl">
          <p className="text-lg font-semibold mb-2">Ready to take the first step? Choose what best defines you</p>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/register')}
              className="block w-full bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              I run a coaching centre
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="block w-full bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              I am a YouTuber
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="block w-full bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              I teach in a school
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="block w-full bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              I am a student
            </button>
          </div>
        </div>
        </div>
        
      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Simplify your teaching <br />
              <span className="text-cyan-500">with our best features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Own Branded App</h3>
              <p className="text-blue-600">Create your personalized learning app with your brand identity</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Own Branded Website</h3>
              <p className="text-blue-600">Build your professional website to reach more students</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Sell Your Courses</h3>
              <p className="text-blue-600">Monetize your knowledge by selling courses online</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Take Live Classes</h3>
              <p className="text-blue-600">Conduct interactive live sessions with your students</p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Create Online Tests</h3>
              <p className="text-blue-600">Design assessments to evaluate student progress</p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-8 bg-blue-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">100% Content Security</h3>
              <p className="text-blue-600">Keep your content safe with advanced security measures</p>
            </div>
          </div>
        </div>
      </div>

            {/* Mobile App Launch Section - Card Style like Classplus */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          {/* Card Container */}
          <div className="bg-gradient-to-r from-cyan-100 to-cyan-50 rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left Content - Mobile App Mockup */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="relative max-w-sm mx-auto lg:mx-0">
                  {/* Phone Frame */}
                  <div className="relative">
                    {/* Phone Outline */}
                    <div className="w-72 h-[500px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                      {/* Screen */}
                      <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                        {/* Status Bar */}
                        <div className="bg-blue-600 h-10 flex items-center justify-between px-4 text-white text-xs">
                          <span>9:41</span>
                          <span>●●●</span>
                        </div>
                        
                        {/* App Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-sm">Your Branded App</h3>
                              <p className="text-blue-100 text-xs">Education Platform</p>
                            </div>
        </div>
      </div>
      
                        {/* App Content */}
                        <div className="p-3 space-y-3">
                          {/* Feature Cards */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 p-2 rounded-lg text-center">
                              <div className="w-6 h-6 bg-blue-500 rounded-lg mx-auto mb-1 flex items-center justify-center">
                                <Users className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-xs font-medium text-blue-900">Students</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg text-center">
                              <div className="w-6 h-6 bg-green-500 rounded-lg mx-auto mb-1 flex items-center justify-center">
                                <BookOpen className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-xs font-medium text-green-900">Courses</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-lg text-center">
                              <div className="w-6 h-6 bg-purple-500 rounded-lg mx-auto mb-1 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-xs font-medium text-purple-900">Live Classes</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-lg text-center">
                              <div className="w-6 h-6 bg-orange-500 rounded-lg mx-auto mb-1 flex items-center justify-center">
                                <Award className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-xs font-medium text-orange-900">Certificates</p>
                            </div>
      </div>
      
                          {/* Progress Section */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Learning Progress</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-blue-700">Mathematics</span>
                                <span className="text-blue-700">75%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Achievement Badge */}
                          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg flex items-center space-x-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Award className="w-3 h-3 text-yellow-800" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-yellow-800">Achievement!</p>
                              <p className="text-xs text-yellow-600">Course Complete</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Navigation */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
                          <div className="flex justify-around">
                            <div className="text-center">
                              <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
                              <span className="text-xs text-blue-500">Home</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded mx-auto mb-1"></div>
                              <span className="text-xs text-gray-500">Courses</span>
                            </div>
                            <div className="text-center">
                              <div className="w-4 h-4 bg-gray-300 rounded mx-auto mb-1"></div>
                              <span className="text-xs text-gray-500">Profile</span>
                            </div>
                          </div>
                        </div>
                      </div>
          </div>

                    {/* Floating Hand Gesture */}
                    <div className="absolute -bottom-6 -left-6">
                      <div className="w-12 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-t-full rounded-bl-full transform rotate-12">
                        {/* Simple hand representation */}
                        <div className="absolute top-1 left-2 w-2 h-2 bg-pink-200 rounded-full"></div>
                        <div className="absolute top-0 left-4 w-1.5 h-3 bg-pink-200 rounded-full"></div>
                        <div className="absolute top-0 left-6 w-1.5 h-4 bg-pink-200 rounded-full"></div>
                        <div className="absolute top-0 left-8 w-1.5 h-3 bg-pink-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                  Are you excited to launch <br />
                  <span className="text-blue-600">your branded app?</span>
                </h2>
                <p className="text-lg text-blue-800 mb-8 leading-relaxed">
                  Transform your teaching with a personalized app that carries your brand identity and helps you reach more students effectively.
                </p>
                
              <button
                  onClick={handleGetStarted}
                  className="group bg-blue-900 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center relative overflow-hidden"
                >
                  <span className="relative z-10">Click here</span>
                  <ArrowRight className="ml-3 w-6 h-6 relative z-10 transform transition-transform group-hover:translate-x-1" />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
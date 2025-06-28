import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/authService';
import Hero from './Hero';
import LatestUpdates from './LatestUpdates';
import SocialMediaCarousel from './SocialMediaCarousel';
import useCountAnimation from '../hooks/useCountAnimation';
import {
  Book,
  ArrowRight,
  Download,
  Users,
  BookOpen,
  Award,
  BrainCircuit,
  BookCheck,
  FileText,
  ChevronRight,
  Sparkles,
  Star,
  CheckCircle2,
  Zap,
  Trophy,
  GraduationCap,
  Clock,
  Target,
  ArrowUpRight
} from 'lucide-react';
import bannermobileapp from '/pragraph.png';

// Define Category type
interface Category {
  _id: string;
  name: string;
  path?: string[];
}

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://7cvccltb-3330.inc1.devtunnels.ms/api/categories/parents');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data[0]?.parents) {
          setCategories(data[0].parents);
          if (data[0].parents.length > 0) {
            setActiveCategory(data[0].parents[0]._id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          console.log('Fetching user profile...');
          const profileData = await getUserProfile();
          console.log('Profile data received:', profileData);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const handleMaterialClick = (categoryId: string) => {
    navigate(`/study-materials/${categoryId}`);
  };

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const getCategoryColor = (index: number) => {
    const colors = ['bg-gradient-to-r from-blue-500 to-blue-700',
                   'bg-gradient-to-r from-green-500 to-green-700',
                   'bg-gradient-to-r from-purple-500 to-purple-700',
                   'bg-gradient-to-r from-orange-500 to-orange-700',
                   'bg-gradient-to-r from-red-500 to-red-700',
                   'bg-gradient-to-r from-indigo-500 to-indigo-700'];
    return colors[index % colors.length];
  };

  const scrollToCategoriesSection = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { 
      icon: <GraduationCap className="w-12 h-12 text-blue-600 transition-transform duration-300 group-hover:scale-110" />, 
      title: "Expert-Led Content", 
      description: "Learn from India's top educators and industry experts",
      highlight: "500+ Expert Teachers",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: <BrainCircuit className="w-12 h-12 text-purple-600 transition-transform duration-300 group-hover:scale-110" />, 
      title: "AI-Powered Learning", 
      description: "Personalized learning paths tailored to your goals",
      highlight: "Smart Learning System",
      color: "from-purple-500 to-purple-600"
    },
    { 
      icon: <Target className="w-12 h-12 text-green-600 transition-transform duration-300 group-hover:scale-110" />, 
      title: "Focused Preparation", 
      description: "Structured content aligned with exam patterns",
      highlight: "Exam-Oriented",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: <Clock className="w-12 h-12 text-orange-600 transition-transform duration-300 group-hover:scale-110" />, 
      title: "24/7 Learning", 
      description: "Access study materials anytime, anywhere",
      highlight: "Always Available",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <Hero />

      {/* Welcome Banner for Authenticated Users */}
      {isAuthenticated && currentUser?.subCategory && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-full transform transition-transform hover:scale-110 hover:rotate-12">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Welcome back, {currentUser.name || 'Student'}!</h3>
                  <p className="text-blue-100">Continue your learning journey</p>
                </div>
              </div>
              <button
                onClick={() => currentUser?.subCategory && navigate(`/study-materials/${currentUser.subCategory.id}`)}
                className="mt-4 md:mt-0 group bg-white text-blue-600 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10">Resume Learning</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-blue-50/30 to-blue-100/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-baseline gap-1 mb-4">
                <div className="text-5xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  {useCountAnimation(75)}K
                </div>
                <div className="text-3xl font-bold text-blue-500">+</div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <div className="text-blue-900 font-medium">Active Students</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="text-4xl font-bold text-purple-600 mb-2 transition-transform duration-300 group-hover:scale-110">1000+</div>
              <div className="text-purple-900 font-medium">Video Lessons</div>
              <BookOpen className="absolute bottom-4 right-4 w-8 h-8 text-purple-300 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="text-4xl font-bold text-green-600 mb-2 transition-transform duration-300 group-hover:scale-110">95%</div>
              <div className="text-green-900 font-medium">Success Rate</div>
              <Trophy className="absolute bottom-4 right-4 w-8 h-8 text-green-300 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="text-4xl font-bold text-orange-600 mb-2 transition-transform duration-300 group-hover:scale-110">24/7</div>
              <div className="text-orange-900 font-medium">Expert Support</div>
              <Award className="absolute bottom-4 right-4 w-8 h-8 text-orange-300 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300">Why Choose AdhyanGuru</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience excellence in education with our cutting-edge learning platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden"
                onMouseEnter={() => setHoveredFeature(feature.title)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full opacity-20 transform scale-150 group-hover:scale-[2] transition-transform duration-500" />
                  <div className="relative">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{feature.description}</p>
                <div className="inline-flex items-center space-x-2">
                  <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-purple-100 transition-all">
                    {feature.highlight}
                  </div>
                  <ArrowUpRight className={`w-5 h-5 transform transition-all duration-300 ${hoveredFeature === feature.title ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
            <div className="text-center p-10 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10 group-hover:scale-150 transition-transform duration-500" />
              <h2 className="text-3xl font-bold text-white mb-3 relative z-10">Latest Updates</h2>
              <p className="text-blue-100 text-lg relative z-10">Stay ahead with our latest educational content and features</p>
            </div>
            <div className="p-8 transform transition-transform duration-300 hover:scale-[1.02]">
              <LatestUpdates />
            </div>
          </div>
        </div>
      </div>

      {/* Study Materials Section */}
      <div ref={categoriesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg mx-auto transform hover:scale-105 transition-all group cursor-pointer">
              <Sparkles className="h-7 w-7 transform group-hover:rotate-12 transition-transform" />
              <h2 className="font-bold">My Notes</h2>
            </div>
            <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
              Access comprehensive learning resources crafted by expert educators
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 p-10 rounded-2xl shadow-lg">
              <div className="text-2xl font-medium text-red-600 mb-4">Error: {error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              {isAuthenticated && currentUser?.subCategory ? (
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
                    
                    {/* Content */}
                    <div className="relative">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Current Subject</h2>
                      
                      {/* Subject Card */}
                      <div className="bg-white rounded-2xl shadow-lg p-1">
                        <button
                          onClick={() => currentUser?.subCategory && navigate(`/study-materials/${currentUser.subCategory.id}`)}
                          className="w-full group relative overflow-hidden"
                        >
                          {/* Card Content */}
                          <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-50 rounded-xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                              </div>
                              <span className="text-2xl font-bold text-blue-600">
                                {currentUser?.subCategory?.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ChevronRight className="w-6 h-6 text-blue-600 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                          
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Mobile App Banner */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex flex-col lg:flex-row items-center relative z-10">
                    <div className="lg:w-1/2 p-12">
                      <h2 className="text-4xl font-bold text-white mb-6 transform transition-transform duration-300 group-hover:scale-105">Download Our Mobile App</h2>
                      <p className="text-xl text-blue-100 mb-10">
                        Take your learning journey to the next level with our feature-rich mobile app. Study anytime, anywhere!
                      </p>
                      <div className="flex flex-wrap gap-4 mb-10">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium flex items-center space-x-3 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg group">
                          <Download className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" />
                          <span className="text-lg">App Store</span>
                        </button>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium flex items-center space-x-3 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg group">
                          <Download className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" />
                          <span className="text-lg">Google Play</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-8 text-blue-100">
                        <div className="flex items-center space-x-2 transform transition-transform hover:scale-105">
                          <Users className="w-6 h-6" />
                          <span className="text-lg">75,000+ Students</span>
                        </div>
                        <div className="flex items-center space-x-2 transform transition-transform hover:scale-105">
                          <Star className="w-6 h-6" />
                          <span className="text-lg">4.8/5 Rating</span>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-12">
                      <img 
                        src={bannermobileapp} 
                        alt="Mobile App" 
                        className="w-full h-auto object-cover rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-xl text-gray-600">Join our growing community of learners</p>
          </div>
          <SocialMediaCarousel />
        </div>
      </div>
    </div>
  );
};

export default Home;
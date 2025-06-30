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
  ArrowUpRight,
  CheckCircle,
  Play,
  ChevronLeft,
  Quote
} from 'lucide-react';
import bannermobileapp from '/pragraph.png';

// Define Category type
interface Category {
  _id: string;
  name: string;
  path?: string[];
}

// Mock categories data
const mockCategories: Category[] = [
  { _id: '1', name: 'Mathematics' },
  { _id: '2', name: 'Science' },
  { _id: '3', name: 'English' },
  { _id: '4', name: 'History' }
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(mockCategories[0]._id);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "yours sincerely",
      name: "Mohit Goenka",
      title: "Edurift",
      image: null
    },
    {
      quote: "Vidyavani has transformed how I connect with my students. The platform is intuitive and powerful.",
      name: "Priya Sharma",
      title: "Mathematics Educator",
      image: null
    },
    {
      quote: "The AI-powered features help me create personalized learning experiences for each student.",
      name: "Rahul Verma",
      title: "Science Teacher",
      image: null
    }
  ];

  const faqData = [
    {
      question: "Will the app have my coaching name?",
      answer: "Yes, absolutely! Your app will be completely branded with your coaching institute's name, logo, and custom branding. This gives you a professional identity and helps build trust with your students and parents."
    },
    {
      question: "Can we add offline students in our app?",
      answer: "Yes, you can easily add both online and offline students to your app. The platform supports hybrid learning models, allowing you to manage all your students from one centralized dashboard regardless of how they attend classes."
    },
    {
      question: "Any limitation on the number of students that can be added?",
      answer: "There are no limitations on the number of students you can add to your app. Our platform is designed to scale with your coaching business, whether you have 50 students or 5000 students."
    },
    {
      question: "How to start without recorded content?",
      answer: "You can start immediately with live classes! Our platform supports live streaming, so you don't need pre-recorded content. You can begin with live sessions and gradually build your content library with recordings of your live classes."
    },
    {
      question: "What is the duration of the live classes?",
      answer: "There's no fixed duration limit for live classes. You can conduct classes for as long as needed - whether it's a 30-minute quick session or a 3-hour comprehensive lecture. The platform is flexible to accommodate your teaching style."
    },
    {
      question: "Is it easy to upload and sell courses via app?",
      answer: "Yes, it's very simple! Our user-friendly interface allows you to upload courses with just a few clicks. You can set pricing, create course packages, offer discounts, and track sales - all through an intuitive dashboard designed for educators."
    }
  ];

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

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleMaterialClick = (categoryId: string) => {
    navigate(`/study-materials/${categoryId}`);
  };

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleGetStarted = () => {
    navigate('/register');
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

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Show loading screen for authenticated users while redirecting
  if (isAuthenticated && currentUser && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.name || 'Student'}!</h2>
          <p className="text-gray-600">Taking you to your study materials...</p>
        </div>
      </div>
    );
  }

  // Show loading screen for authenticated users while categories are being fetched
  if (isAuthenticated && currentUser && categories.length === 0 && !error && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.name || 'Student'}!</h2>
          <p className="text-gray-600">Loading your study materials...</p>
        </div>
      </div>
    );
  }

  // If authenticated user but there's an error or no categories, show error message with fallback
  if (isAuthenticated && currentUser && (error || (categories.length === 0 && !isLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <Award className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {currentUser.name || 'Student'}!</h2>
          <p className="text-gray-600 mb-6">
            {error ? `Error loading study materials: ${error}` : 'No study materials available at the moment.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/study-materials')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Browse Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <Hero />

      {/* Welcome Banner for Authenticated Users */}
      {/* {isAuthenticated && currentUser?.subCategory && (
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
      )} */}
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

      {/* Testimonials Section - Trusted by Educators */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Trusted by our Educators & Creators
            </h2>
          </div>
          
          {/* Testimonial Slider */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-3xl shadow-2xl overflow-hidden relative">
              {/* Navigation Buttons */}
              <button 
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 transition-colors shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Testimonial Content */}
              <div className="flex items-center justify-center min-h-[500px] p-8 md:p-16">
                <div className="text-center max-w-2xl">
                  {/* Quote Icon */}
                  <div className="mb-8">
                    <Quote className="w-16 h-16 text-blue-600 mx-auto opacity-20" />
                  </div>
                  
                  {/* Testimonial Text */}
                  <div className="mb-8">
                    <p className="text-2xl md:text-3xl font-medium text-blue-900 mb-6 italic leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </p>
                    <div className="text-lg text-blue-700 mb-6">
                      with - <span className="font-bold text-blue-900">Vidyavani</span>
                    </div>
                    <div className="border-t border-blue-300 w-24 mx-auto mb-6"></div>
                  </div>
                  
                  {/* Educator Profile */}
                  <div className="flex flex-col items-center">
                    {/* Profile Image Placeholder */}
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mb-6 flex items-center justify-center overflow-hidden shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Educator Info */}
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-2">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-lg text-blue-600 italic">{testimonials[currentTestimonial].title}</p>
                </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-cyan-300 rounded-full opacity-30 animate-pulse delay-300"></div>
              <div className="absolute top-1/3 right-8 w-4 h-4 bg-blue-400 rounded-full opacity-25 animate-pulse delay-500"></div>
            </div>
            
            {/* Slider Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

     

      {/* Branded App Section - Similar to Classplus */}
      <div className="bg-cyan-50 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto lg:mx-0">
                <div className="bg-blue-100 p-4 rounded-xl mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Your Branded App</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Easy course management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Student analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Payment integration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Are you excited to launch <br />
                <span className="text-cyan-500">your branded app?</span>
              </h2>
              <p className="text-lg text-blue-700 mb-8">
                Transform your teaching with a personalized app that carries your brand identity and helps you reach more students effectively.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Click here
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Study Materials Section */}
      <div ref={categoriesRef} className="py-3 bg-gradient-to-b from-gray-50 to-white">
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
              {/* <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500">
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
              </div> */}
            </div>
          )}
        </div>
      </div>

      {/* Social Media Section */}
      {/* <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-xl text-gray-600">Join our growing community of learners</p>
          </div>
          <SocialMediaCarousel />
        </div>
      </div> */}

      {/* Pricing Section - Classplus Style */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl  mx-auto">
            {/* Vidyavani Plan */}
            <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
              <h3 className="text-3xl font-bold mb-4 text-white w-full">Vidyavani Plan</h3>
              <div className="mb-6 w-full">
                <div className="flex items-baseline gap-2 mb-2 justify-center">
                  <span className="text-4xl font-bold text-white">₹499/-</span>
                </div>
                <p className="text-blue-200 text-lg w-full">Recommended for all educators & coaching centres</p>
              </div>
              <div className="space-y-4 mb-8 w-full">
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Android App</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Website</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Admin Portal</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Unlimited Recorded Courses</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Unlimited Live Classes</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Unlimited Student Enrolments</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">Unlimited Storage</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">A.I. Powered Leads</span>
                </div>
                <div className="flex items-start gap-3 justify-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg text-white">And Much More</span>
                </div>
              </div>
              <div className="mt-auto w-full">
                <button 
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-white text-blue-900 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Book a demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Journey Section */}
      <div className="bg-cyan-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content - Illustration */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-80 h-80 mx-auto">
                  {/* Growth illustration with steps */}
                  <div className="relative h-full flex items-end justify-center">
                    {/* Person climbing steps */}
                    <div className="absolute bottom-0 left-1/4">
                      <div className="w-16 h-20 bg-blue-600 rounded-t-full relative">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                        <div className="absolute top-4 left-2 w-3 h-3 bg-white rounded-full"></div>
                        <div className="absolute top-4 right-2 w-3 h-3 bg-white rounded-full"></div>
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded"></div>
                      </div>
                    </div>
                    
                    {/* Steps/Arrows */}
                    <div className="flex items-end space-x-4">
                      <div className="w-12 h-16 bg-blue-300 rounded-t-lg"></div>
                      <div className="w-12 h-24 bg-blue-400 rounded-t-lg"></div>
                      <div className="w-12 h-32 bg-blue-500 rounded-t-lg relative">
                        <ArrowRight className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Coin */}
                    <div className="absolute top-0 right-1/4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-800">₹</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Are you ready to start <br />
                <span className="text-cyan-500">your growth journey?</span>
              </h2>
              <p className="text-lg text-blue-700 mb-8">
                Join thousands of successful learners who have transformed their careers with our comprehensive learning platform.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Start now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webinar Section - Classplus Style */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          {/* Card Container */}
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-200 rounded-3xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left Content */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                  Attend the 10x growth <br />
                  webinar now!
                </h2>
                <p className="text-lg text-blue-800 mb-8 leading-relaxed">
                  Learn how teachers, educators and content creators are growing their business online.
                </p>
                <button className="group bg-blue-900 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center relative overflow-hidden">
                  <span className="relative z-10">Watch now</span>
                  <Play className="ml-3 w-6 h-6 relative z-10 transform transition-transform group-hover:scale-110" />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>

              {/* Right Content - Team Photos */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="relative">
                  {/* Team Photo Composition */}
                  <div className="flex justify-center items-center space-x-4">
                    {/* Person 1 */}
                    <div className="relative">
                      <div className="w-24 h-32 bg-gradient-to-b from-gray-300 to-gray-400 rounded-2xl flex items-end justify-center overflow-hidden shadow-lg">
                        <div className="w-full h-3/4 bg-gradient-to-b from-blue-100 to-blue-200 rounded-b-2xl flex items-center justify-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      {/* Professional attire suggestion */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>

                    {/* Person 2 - Center (slightly larger) */}
                    <div className="relative transform -translate-y-2">
                      <div className="w-28 h-36 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl flex items-end justify-center overflow-hidden shadow-xl">
                        <div className="w-full h-3/4 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-2xl flex items-center justify-center">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                            <Award className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      {/* Leader indicator */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-yellow-800" />
                      </div>
                    </div>

                    {/* Person 3 */}
                    <div className="relative">
                      <div className="w-24 h-32 bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl flex items-end justify-center overflow-hidden shadow-lg">
                        <div className="w-full h-3/4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-b-2xl flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      {/* Professional indicator */}
                      <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-300 rounded-full opacity-70 animate-pulse delay-300"></div>
                  <div className="absolute top-1/2 -right-6 w-4 h-4 bg-green-300 rounded-full opacity-70 animate-pulse delay-500"></div>

                  {/* Success Indicators */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Success Stories</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              For more understanding, visit FAQs
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-blue-900">{faq.question}</h3>
                  <ChevronRight className={`w-5 h-5 text-blue-600 transform transition-transform ${
                    expandedFaq === index ? 'rotate-90' : ''
                  }`} />
                </div>
                {expandedFaq === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
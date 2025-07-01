import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from "../../../public/logo2.jpeg";
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, BookOpen, GraduationCap, Sparkles, ArrowRight, User, Phone, ChevronDown } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  path: string[];
}

interface SubCategory {
  _id: string;
  name: string;
  type: string;
  parentId: string;
  path: string[];
  content?: {
    imageUrls: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [subCategoriesError, setSubCategoriesError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await fetch('https://api.vidyavani.com/api/categories/parents');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data[0]?.parents) {
          setCategories(data[0].parents);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError(err instanceof Error ? err.message : 'Failed to load categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSelectedSubCategory('');
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setSubCategoriesLoading(true);
        setSubCategoriesError(null);
        
        // Find the selected category to get its ID
        const selectedCat = categories.find(cat => cat.name === selectedCategory);
        if (!selectedCat) {
          setSubCategories([]);
          return;
        }

        const response = await fetch(`https://api.vidyavani.com/api/categories/subcategories/${selectedCat._id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subcategories: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data[0]?.subcategories) {
          setSubCategories(data[0].subcategories);
        } else {
          setSubCategories([]);
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubCategoriesError(err instanceof Error ? err.message : 'Failed to load subcategories');
        setSubCategories([]);
      } finally {
        setSubCategoriesLoading(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategory, categories]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubCategory('');
  }, [selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !phone || !password || !selectedCategory || !selectedSubCategory) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Find the selected category and subcategory to get their IDs
      const selectedCat = categories.find(cat => cat.name === selectedCategory);
      const selectedSubCat = subCategories.find(subCat => subCat.name === selectedSubCategory);

      if (!selectedCat || !selectedSubCat) {
        setError('Invalid category selection');
        return;
      }

      // Use the AuthContext register function which handles registration and automatic login
      await register(name, email, password, phone, selectedCat._id, selectedSubCat._id);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.subCategory && user.subCategory.id) {
        navigate(`/study-materials/${user.subCategory.id}`);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Full Background Image with Mascot */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={Logo2} 
          alt='VidyaVani Mascot Background' 
          className='absolute inset-0 w-full h-full object-cover object-center'
        />
        {/* Overlay for better form readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-purple-900/40"></div>
        {/* Additional overlay on the left side where form will be */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2"></div>
      </div>

      <motion.div 
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Join Vidyavani 
          </h2>
          <p className="text-gray-600 text-sm">
            Create your account to access premium study materials
          </p>
         
        </motion.div>

        {/* Register Form Card */}
        <motion.div 
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {error && (
            <motion.div 
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Full Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </motion.div>

            {/* Category Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Study Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  required
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm appearance-none"
                >
                  <option value="">Select your study category</option>
                  {categoriesLoading ? (
                    <option value="" disabled>Loading categories...</option>
                  ) : categoriesError ? (
                    <option value="" disabled>Failed to load categories</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Subcategory Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                Study Subcategory
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="subcategory"
                  name="subcategory"
                  required
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={!selectedCategory || subCategoriesLoading}
                  className={`block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm appearance-none ${
                    !selectedCategory || subCategoriesLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">
                    {!selectedCategory 
                      ? 'Select a category first' 
                      : subCategoriesLoading 
                        ? 'Loading subcategories...' 
                        : 'Select your study subcategory'
                    }
                  </option>
                  {subCategoriesError ? (
                    <option value="" disabled>Failed to load subcategories</option>
                  ) : (
                    subCategories.map((subCategory) => (
                      <option key={subCategory._id} value={subCategory.name}>
                        {subCategory.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/95 backdrop-blur-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Sign in instead
            </button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-8 text-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-blue-500 mr-1" />
              <span>Premium Content</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 text-purple-500 mr-1" />
              <span>Study Materials</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 text-indigo-500 mr-1" />
              <span>AI Teacher</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;

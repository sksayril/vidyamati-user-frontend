import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, BookOpen, BrainCircuit, Newspaper, Home, BookOpenCheck, FileText, History, User, Search, MessageSquare, Bell, ShoppingCart, BookText, Folder } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Category, CategoryResponse, SubCategory, SubCategoryResponse } from '../types/category';
import { useAuth } from '../contexts/AuthContext';
import { useContentProtection } from '../contexts/ContentProtectionContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { isContentLocked } = useContentProtection();
  const navRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile bottom navigation items
  const mobileNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpenCheck, label: 'Quiz', path: '/quiz' },
    { icon: Newspaper, label: 'Blogs', path: '/blog' },
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://7cvccltb-3330.inc1.devtunnels.ms/api/categories/parents');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data: CategoryResponse[] = await response.json();
        
        if (data[0]?.parents) {
          setCategories(data[0].parents);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // Redirect to login page with return information
    navigate('/login', { 
      state: { 
        from: `/study-materials/${categoryId}`,
        message: `Please log in to access ${categoryName} study materials`
      } 
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserDropdownOpen(false);
  };

  const MobileNavButton = ({ to, icon: Icon, text, gradient }: { to: string; icon: React.ElementType; text: string; gradient: string }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-white font-medium ${gradient} transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span>{text}</span>
    </Link>
  );

  return (
    <>
      <nav className="bg-sky-50 border-b border-sky-100 shadow-sm sticky top-0 z-50" ref={navRef}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <button
                className="md:hidden p-2 text-sky-600 hover:bg-sky-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-blue-600">Vidyavani </span>
                  
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* User Category Display - Show when authenticated */}
              {isAuthenticated && currentUser?.parentCategory && currentUser?.subCategory && (
                <div className="flex items-center space-x-2 mr-4 px-3 py-1 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-blue-700">Category:</span>
                    <span className="text-sm font-semibold text-blue-800">{currentUser.parentCategory.name}</span>
                  </div>
                  <div className="w-px h-4 bg-blue-300"></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-green-700">Subject:</span>
                    <span className="text-sm font-semibold text-green-800">{currentUser.subCategory.name}</span>
                  </div>
                </div>
              )}

              {/* Main Categories */}
              {!isAuthenticated && (
                <div className="flex space-x-1">
                  {isLoading ? (
                    <div className="flex items-center px-3 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center px-3 py-2">
                      <span className="text-sm text-red-500">Failed to load categories</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category._id}
                        className="relative group"
                      >
                        <button
                          onClick={() => handleCategoryClick(category._id, category.name)}
                          className="text-sky-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center capitalize"
                        >
                          {category.name}
                          <ChevronDown size={16} className="ml-1" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Desktop Navigation Links */}
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center ${
                  location.pathname === '/' ? 'text-blue-600' : 'text-sky-700 hover:text-blue-600'
                }`}
              >
                <Home size={18} className="mr-1" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center ${
                  location.pathname === '/blog' ? 'text-blue-600' : 'text-sky-700 hover:text-blue-600'
                }`}
              >
                <Newspaper size={18} className="mr-1" />
                <span>Blog</span>
              </Link>
              
              <Link
                to="/quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center ${
                  location.pathname === '/quiz' ? 'text-blue-600' : 'text-sky-700 hover:text-blue-600'
                }`}
              >
                <BrainCircuit size={18} className="mr-1" />
                <span>Quiz</span>
              </Link>
            </div>
            
            {/* Right Section (Search, User) */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <div className="relative">
                  <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-full text-sky-600 hover:bg-sky-100 transition-colors"
                >
                  <Search size={20} />
                </button>
                
                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 animate-fadeIn border border-sky-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for notes, topics..."
                        className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="absolute right-2 top-2 text-sky-500">
                        <Search size={18} />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Try searching for topics, subjects, or chapters
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    className="flex items-center space-x-2 text-sky-700 hover:text-blue-600 p-1 rounded-full hover:bg-sky-100"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      {currentUser?.parentCategory && currentUser?.subCategory && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium text-gray-800">{currentUser?.name}</div>
                      {currentUser?.parentCategory && currentUser?.subCategory && (
                        <div className="text-xs text-gray-500">
                          {currentUser.parentCategory.name} • {currentUser.subCategory.name}
                        </div>
                      )}
                    </div>
                    <ChevronDown size={14} className="text-sky-500" />
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 animate-fadeIn border border-sky-100 z-50">
                      <div className="px-4 py-2 border-b border-sky-100">
                        <div className="font-medium text-gray-800">{currentUser?.name}</div>
                        <div className="text-xs text-gray-500">{currentUser?.email}</div>
                        {currentUser?.parentCategory && (
                          <div className="text-xs text-blue-600 mt-1">
                            <span className="font-medium">Category:</span> {currentUser.parentCategory.name}
                          </div>
                        )}
                        {currentUser?.subCategory && (
                          <div className="text-xs text-green-600">
                            <span className="font-medium">Subject:</span> {currentUser.subCategory.name}
                          </div>
                        )}
                      </div>
                      <Link
                        to="/subscription/status"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Bell size={16} className="mr-2 text-blue-500" />
                        Subscription Status
                      </Link>
                      <Link
                        to="/test-content-lock"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FileText size={16} className="mr-2 text-green-500" />
                        Content Access Test
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
            className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold">
                    <span className="text-blue-600">Vidyavani </span>
                    
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-sky-100 text-sky-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* User Category Display for Mobile */}
                {isAuthenticated && currentUser?.parentCategory && currentUser?.subCategory && (
                  <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">Your Study Profile</div>
                      <div className="flex items-center justify-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium text-blue-700">Category:</span>
                          <span className="text-sm font-semibold text-blue-800">{currentUser.parentCategory.name}</span>
                        </div>
                        <div className="w-px h-4 bg-blue-300"></div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium text-green-700">Subject:</span>
                          <span className="text-sm font-semibold text-green-800">{currentUser.subCategory.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Action Buttons */}
                <div className="space-y-3 mb-6">
                  <MobileNavButton
                    to="/blog"
                    icon={Newspaper}
                    text="Blog"
                    gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  <MobileNavButton
                    to="/quiz"
                    icon={BrainCircuit}
                    text="Quiz"
                    gradient="bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>

                {/* Mobile Categories */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-2 px-2">
                  Study Categories
                  </h3>
                <div className="space-y-1">
                  {isLoading ? (
                    <div className="flex items-center px-2 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                    </div>
                  ) : error ? (
                    <div className="px-2 py-2 text-sm text-red-500">
                      Failed to load categories
                    </div>
                  ) : (
                    categories.map((category) => (
                        <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id, category.name)}
                        className="flex items-center justify-between w-full px-2 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-blue-600 rounded-md capitalize"
                        >
                        <span className="flex items-center">
                          <BookOpen size={16} className="mr-2 text-sky-500" />
                          {category.name}
                        </span>
                        <ChevronDown size={14} className="text-gray-400" />
                              </button>
                    ))
                  )}
                </div>
              </div>

              {/* Authentication Links for Mobile */}
              {isAuthenticated ? (
                <div className="border-t border-sky-100 pt-4">
                  <div className="px-2 py-3">
                    <div className="font-medium text-gray-800">{currentUser?.name}</div>
                    <div className="text-xs text-gray-500">{currentUser?.email}</div>
                    {currentUser?.parentCategory && (
                      <div className="text-xs text-blue-600 mt-1">
                        <span className="font-medium">Category:</span> {currentUser.parentCategory.name}
                      </div>
                    )}
                    {currentUser?.subCategory && (
                      <div className="text-xs text-green-600">
                        <span className="font-medium">Subject:</span> {currentUser.subCategory.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-sky-100 pt-4">
                  <Link
                    to="/login"
                    className="flex items-center px-2 py-2 text-sm text-blue-600 hover:bg-sky-50 rounded-md"
                  >
                    <User size={16} className="mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-2 py-2 text-sm text-blue-600 hover:bg-sky-50 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-100 flex justify-around p-2 md:hidden z-40">
        {mobileNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg ${
              location.pathname === item.path
                ? 'text-blue-600 bg-sky-50'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        
        {/* Add subscription status indicator */}
        <Link
          to="/subscription/status"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-gray-500 hover:text-gray-800"
        >
          <Bell size={20} />
          <span className="text-xs mt-1">
            {isContentLocked ? 'Upgrade' : 'Subscribed'}
                </span>
              </Link>
      </div>

      {/* Styles for animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        `}
      </style>
    </>
  );
};

export default Navbar;

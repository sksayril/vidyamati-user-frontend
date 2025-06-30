import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Blog from './components/Blog';
import StudyMaterials from './components/StudyMaterials';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SubscriptionPlans from './components/Subscription/SubscriptionPlans';
import SubscriptionStatus from './components/Subscription/SubscriptionStatus';
import TestContentLock from './components/Subscription/TestContentLock';
import AIChat from './components/AIChat/AIChat';
import ProtectedRoute from './components/ProtectedRoute';
import { ContentProtectionProvider } from './contexts/ContentProtectionContext';
import { useAuth } from './contexts/AuthContext';

// Component to handle authenticated user redirects from home page
const HomeWrapper = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, let the Home component handle the redirect logic
  // If not authenticated, show the landing page
  return <Home />;
};

// Small sponsor banner below navbar
const SponsorInline: React.FC = () => {
  const [sponsor, setSponsor] = useState<string | null>(null);
  useEffect(() => {
    fetch('https://api.vidyavani.com/api/getsponser')
      .then(res => res.json())
      .then(data => {
        console.log('Sponsor API response:', data);
        if (data && data.length > 0) setSponsor(data[0].name);
      });
  }, []);
  if (!sponsor) return null;
  return (
    <div style={{ background: '#F59E0B', color: '#111', fontSize: '0.95rem', padding: '0.25rem 0', textAlign: 'center' }}>
      <small>{sponsor}</small>
    </div>
  );
};

function App() {
  const location = useLocation();
  
  // Check if current route is login or register page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ContentProtectionProvider>
        {/* Conditionally render navbar - hide on auth pages */}
        {!isAuthPage && <Navbar />}
        {/* Small sponsor banner below navbar */}
        {!isAuthPage && <SponsorInline />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/aichat" element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/study-materials/:categoryId?" element={<StudyMaterials />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscription" element={<SubscriptionPlans />} />
            <Route path="/subscription/status" element={<SubscriptionStatus />} />
            <Route path="/test-content-lock" element={<TestContentLock />} />
          </Routes>
        </div>
        {/* Conditionally render footer - hide on auth pages */}
        {!isAuthPage && <Footer />}
      </ContentProtectionProvider>
    </div>
  );
}

export default App;
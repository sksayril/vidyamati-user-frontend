import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const location = useLocation();
  
  // Check if current route is login or register page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ContentProtectionProvider>
        {/* Conditionally render navbar - hide on auth pages */}
        {!isAuthPage && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
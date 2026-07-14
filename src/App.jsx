// src/App.js
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CursorFollower from './components/common/CursorFollower';
import GlobalParticles from './components/common/GlobalParticles';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import ToastProvider from './components/common/ToastProvider';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home from './components/pages/public/Home';
const About = lazy(() => import('./components/pages/public/About'));
const Contact = lazy(() => import('./components/pages/public/Contact'));
const Products = lazy(() => import('./components/pages/public/Products'));
const MagazineCatalog = lazy(() => import('./components/pages/public/MagazineCatalog'));
const Login = lazy(() => import('./components/pages/public/Login'));
const NotFound = lazy(() => import('./components/pages/public/NotFound'));

// Private pages
const AdminDashboard = lazy(() => import('./components/pages/private/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./components/pages/private/admin/AdminProducts'));
const AdminTestimonials = lazy(() => import('./components/pages/private/admin/AdminTestimonials'));
const AdminInquiries = lazy(() => import('./components/pages/private/admin/AdminInquiries'));
const AdminAuditLogs = lazy(() => import('./components/pages/private/admin/AdminAuditLogs'));
const CustomerDashboard = lazy(() => import('./components/pages/private/customer/CustomerDashboard'));
const Notifications = lazy(() => import('./components/pages/private/Notifications'));
const Profile = lazy(() => import('./components/pages/private/Profile'));

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location]);

  return (
    <main className="relative">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes location={location}>
          {/* All public routes are wrapped with PublicRoute */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PublicRoute>
                <Products />
              </PublicRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <PublicRoute>
                <MagazineCatalog />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes – wrapped with ProtectedRoute (which adds AuthenticatedNavbar) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute requireAdmin>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute requireAdmin>
                <AdminInquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requireAdmin>
                <AdminAuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowAdmin>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowAdmin>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </main>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500 flex flex-col">
      <CursorFollower />
      <ToastProvider />
      {/* Show public navbar ONLY when NOT authenticated */}
      {!isAuthenticated && <Navbar />}
      <AnimatedRoutes />
      {/* Show public footer ONLY when NOT authenticated */}
      {!isAuthenticated && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <GlobalParticles />
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
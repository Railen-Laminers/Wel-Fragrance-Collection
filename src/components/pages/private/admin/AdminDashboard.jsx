import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../api/axios';
import { showToast } from '../../../../utils/toast';
import SkeletonShimmer from '../../../common/SkeletonShimmer';

// Icons as inline SVGs
const ProductIcon = () => (
  <svg className="w-8 h-8 text-old-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TestimonialIcon = () => (
  <svg className="w-8 h-8 text-old-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const InquiryIcon = () => (
  <svg className="w-8 h-8 text-old-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        // Silently fail on load
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen px-6 py-24 text-black dark:text-white">
        <div className="mx-auto max-w-6xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-dark-teal/80">
          <div className="space-y-6">
            <SkeletonShimmer className="h-10 w-48 rounded-full" />
            <SkeletonShimmer className="h-6 w-72 rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
                  <SkeletonShimmer className="mx-auto h-8 w-16 rounded-full" />
                  <SkeletonShimmer className="mx-auto mt-4 h-4 w-24 rounded-full" />
                  <SkeletonShimmer className="mx-auto mt-4 h-10 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-24 text-black dark:text-white">
      <div className="mx-auto max-w-6xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className={`mt-2 text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              Welcome back, <span className="text-old-gold">{user?.firstName || 'Admin'}</span>
            </h1>
            <p
              className={`mt-3 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              System overview and administration tools.
            </p>
          </div>
          {/* Logout button removed – it’s in the navbar */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {[
            { label: 'Total Products', value: stats?.totalProducts ?? '—', icon: ProductIcon },
            { label: 'Total Testimonials', value: stats?.totalTestimonials ?? '—', icon: TestimonialIcon },
            { label: 'Total Inquiries', value: stats?.totalInquiries ?? '—', icon: InquiryIcon },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`relative rounded-lg border border-black/10 bg-black/5 p-6 text-center backdrop-blur-sm transition-all duration-700 ease-out hover:border-old-gold/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5 ${isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-old-gold/20" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-old-gold/20" />
              <div className="flex justify-center mb-3">
                <item.icon />
              </div>
              <p className="text-sm uppercase tracking-wider text-black/60 dark:text-white/60">
                {item.label}
              </p>
              <p className="mt-2 text-4xl font-semibold font-cormorant">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions – now using primary button style with slide-up overlay */}
        <div
          className={`grid gap-4 sm:grid-cols-3 mt-12 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Link
            to="/admin/products"
            className="group relative flex items-center justify-center gap-3 overflow-hidden bg-old-gold px-6 py-5 text-sm font-medium uppercase tracking-wider text-warm-white dark:text-dark-teal transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]"
          >
            <span className="relative z-10">Manage Products</span>
            <svg className="relative z-10 w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>

          <Link
            to="/admin/testimonials"
            className="group relative flex items-center justify-center gap-3 overflow-hidden bg-old-gold px-6 py-5 text-sm font-medium uppercase tracking-wider text-warm-white dark:text-dark-teal transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]"
          >
            <span className="relative z-10">Manage Testimonials</span>
            <svg className="relative z-10 w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>

          <Link
            to="/admin/inquiries"
            className="group relative flex items-center justify-center gap-3 overflow-hidden bg-old-gold px-6 py-5 text-sm font-medium uppercase tracking-wider text-warm-white dark:text-dark-teal transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]"
          >
            <span className="relative z-10">View Inquiries</span>
            <svg className="relative z-10 w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>

        {/* Audit logs link – styled as a subtle text link with underline on hover */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Link
            to="/admin/audit-logs"
            className="font-inter text-sm text-black/60 hover:text-old-gold dark:text-white/60 dark:hover:text-old-gold transition-colors underline-offset-2 hover:underline"
          >
            View audit logs →
          </Link>
        </div>
      </div>
    </section>
  );
}
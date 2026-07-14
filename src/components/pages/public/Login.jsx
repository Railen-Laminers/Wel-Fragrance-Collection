import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '', general: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated, isAdmin, login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getDashboardPath = (admin) => admin ? '/admin/dashboard' : '/customer/dashboard';
    const from = location.state?.from?.pathname || getDashboardPath(isAdmin);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [from, isAuthenticated, loading, navigate]);

    if (loading && !isAuthenticated) {
        return <div className="min-h-screen" />;
    }

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    // Clear field errors when user types
    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    };

    const validate = () => {
        const newErrors = { email: '', password: '', general: '' };
        let isValid = true;

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Use valid email';
            isValid = false;
        }

        if (!form.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({ email: '', password: '', general: '' });

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await login(form.email, form.password);
            const role = response.user?.role;
            const target = role === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
            navigate(target, { replace: true });
        } catch (err) {
            // Server error – could be "incorrect credentials" or other
            const msg = err.response?.data?.message || 'Unable to sign in right now.';
            // Check if message indicates wrong credentials, show under password or general
            if (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, password: msg, general: '' }));
            } else {
                setErrors(prev => ({ ...prev, general: msg }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-transparent text-dark-teal dark:text-warm-white">
            <div className="w-full max-w-md mx-auto text-center">
                {/* Eyebrow */}
                <div className="inline-flex items-center justify-center relative px-3 py-1 mb-6">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-old-gold/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-old-gold/60" />
                    <span className="font-jost text-[0.65rem] sm:text-xs tracking-[0.35em] text-old-gold uppercase font-medium">
                        Secure Access
                    </span>
                </div>

                <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                    Welcome <span className="italic text-old-gold">back</span>
                </h1>

                <p className="font-inter text-base sm:text-lg text-black/60 dark:text-white/60 max-w-sm mx-auto mt-2 leading-relaxed">
                    Sign in to access your dashboard.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 text-left">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-dark-teal dark:text-warm-white/80">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            className={`w-full px-4 py-3 bg-white dark:bg-dark-teal border ${errors.email ? 'border-red-500' : 'border-gray-400 dark:border-old-gold/30'} text-dark-teal dark:text-warm-white placeholder:text-black/40 dark:placeholder:text-white/40 outline-none transition-colors focus:border-old-gold/60`}
                            placeholder="admin@welfragrance.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-dark-teal dark:text-warm-white/80">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                className={`w-full px-4 py-3 bg-white dark:bg-dark-teal border ${errors.password ? 'border-red-500' : 'border-gray-400 dark:border-old-gold/30'} text-dark-teal dark:text-warm-white placeholder:text-black/40 dark:placeholder:text-white/40 outline-none transition-colors focus:border-old-gold/60 pr-12`}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-500 hover:text-old-gold dark:text-gray-400 dark:hover:text-old-gold transition-colors"
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {errors.general && (
                        <p className="mb-4 text-sm text-red-500">{errors.general}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full px-8 py-3 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                        <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </span>
                        <span className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </button>
                </form>
            </div>
        </section>
    );
}
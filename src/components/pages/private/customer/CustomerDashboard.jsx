import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <section className="min-h-screen px-6 py-24 text-black dark:text-white">
            <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-dark-teal/80">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-old-gold">Dashboard</p>
                        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                            Welcome, {user?.firstName || 'Customer'}
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-black/70 dark:text-white/70">
                            Manage your orders, profile, and preferences here.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-full border border-old-gold/50 px-5 py-3 text-sm font-medium transition hover:bg-old-gold hover:text-black"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm uppercase tracking-[0.2em] text-black/50 dark:text-white/50">Recent Orders</p>
                        <p className="mt-2 text-2xl font-semibold">No orders yet</p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm uppercase tracking-[0.2em] text-black/50 dark:text-white/50">Profile</p>
                        <p className="mt-2 text-2xl font-semibold">{user?.email}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
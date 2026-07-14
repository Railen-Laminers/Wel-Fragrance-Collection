import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import webLogo from '/webLogo.webp';
import webLogoText from '/webLogoText.webp';

// ---- Icons (same as in public navbar) ----

const IconScentLight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="1" x2="12" y2="3.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="6.5" y1="3" x2="8" y2="4.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="17.5" y1="3" x2="16" y2="4.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="3.5" y1="7.5" x2="5.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="20.5" y1="7.5" x2="18.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <rect x="9.5" y="5.5" width="5" height="2.2" rx="0.4" stroke="currentColor" strokeWidth="1" />
        <rect x="10.7" y="7.7" width="2.6" height="2.6" stroke="currentColor" strokeWidth="1" />
        <path d="M8.5 10.3H15.5V19.2C15.5 19.9 14.9 20.5 14.2 20.5H9.8C9.1 20.5 8.5 19.9 8.5 19.2V10.3Z" stroke="currentColor" strokeWidth="1" />
        <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
);

const IconScentDark = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15.8 3.2C14.9 3.7 14.3 4.7 14.3 5.8C14.3 7.5 15.7 8.9 17.4 8.9C18.1 8.9 18.7 8.7 19.2 8.3C18.6 10 17 11.2 15.1 11.2C12.7 11.2 10.7 9.2 10.7 6.8C10.7 4.9 11.9 3.3 13.6 2.7C14.3 2.4 15.1 2.7 15.8 3.2Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        <rect x="8.7" y="9" width="2.6" height="2.6" stroke="currentColor" strokeWidth="1" />
        <rect x="7.5" y="6.8" width="5" height="2.2" rx="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M6.5 11.6H13.5V19.2C13.5 19.9 12.9 20.5 12.2 20.5H7.8C7.1 20.5 6.5 19.9 6.5 19.2V11.6Z" stroke="currentColor" strokeWidth="1" />
        <line x1="6.5" y1="17" x2="13.5" y2="17" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
);

// ---- Other icons ----

const IconDashboard = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const IconOrders = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const IconProducts = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const IconTestimonials = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const IconMails = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const IconProfile = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const IconBell = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const IconInbox = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6l4 4h8l4-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11h4" />
    </svg>
);

const IconCheck = ({ className = '' }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const IconExpand = ({ className = '' }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);

const IconCollapse = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

const IconAudit = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" />
    </svg>
);

// ---- Sidebar Item ----

const SidebarItem = ({ to, icon, label, collapsed, onClick }) => {
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <NavLink
            to={to}
            onClick={handleClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-old-gold/20 text-old-gold dark:bg-old-gold/30'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                } ${collapsed ? 'justify-center' : 'justify-start'}`
            }
            title={collapsed ? label : ''}
        >
            <span className="flex-shrink-0">{icon}</span>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </NavLink>
    );
};

// ---- Main Component ----

export default function AuthenticatedNavbar({ children }) {
    const { user, isAdmin, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await api.get('/api/notifications');
            const unreadNotifications = (response.data.notifications || []).filter((item) => !item.read);
            setNotifications(unreadNotifications.slice(0, 5));
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = window.setInterval(() => {
            loadNotifications();
        }, 15000);

        return () => window.clearInterval(interval);
    }, []);

    const getSidebarItems = () => {
        if (isAdmin) {
            return [
                { to: '/admin/dashboard', icon: <IconDashboard />, label: 'Dashboard' },
                { to: '/admin/products', icon: <IconProducts />, label: 'Products' },
                { to: '/admin/testimonials', icon: <IconTestimonials />, label: 'Testimonials' },
                { to: '/admin/inquiries', icon: <IconMails />, label: 'Inquiries' },
                { to: '/admin/audit-logs', icon: <IconAudit />, label: 'Audit Logs' },
            ];
        } else {
            return [
                { to: '/customer/dashboard', icon: <IconDashboard />, label: 'Dashboard' },
                { to: '/notifications', icon: <IconInbox />, label: 'Notifications' },
                { to: '/customer/orders', icon: <IconOrders />, label: 'My Orders' },
                { to: '/customer/profile', icon: <IconProfile />, label: 'Profile' },
            ];
        }
    };

    const items = getSidebarItems();

    const toggleExpand = () => setSidebarExpanded(prev => !prev);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await api.patch(`/api/notifications/${notification._id}/read`);
                setNotifications((current) => current.filter((item) => item._id !== notification._id));
                setUnreadCount((current) => Math.max(0, current - 1));
            } catch (error) {
                console.error('Failed to mark notification read', error);
            }
        }

        if (notification.link) {
            navigate(notification.link);
            setNotificationOpen(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch('/api/notifications/mark-all-read');
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar - fixed, responsive height */}
            <nav className={`
                fixed top-0 left-0 right-0 z-50
                h-20 sm:h-24 lg:h-28
                bg-white dark:bg-dark-teal
                border-b border-black/10 dark:border-white/10
                flex items-center px-4 sm:px-8
                shadow-sm
            `}>
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center h-10 sm:h-12 lg:h-14">
                        <img src={webLogo} alt="Wel Fragrance" className="h-full w-auto object-contain" />
                        <img
                            src={webLogoText}
                            alt="Wel Fragrance Text"
                            className="h-full w-auto object-contain brightness-0 dark:invert -ml-3"
                        />
                    </Link>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationOpen((current) => !current)}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                            aria-label="Notifications"
                        >
                            <IconBell />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 min-w-4 h-4 rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                        {notificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-black/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-dark-teal z-50">
                                <div className="mb-4 flex items-center justify-between px-2 py-1">
                                    <div>
                                        <p className="text-sm font-semibold">Unread</p>
                                        <p className="text-xs text-black/50 dark:text-white/50">Latest 5 unread notifications</p>
                                    </div>
                                    <button onClick={handleMarkAllAsRead} className="text-xs text-old-gold hover:underline">
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto space-y-2 px-2 pb-2">
                                    {notifications.length === 0 ? (
                                        <div className="rounded-2xl bg-black/5 px-3 py-4 text-center text-sm text-black/60 dark:bg-white/5 dark:text-white/60">
                                            No new notifications.
                                        </div>
                                    ) : notifications.map((notification) => (
                                        <button
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="flex w-full items-start gap-3 rounded-2xl border border-black/10 bg-white px-3 py-3 text-left transition hover:border-old-gold hover:bg-old-gold/10 dark:border-white/10 dark:bg-dark-teal dark:hover:bg-old-gold/10"
                                        >
                                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-old-gold" />
                                            <span className="flex-1">
                                                <span className="block text-sm font-semibold text-black dark:text-white">{notification.title}</span>
                                                <span className="mt-1 block text-xs text-black/60 dark:text-white/60">{notification.message}</span>
                                                <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </span>
                                            </span>
                                            <IconCheck className="mt-1" />
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-black/10 px-3 py-2 text-right dark:border-white/10">
                                    <button
                                        onClick={() => {
                                            navigate('/notifications');
                                            setNotificationOpen(false);
                                        }}
                                        className="text-sm font-semibold text-old-gold hover:underline"
                                    >
                                        See All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-old-gold flex items-center justify-center text-black font-semibold text-sm">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-black dark:text-white">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </button>
                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-teal rounded-lg shadow-lg border border-black/10 dark:border-white/10 py-1 z-50">
                                {/* Profile link - now first with icon */}
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    <IconProfile />
                                    <span>Profile</span>
                                </Link>
                                <hr className="my-1 border-black/10 dark:border-white/10" />
                                {/* Dark mode toggle */}
                                <button
                                    onClick={() => { toggleTheme(); setProfileDropdownOpen(false); }}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                >
                                    <span className={`block transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}`}>
                                        {theme === 'dark' ? <IconScentLight /> : <IconScentDark />}
                                    </span>
                                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <hr className="my-1 border-black/10 dark:border-white/10" />
                                {/* Logout */}
                                <button
                                    onClick={() => { logout(); navigate('/login'); setProfileDropdownOpen(false); }}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar + Main Content */}
            <div className="flex flex-1 pt-20 sm:pt-24 lg:pt-28">
                {/* Sidebar - fixed, positioned below the taller header */}
                <aside
                    className={`
                        fixed top-20 sm:top-24 lg:top-28 left-0 bottom-0 z-40
                        bg-white dark:bg-dark-teal
                        border-r border-black/10 dark:border-white/10
                        transition-all duration-300 ease-in-out
                        ${sidebarExpanded ? 'w-56' : 'w-16'}
                        flex flex-col
                    `}
                >
                    {/* Sidebar Header: Role Panel + Collapse Button */}
                    <div className="flex items-center h-12 px-2 border-b border-black/10 dark:border-white/10">
                        {/* Role label - only shown when expanded */}
                        {sidebarExpanded && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-old-gold">
                                {isAdmin ? 'Admin Panel' : 'Customer Panel'}
                            </span>
                        )}
                        {/* Collapse button - always visible, pushed to right */}
                        <button
                            onClick={toggleExpand}
                            className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black/70 dark:text-white/70 ${sidebarExpanded ? 'ml-auto' : 'mx-auto'}`}
                            title={sidebarExpanded ? 'Collapse' : 'Expand'}
                        >
                            {sidebarExpanded ? <IconCollapse /> : <IconExpand />}
                        </button>
                    </div>

                    {/* Navigation items */}
                    <div className="flex-1 overflow-y-auto py-2">
                        <nav className="flex flex-col gap-1 px-2">
                            {items.map((item) => (
                                <SidebarItem
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    label={item.label}
                                    collapsed={!sidebarExpanded}
                                    onClick={item.onClick}
                                />
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-56' : 'ml-16'}`}>
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
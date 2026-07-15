import React, { useEffect, useRef, useState } from 'react';
import api from '../../../../api/axios';
import { showToast } from '../../../../utils/toast';
import ConfirmationModal from '../../../common/ConfirmationModal';
import AdminSearchFilters from '../../../common/AdminSearchFilters';
import SkeletonShimmer from '../../../common/SkeletonShimmer';

const ACTION_OPTIONS = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'View', 'Approve', 'Reject'];
const MODULE_OPTIONS = ['Auth', 'Profile', 'Products', 'Testimonials', 'Inquiries', 'Users'];

const formatDateTime = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        action: '',
        module: '',
        dateFrom: '',
        dateTo: '',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const hasInitializedAnimation = useRef(false);
    const [confirmation, setConfirmation] = useState({
        open: false,
        title: '',
        message: '',
        warning: '',
        confirmLabel: 'Confirm',
        isProcessing: false,
        onConfirm: null,
    });

    const loadLogs = async (nextPage = 1, nextFilters = filters, nextSearch = searchQuery) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: String(nextPage),
                limit: '10',
            });
            if (nextSearch.trim()) {
                params.append('search', nextSearch.trim());
            }
            Object.entries(nextFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await api.get(`/api/admin/audit-logs?${params.toString()}`);
            setLogs(response.data.logs || []);
            setTotal(response.data.total || 0);
            setPage(response.data.page || 1);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            // silent
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs(1, filters, searchQuery);

        if (!hasInitializedAnimation.current) {
            hasInitializedAnimation.current = true;
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, [filters, searchQuery]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilters({ action: '', module: '', dateFrom: '', dateTo: '' });
    };

    const handleClearAll = async () => {
        setConfirmation({
            open: true,
            title: 'Clear all audit logs',
            message: 'This will permanently remove every audit log entry in the system.',
            warning: 'This action cannot be undone.',
            confirmLabel: 'Clear all',
            isProcessing: false,
            onConfirm: async () => {
                setConfirmation((c) => ({ ...c, isProcessing: true }));
                try {
                    setLoading(true);
                    await api.delete('/api/admin/audit-logs/clear');
                    showToast('All audit logs cleared.');
                    loadLogs(1, filters, searchQuery);
                } catch (err) {
                    showToast('Failed to clear audit logs.');
                } finally {
                    setLoading(false);
                    setConfirmation({ open: false, title: '', message: '', warning: '', confirmLabel: 'Confirm', isProcessing: false, onConfirm: null });
                }
            },
        });
    };

    return (
        <section className="min-h-screen px-6 py-24 text-black dark:text-white">
            <div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
                <div>
                    <h1 className={`text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Audit <span className="text-old-gold">Logs</span>
                    </h1>
                    <p className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Review administrative and user activity across the platform.
                    </p>
                </div>

                <div className={`mt-8 transition-all duration-700 delay-150 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <AdminSearchFilters
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        searchPlaceholder="Search by name or email…"
                        filterDefinitions={[
                            {
                                name: 'action',
                                label: 'Action',
                                type: 'select',
                                options: [
                                    { value: '', label: 'All actions' },
                                    ...ACTION_OPTIONS.map((a) => ({ value: a, label: a })),
                                ],
                            },
                            {
                                name: 'module',
                                label: 'Module',
                                type: 'select',
                                options: [
                                    { value: '', label: 'All modules' },
                                    ...MODULE_OPTIONS.map((m) => ({ value: m, label: m })),
                                ],
                            },
                            {
                                name: 'dateFrom',
                                label: 'From',
                                type: 'date',
                            },
                            {
                                name: 'dateTo',
                                label: 'To',
                                type: 'date',
                            },
                        ]}
                        onClear={clearFilters}
                    />
                </div>

                <div className={`mt-6 flex items-center justify-between transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <div className="text-sm text-black/60 dark:text-white/60">{total} log entries</div>
                    <button
                        type="button"
                        onClick={handleClearAll}
                        disabled={loading}
                        className="group relative overflow-hidden border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-600 transition hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-300 rounded-sm"
                    >
                        <span className="relative z-10">{loading ? 'Processing…' : 'Clear all'}</span>
                        <div className="absolute inset-0 translate-y-full bg-rose-50 transition-transform duration-500 ease-out group-hover:translate-y-0 dark:bg-rose-900/20" />
                    </button>
                </div>

                <div className={`mt-3 overflow-x-auto transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-black/10 text-black/70 dark:border-white/10 dark:text-white/70">
                                <th className="px-3 py-3 font-medium">User</th>
                                <th className="px-3 py-3 font-medium">Action</th>
                                <th className="px-3 py-3 font-medium">Module</th>
                                <th className="px-3 py-3 font-medium">Description</th>
                                <th className="px-3 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-3 py-8">
                                        <div className="space-y-3">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div key={index} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_2fr_0.8fr] gap-3">
                                                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                                                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                                                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                                                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                                                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-3 py-8 text-center text-black/60 dark:text-white/60">No audit logs match your filters.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="border-b border-black/10 align-top transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                                        <td className="px-3 py-3">
                                            <div className="font-medium">{log.user?.name || 'System'}</div>
                                            <div className="text-xs text-black/60 dark:text-white/60">{log.user?.email || '—'}</div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="rounded-full bg-old-gold/20 px-2.5 py-1 text-xs font-semibold text-old-gold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">{log.module}</td>
                                        <td className="max-w-xl px-3 py-3 text-black/80 dark:text-white/80">{log.description}</td>
                                        <td className="px-3 py-3 text-xs text-black/60 dark:text-white/60">{formatDateTime(log.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-sm text-black/70 dark:text-white/70">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => loadLogs(page - 1, filters, searchQuery)}
                            disabled={page <= 1 || loading}
                            className="group relative overflow-hidden border border-black/10 px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 rounded-sm"
                        >
                            <span className="relative z-10">{loading ? 'Loading…' : 'Previous'}</span>
                            <div className="absolute inset-0 translate-y-full bg-black/5 transition-transform duration-500 ease-out group-hover:translate-y-0 dark:bg-white/10" />
                        </button>
                        <button
                            type="button"
                            onClick={() => loadLogs(page + 1, filters, searchQuery)}
                            disabled={page >= totalPages || loading}
                            className="group relative overflow-hidden border border-black/10 px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 rounded-sm"
                        >
                            <span className="relative z-10">{loading ? 'Loading…' : 'Next'}</span>
                            <div className="absolute inset-0 translate-y-full bg-black/5 transition-transform duration-500 ease-out group-hover:translate-y-0 dark:bg-white/10" />
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                open={confirmation.open}
                title={confirmation.title}
                message={confirmation.message}
                warning={confirmation.warning}
                confirmLabel={confirmation.confirmLabel}
                isProcessing={confirmation.isProcessing}
                onCancel={() => setConfirmation((c) => ({ ...c, open: false }))}
                onConfirm={confirmation.onConfirm}
            />
        </section>
    );
}
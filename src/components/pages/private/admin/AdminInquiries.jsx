import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { deleteInquiry, getAdminInquiries, markInquiryAsRead, markInquiryAsUnread } from '../../../../api/testimonials';
import AdminSearchFilters from '../../../common/AdminSearchFilters';
import { showToast } from '../../../../utils/toast';
import ConfirmationModal from '../../../common/ConfirmationModal';
import SkeletonShimmer from '../../../common/SkeletonShimmer';

export default function AdminInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '' });
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    message: '',
    warning: '',
    confirmLabel: 'Confirm',
    onConfirm: null,
    isProcessing: false,
  });

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getAdminInquiries();
      setInquiries(data);
    } catch (err) {
      // Silently fail on initial load - let page show empty state
    } finally {
      setLoading(false);
    }
  };

  const loadInquiriesAfterAction = async () => {
    try {
      const data = await getAdminInquiries();
      setInquiries(data);
    } catch {
      // Silently fail on reload after action
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ status: '' });
  };

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const searchable = [
        inquiry.firstName,
        inquiry.lastName,
        inquiry.email,
        inquiry.message,
        inquiry.facebookLink,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
      const matchesStatus = !filters.status || inquiry.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, filters]);

  useEffect(() => {
    loadInquiries();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleRead = async (id) => {
    const inquiry = inquiries.find((i) => i._id === id);
    const fullName = inquiry ? `${inquiry.firstName} ${inquiry.lastName}` : 'Inquiry';

    setPendingActionId(id);
    try {
      await markInquiryAsRead(id);
      showToast(`Marked ${fullName}'s inquiry as read.`, 'success');
      await loadInquiriesAfterAction();
    } catch (err) {
      // Error toast shown by axios interceptor
    } finally {
      setPendingActionId(null);
    }
  };

  const handleUnread = async (id) => {
    const inquiry = inquiries.find((i) => i._id === id);
    const fullName = inquiry ? `${inquiry.firstName} ${inquiry.lastName}` : 'Inquiry';

    setPendingActionId(id);
    try {
      await markInquiryAsUnread(id);
      showToast(`Marked ${fullName}'s inquiry as unread.`, 'success');
      await loadInquiriesAfterAction();
    } catch (err) {
      // Error toast shown by axios interceptor
    } finally {
      setPendingActionId(null);
    }
  };

  const handleDelete = async (id) => {
    const inquiry = inquiries.find((i) => i._id === id);
    const fullName = inquiry ? `${inquiry.firstName} ${inquiry.lastName}` : 'Inquiry';

    setConfirmation({
      open: true,
      title: `Delete inquiry from ${fullName}`,
      message: `This will permanently remove ${fullName}'s inquiry submission. Continue?`,
      warning: 'This action cannot be undone.',
      confirmLabel: 'Delete inquiry',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmation((current) => ({ ...current, isProcessing: true }));
        setPendingActionId(id);
        try {
          await deleteInquiry(id);
          showToast(`${fullName}'s inquiry has been removed.`, 'success');
          await loadInquiriesAfterAction();
        } catch (err) {
          // Error toast shown by axios interceptor
        } finally {
          setPendingActionId(null);
          setConfirmation((current) => ({ ...current, open: false, isProcessing: false }));
        }
      },
    });
  };

  return (
    <section className="min-h-screen px-6 py-24 text-black dark:text-white">
      <div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
        {/* Header */}
        <div>
          <h1
            className={`text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Inquiry <span className="text-old-gold">Inbox</span>
          </h1>
          <p
            className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Review incoming contact requests, mark them as read, and remove anything that has been handled.
          </p>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <SkeletonShimmer className="h-5 w-40 rounded-full" />
                    <SkeletonShimmer className="h-4 w-56 rounded-full" />
                    <SkeletonShimmer className="h-4 w-full rounded-full" />
                    <SkeletonShimmer className="h-4 w-3/4 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2 lg:min-w-[180px]">
                    <SkeletonShimmer className="h-10 w-full rounded-none" />
                    <SkeletonShimmer className="h-10 w-full rounded-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-black/10 p-10 text-center text-black/60 dark:border-white/10 dark:text-white/60">
            No inquiry submissions yet.
          </div>
        ) : (
          <>
            {/* Simplified filter wrapper */}
            <div className="mt-6">
              <AdminSearchFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={handleFilterChange}
                filterDefinitions={[
                  {
                    name: 'status',
                    label: 'Status',
                    options: [
                      { value: '', label: 'All Statuses' },
                      { value: 'New', label: 'New' },
                      { value: 'Read', label: 'Read' },
                    ],
                  },
                ]}
                onClear={clearFilters}
              />
            </div>
            <div
              className={`mt-8 space-y-4 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              {filteredInquiries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-black/10 p-10 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
                  No inquiries match your search or filters.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((item) => (
                    <div key={item._id} className="rounded-lg border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold">{item.firstName} {item.lastName}</h2>
                            <span className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.2em] ${item.status === 'Read'
                              ? 'border-emerald-400/40 text-emerald-600 dark:text-emerald-300'
                              : 'border-old-gold/30 text-old-gold'
                              }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-black/60 dark:text-white/60">{item.email}</p>
                          {item.facebookLink && (
                            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                              Facebook: {item.facebookLink}
                            </p>
                          )}
                          <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">{item.message}</p>
                          <div className="mt-3 text-sm text-black/60 dark:text-white/60">
                            Submitted: {new Date(item.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:min-w-[180px]">
                          <button
                            onClick={() => item.status === 'Read' ? handleUnread(item._id) : handleRead(item._id)}
                            disabled={pendingActionId === item._id}
                            className={`group relative overflow-hidden px-3 py-2 text-sm font-medium transition-all rounded-none disabled:cursor-not-allowed disabled:opacity-70 ${item.status === 'Read'
                                ? 'border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                : 'bg-old-gold text-warm-white dark:text-dark-teal hover:shadow-[0_0_20px_rgba(199,159,72,0.3)]'
                              }`}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {pendingActionId === item._id ? (
                                <>
                                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                  </svg>
                                  Processing…
                                </>
                              ) : item.status === 'Read' ? (
                                <>
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                  Mark as Unread
                                </>
                              ) : (
                                'Mark as Read'
                              )}
                            </span>
                            {item.status !== 'Read' && (
                              <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={pendingActionId === item._id}
                            className="group relative overflow-hidden px-3 py-2 border border-rose-400/40 text-rose-600 dark:text-rose-300 text-sm font-medium transition-all rounded-none hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {pendingActionId === item._id ? (
                                <>
                                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                  </svg>
                                  Deleting…
                                </>
                              ) : 'Delete'}
                            </span>
                            <div className="absolute inset-0 bg-rose-50 dark:bg-rose-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        warning={confirmation.warning}
        confirmLabel={confirmation.confirmLabel}
        isProcessing={confirmation.isProcessing}
        onCancel={() => setConfirmation((current) => ({ ...current, open: false }))}
        onConfirm={confirmation.onConfirm}
      />
    </section>
  );
}
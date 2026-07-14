import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import ConfirmationModal from '../../common/ConfirmationModal';

const IconBell = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconDelete = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    message: '',
    warning: '',
    confirmLabel: 'Confirm',
    isProcessing: false,
    onConfirm: null,
  });

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleOpenNotification = async (notification) => {
    if (!notification.read) {
      try {
        await api.patch(`/api/notifications/${notification._id}/read`);
        setNotifications((current) =>
          current.map((item) => (item._id === notification._id ? { ...item, read: true } : item))
        );
      } catch (error) {
        console.error('Failed to mark notification read', error);
      }
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleRemoveNotification = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to remove notification', error);
    } finally {
      setBusyId(null);
    }
  };

  const handleClearAll = async () => {
    setConfirmation({
      open: true,
      title: 'Clear all notifications',
      message: 'This will permanently remove all notifications from your activity center.',
      warning: 'This action cannot be undone.',
      confirmLabel: 'Clear all',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmation((current) => ({ ...current, isProcessing: true }));
        try {
          await api.delete('/api/notifications/clear');
          setNotifications([]);
        } catch (error) {
          console.error('Failed to clear notifications', error);
        } finally {
          setConfirmation({
            open: false,
            title: '',
            message: '',
            warning: '',
            confirmLabel: 'Confirm',
            isProcessing: false,
            onConfirm: null,
          });
        }
      },
    });
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <section className="min-h-screen px-6 py-24 text-black dark:text-white">
      <div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
        {/* Header */}
        <div>
          <h1
            className={`text-3xl font-semibold sm:text-4xl transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
           Notifications
          </h1>
          <p
            className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Review updates, stay on top of account activity, and manage your inbox in one place.
          </p>
        </div>

        {/* Status bar with unread count & actions */}
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-4 transition-all duration-700 delay-150 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-old-gold/20 px-3 py-1.5 text-old-gold">
              <IconBell />
              <span className="text-sm font-medium">{unreadCount} unread</span>
            </div>
            <span className="text-sm text-black/60 dark:text-white/60">
              {notifications.length} total
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="group relative overflow-hidden rounded border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-600 transition hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300"
            >
              <span className="relative z-10">Clear all</span>
              <div className="absolute inset-0 bg-rose-50 dark:bg-rose-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
            <button
              onClick={loadNotifications}
              className="group relative overflow-hidden rounded border border-old-gold/50 px-4 py-2 text-sm font-medium text-old-gold transition hover:shadow-[0_0_20px_rgba(199,159,72,0.2)]"
            >
              <span className="relative z-10">Refresh</span>
              <div className="absolute inset-0 bg-old-gold/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="mt-8 text-sm text-black/60 dark:text-white/60">Loading notifications…</div>
        ) : notifications.length === 0 ? (
          <div
            className={`mt-8 rounded-lg border border-dashed border-black/10 p-10 text-center text-black/60 transition-all duration-700 delay-200 ease-out dark:border-white/10 dark:text-white/60 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <p className="text-lg font-medium">Nothing to see here yet.</p>
            <p className="mt-2 text-sm">
              New updates will appear here whenever something important happens.
            </p>
          </div>
        ) : (
          <div
            className={`mt-8 space-y-4 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border p-5 transition ${notification.read
                    ? 'border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5'
                    : 'border-old-gold/30 bg-old-gold/10 dark:border-old-gold/30 dark:bg-old-gold/15'
                  }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Clickable body – marks as read and navigates */}
                  <button
                    onClick={() => handleOpenNotification(notification)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-old-gold" />
                      )}
                      <h2 className="text-lg font-semibold">{notification.title}</h2>
                    </div>
                    <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                      {notification.message}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </button>

                  {/* Remove button – styled like destructive action */}
                  <button
                    onClick={() => handleRemoveNotification(notification._id)}
                    disabled={busyId === notification._id}
                    className="group relative overflow-hidden rounded border border-rose-400/40 px-3 py-2 text-sm font-medium text-rose-600 transition hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-300 lg:min-w-[110px]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {busyId === notification._id ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                            <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                          </svg>
                          Removing…
                        </>
                      ) : (
                        <>
                          <IconDelete />
                          Remove
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-rose-50 dark:bg-rose-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
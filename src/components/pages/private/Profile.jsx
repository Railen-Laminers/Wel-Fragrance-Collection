import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { showToast } from '../../../utils/toast';
import ConfirmationModal from '../../common/ConfirmationModal';

const toListValue = (value) => (Array.isArray(value) ? value.join('\n') : value || '');
const parseListValue = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);

export default function Profile() {
  const { user, logout, updateProfile, changePassword, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    businessName: '',
    emailAddresses: '',
    contactNumbers: '',
    instagramAccounts: '',
    facebookPages: '',
    businessLocations: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Validation errors
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    message: '',
    warning: '',
    confirmLabel: 'Confirm',
    isProcessing: false,
    onConfirm: null,
    onCancel: null,
  });

  const resetConfirmation = () => {
    setConfirmation({
      open: false,
      title: '',
      message: '',
      warning: '',
      confirmLabel: 'Confirm',
      isProcessing: false,
      onConfirm: null,
      onCancel: null,
    });
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        middleInitial: user.middleInitial || '',
        lastName: user.lastName || '',
        email: user.email || '',
        businessName: user.businessName || '',
        emailAddresses: toListValue(user.emailAddresses),
        contactNumbers: toListValue(user.contactNumbers),
        instagramAccounts: toListValue(user.instagramAccounts),
        facebookPages: toListValue(user.facebookPages),
        businessLocations: toListValue(user.businessLocations),
      });
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, [user]);

  // Validate profile form
  const validateProfile = () => {
    const errors = {};
    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const email = profileForm.email.trim();

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (isAdmin && profileForm.businessName.trim() && profileForm.businessName.trim().length > 80) {
      errors.businessName = 'Business name must be 80 characters or less';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswordFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!validateProfile()) return;

    setSaving(true);
    try {
      const payload = {
        firstName: profileForm.firstName.trim(),
        middleInitial: profileForm.middleInitial.trim(),
        lastName: profileForm.lastName.trim(),
        email: profileForm.email.trim(),
        businessName: profileForm.businessName.trim(),
        emailAddresses: parseListValue(profileForm.emailAddresses),
        contactNumbers: parseListValue(profileForm.contactNumbers),
        instagramAccounts: parseListValue(profileForm.instagramAccounts),
        facebookPages: parseListValue(profileForm.facebookPages),
        businessLocations: parseListValue(profileForm.businessLocations),
      };

      await updateProfile(payload);
      await refreshUser();
      const fullName = `${profileForm.firstName} ${profileForm.lastName}`;
      showToast(`Your profile information has been updated successfully, ${fullName}.`, 'success');
      setProfileErrors({});
    } catch (err) {
      // Error toast shown by axios interceptor
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) return;

    setConfirmation({
      open: true,
      title: 'Confirm password change',
      message: 'Your password will be updated immediately. Continue with the password change?',
      warning: 'You will need to use your new password when you sign in next time.',
      confirmLabel: 'Change password',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmation((current) => ({ ...current, isProcessing: true }));
        setPasswordSaving(true);
        try {
          await changePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
            confirmPassword: passwordForm.confirmPassword,
          });
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordErrors({});
          showToast('Your password has been successfully changed. Please use your new password on your next sign in.', 'success');
        } catch (err) {
          // --- MANUAL ERROR HANDLING FOR CURRENT PASSWORD ---
          const errorMessage = err.response?.data?.message || 'Failed to change password';
          // Check if the error is about the current password
          if (errorMessage.toLowerCase().includes('current password')) {
            // Set field‑level error under “Current Password”
            setPasswordErrors((prev) => ({ ...prev, currentPassword: errorMessage }));
            // Show a toast with the same message
            showToast(errorMessage, 'error');
          } else {
            // For any other error, show a generic toast
            showToast(errorMessage, 'error');
          }
          // ----------------------------------------------------
        } finally {
          setPasswordSaving(false);
          resetConfirmation();
        }
      },
      onCancel: () => resetConfirmation(),
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <section className="min-h-screen px-6 py-24 text-black dark:text-white">
      <div className="mx-auto max-w-6xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
        {/* Header – no eyebrow, no logout button */}
        <div>
          <h1
            className={`text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Your <span className="text-old-gold">Account</span>
          </h1>
          <p
            className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Manage your account details and security settings.
          </p>
        </div>

        <div
          className={`mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit} className="rounded-lg border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-semibold font-cormorant">Profile Information</h2>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">Keep your name, email, and business contact details up to date.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm">
                  <span className="mb-1 block text-black/70 dark:text-white/70">First Name *</span>
                  <input
                    value={profileForm.firstName}
                    onChange={(e) => {
                      setProfileForm((prev) => ({ ...prev, firstName: e.target.value }));
                      if (profileErrors.firstName) setProfileErrors((prev) => ({ ...prev, firstName: '' }));
                    }}
                    placeholder="e.g. Joel"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${profileErrors.firstName ? 'border-rose-500' : 'border-black/10'
                      }`}
                  />
                  {profileErrors.firstName && (
                    <p className="mt-1 text-sm text-rose-500">{profileErrors.firstName}</p>
                  )}
                </label>
              </div>
              <div>
                <label className="text-sm">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Middle Initial</span>
                  <input
                    value={profileForm.middleInitial}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, middleInitial: e.target.value }))}
                    placeholder="e.g. M"
                    maxLength={1}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
              </div>
              <div>
                <label className="text-sm">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Last Name *</span>
                  <input
                    value={profileForm.lastName}
                    onChange={(e) => {
                      setProfileForm((prev) => ({ ...prev, lastName: e.target.value }));
                      if (profileErrors.lastName) setProfileErrors((prev) => ({ ...prev, lastName: '' }));
                    }}
                    placeholder="e.g. Malabo"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${profileErrors.lastName ? 'border-rose-500' : 'border-black/10'
                      }`}
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-sm text-rose-500">{profileErrors.lastName}</p>
                  )}
                </label>
              </div>
              <div>
                <label className="text-sm">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Email Address *</span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => {
                      setProfileForm((prev) => ({ ...prev, email: e.target.value }));
                      if (profileErrors.email) setProfileErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="e.g. admin@welfragrance.com"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${profileErrors.email ? 'border-rose-500' : 'border-black/10'
                      }`}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-rose-500">{profileErrors.email}</p>
                  )}
                </label>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-6 space-y-4">
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Business Name</span>
                  <input
                    value={profileForm.businessName}
                    onChange={(e) => {
                      setProfileForm((prev) => ({ ...prev, businessName: e.target.value }));
                      if (profileErrors.businessName) setProfileErrors((prev) => ({ ...prev, businessName: '' }));
                    }}
                    placeholder="e.g. Wel Fragrance Collection"
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${profileErrors.businessName ? 'border-rose-500' : 'border-black/10'}`}
                  />
                  {profileErrors.businessName && (
                    <p className="mt-1 text-sm text-rose-500">{profileErrors.businessName}</p>
                  )}
                </label>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Email Addresses (one per line)</span>
                  <textarea
                    rows={2}
                    value={profileForm.emailAddresses}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, emailAddresses: e.target.value }))}
                    placeholder="contact@domain.com&#10;support@domain.com"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Contact Numbers (one per line)</span>
                  <textarea
                    rows={2}
                    value={profileForm.contactNumbers}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, contactNumbers: e.target.value }))}
                    placeholder="+1 123 456 7890&#10;+63 123 456 7890"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Instagram Accounts (one per line)</span>
                  <textarea
                    rows={2}
                    value={profileForm.instagramAccounts}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, instagramAccounts: e.target.value }))}
                    placeholder="@wel_fragrance&#10;@wel_canada"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Facebook Pages (one per line)</span>
                  <textarea
                    rows={2}
                    value={profileForm.facebookPages}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, facebookPages: e.target.value }))}
                    placeholder="https://facebook.com/welfragrance"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Business Locations (one per line)</span>
                  <textarea
                    rows={2}
                    value={profileForm.businessLocations}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, businessLocations: e.target.value }))}
                    placeholder="Farcon Ville, San Cristobal, Calamba Laguna"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                  />
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="group relative mt-6 overflow-hidden bg-old-gold px-5 py-3 text-sm font-medium text-warm-white dark:text-dark-teal transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)] disabled:opacity-70"
            >
              <span className="relative z-10">{saving ? 'Saving…' : 'Save Profile'}</span>
              <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </form>

          {/* Password Form */}
          <form onSubmit={handlePasswordSubmit} className="rounded-lg border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-semibold font-cormorant">Change Password</h2>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">Your password is stored securely and never exposed.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Current Password *</span>
                  <div className="relative">
                    <input
                      type={showPasswordFields.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }));
                        if (passwordErrors.currentPassword) setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }));
                      }}
                      placeholder="••••••••"
                      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal pr-12 ${passwordErrors.currentPassword ? 'border-rose-500' : 'border-black/10'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-500 hover:text-old-gold dark:text-gray-400 dark:hover:text-old-gold transition-colors"
                      tabIndex="-1"
                    >
                      {showPasswordFields.current ? (
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
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-rose-500">{passwordErrors.currentPassword}</p>
                  )}
                </label>
              </div>
              <div>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">New Password *</span>
                  <div className="relative">
                    <input
                      type={showPasswordFields.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }));
                        if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="Min 6 characters"
                      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal pr-12 ${passwordErrors.newPassword ? 'border-rose-500' : 'border-black/10'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-500 hover:text-old-gold dark:text-gray-400 dark:hover:text-old-gold transition-colors"
                      tabIndex="-1"
                    >
                      {showPasswordFields.new ? (
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
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-rose-500">{passwordErrors.newPassword}</p>
                  )}
                </label>
              </div>
              <div>
                <label className="text-sm block">
                  <span className="mb-1 block text-black/70 dark:text-white/70">Confirm New Password *</span>
                  <div className="relative">
                    <input
                      type={showPasswordFields.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                        if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Re-enter new password"
                      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal pr-12 ${passwordErrors.confirmPassword ? 'border-rose-500' : 'border-black/10'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-500 hover:text-old-gold dark:text-gray-400 dark:hover:text-old-gold transition-colors"
                      tabIndex="-1"
                    >
                      {showPasswordFields.confirm ? (
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
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-rose-500">{passwordErrors.confirmPassword}</p>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="group relative mt-6 overflow-hidden border border-old-gold/50 px-5 py-3 text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(199,159,72,0.2)] disabled:opacity-70"
            >
              <span className="relative z-10">{passwordSaving ? 'Updating…' : 'Update Password'}</span>
              <div className="absolute inset-0 bg-old-gold/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </form>
        </div>
      </div>

      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        warning={confirmation.warning}
        confirmLabel={confirmation.confirmLabel}
        isProcessing={confirmation.isProcessing}
        onConfirm={confirmation.onConfirm}
        onCancel={confirmation.onCancel}
      />
    </section>
  );
}
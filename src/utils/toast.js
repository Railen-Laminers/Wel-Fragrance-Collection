const TOAST_EVENT = 'wel-fragrance:toast';

export const showToast = (message, type = 'info', duration = 4000) => {
  if (typeof window === 'undefined' || !message) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        message,
        type,
        duration,
      },
    })
  );
};

export const subscribeToToasts = (callback) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event) => callback(event.detail);
  window.addEventListener(TOAST_EVENT, handler);

  return () => window.removeEventListener(TOAST_EVENT, handler);
};

// Custom toast wrapper for contextual messages with better UX
export const showContextToast = (baseMessage, context = '') => {
  const fullMessage = context ? `${baseMessage} ${context}` : baseMessage;
  showToast(fullMessage, 'success');
};

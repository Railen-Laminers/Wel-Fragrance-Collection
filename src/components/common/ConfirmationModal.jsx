import React from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmationModal({
    open,
    title,
    message,
    warning,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isProcessing = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-dark-teal">
                {/* Title */}
                <h2 className="text-xl font-semibold text-black dark:text-white">{title}</h2>

                {/* Message */}
                <p className="mt-2 text-sm text-black/70 dark:text-white/70">{message}</p>

                {/* Warning (simplified) */}
                {warning && (
                    <div className="mt-4 rounded-lg border border-rose-400/30 bg-rose-50/50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-900/20 dark:text-rose-200">
                        {warning}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="group relative overflow-hidden rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-white"
                    >
                        <span className="relative z-10">{cancelLabel}</span>
                        <div className="absolute inset-0 translate-y-full bg-black/5 transition-transform duration-500 ease-out group-hover:translate-y-0 dark:bg-white/10" />
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="group relative overflow-hidden rounded-lg bg-old-gold px-4 py-2 text-sm font-medium text-dark-teal transition hover:shadow-[0_0_20px_rgba(199,159,72,0.3)] disabled:cursor-not-allowed disabled:opacity-70 dark:text-dark-teal"
                    >
                        <span className="relative z-10">
                            {isProcessing ? 'Working…' : confirmLabel}
                        </span>
                        <div className="absolute inset-0 translate-y-full bg-dark-teal transition-transform duration-500 ease-out group-hover:translate-y-0 dark:bg-warm-white" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
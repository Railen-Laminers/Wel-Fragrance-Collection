import React, { useEffect, useState, useMemo } from 'react';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../../../api/faqs';
import { showToast } from '../../../../utils/toast';
import ConfirmationModal from '../../../common/ConfirmationModal';
import SkeletonShimmer from '../../../common/SkeletonShimmer';
import AdminSearchFilters from '../../../common/AdminSearchFilters';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ isActive: '' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', isActive: true, order: 0 });

  const [confirmation, setConfirmation] = useState({
    open: false, title: '', message: '', warning: '', confirmLabel: 'Confirm', onConfirm: null, isProcessing: false,
  });

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ isActive: '' });
  };

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
    } catch (err) {
      // Errors handled by axios
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const filteredFaqs = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return faqs.filter(faq => {
      const matchesSearch = !normalized || 
        faq.question.toLowerCase().includes(normalized) || 
        faq.answer.toLowerCase().includes(normalized);
      
      let matchesStatus = true;
      if (filters.isActive === 'active') matchesStatus = faq.isActive === true;
      if (filters.isActive === 'hidden') matchesStatus = faq.isActive === false;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, faqs, filters]);

  const openModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ question: faq.question, answer: faq.answer, isActive: faq.isActive, order: faq.order });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '', isActive: true, order: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      showToast("Question and Answer are required", "error");
      return;
    }
    
    setPendingActionId('saving');
    try {
      if (editingFaq) {
        await updateFaq(editingFaq._id, formData);
        showToast("FAQ updated successfully.", "success");
      } else {
        await createFaq(formData);
        showToast("FAQ created successfully.", "success");
      }
      closeModal();
      loadFaqs();
    } catch {
      // Error toast shown by axios interceptor
    } finally {
      setPendingActionId(null);
    }
  };

  const handleToggleActive = async (faq) => {
    setPendingActionId(faq._id);
    try {
      await updateFaq(faq._id, { ...faq, isActive: !faq.isActive });
      showToast(`FAQ is now ${!faq.isActive ? 'Active' : 'Hidden'}`, 'success');
      loadFaqs();
    } catch {
    } finally {
      setPendingActionId(null);
    }
  };

  const handleDelete = (id) => {
    setConfirmation({
      open: true,
      title: 'Delete FAQ',
      message: 'This will permanently remove this question from your FAQs. Continue?',
      warning: 'This action cannot be undone.',
      confirmLabel: 'Delete FAQ',
      isProcessing: false,
      onConfirm: async () => {
        setConfirmation((curr) => ({ ...curr, isProcessing: true }));
        setPendingActionId(id);
        try {
          await deleteFaq(id);
          showToast('FAQ deleted.', 'success');
          loadFaqs();
        } catch {
        } finally {
          setPendingActionId(null);
          setConfirmation((curr) => ({ ...curr, open: false, isProcessing: false }));
        }
      },
    });
  };

  return (
    <section className="min-h-screen px-6 py-24 text-black dark:text-white">
      <div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              FAQ <span className="text-old-gold">Management</span>
            </h1>
            <p className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Add, edit, and organize frequently asked questions displayed on your website.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className={`px-5 py-2.5 bg-old-gold text-black text-sm font-semibold hover:bg-old-gold/90 transition-all duration-700 delay-100 ease-out shadow-lg ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            + Add New FAQ
          </button>
        </div>

        <div className={`mt-8 transition-all duration-700 delay-150 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <AdminSearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterDefinitions={[
              {
                name: 'isActive',
                label: 'Status',
                options: [
                  { value: '', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'hidden', label: 'Hidden' },
                ],
              },
            ]}
            onClear={clearFilters}
          />
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
                <SkeletonShimmer className="h-6 w-1/3 mb-4 rounded-none" />
                <SkeletonShimmer className="h-4 w-full mb-2 rounded-none" />
                <SkeletonShimmer className="h-4 w-3/4 rounded-none" />
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
           <div className="mt-8 rounded-lg border border-dashed border-black/10 p-10 text-center text-black/60 dark:border-white/10 dark:text-white/60">
             No FAQs have been added yet. Click "Add New FAQ" to create one.
           </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-black/10 p-10 text-center text-black/60 dark:border-white/10 dark:text-white/60">
            No FAQs match your search.
          </div>
        ) : (
          <div className={`mt-8 space-y-4 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {filteredFaqs.map(item => (
              <div key={item._id} className="rounded-lg border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest border rounded-full ${item.isActive ? 'border-emerald-400/40 text-emerald-600 dark:text-emerald-300' : 'border-rose-400/40 text-rose-600 dark:text-rose-300'}`}>
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70 whitespace-pre-wrap">{item.answer}</p>
                  <p className="text-[11px] text-black/40 dark:text-white/40 mt-3 uppercase tracking-widest font-jost">Order: {item.order}</p>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  <button onClick={() => openModal(item)} disabled={pendingActionId === item._id} className="px-4 py-1.5 text-sm font-medium border border-black/10 dark:border-white/10 hover:border-old-gold hover:text-old-gold transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleToggleActive(item)} disabled={pendingActionId === item._id} className="px-4 py-1.5 text-sm font-medium border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors">
                    {item.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(item._id)} disabled={pendingActionId === item._id} className="px-4 py-1.5 text-sm font-medium border border-rose-400/40 text-rose-600 dark:text-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-teal w-full max-w-lg rounded-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-2xl font-cormorant font-bold mb-4">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60 mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={formData.question}
                    onChange={e => setFormData(p => ({ ...p, question: e.target.value }))}
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 bg-transparent rounded-none focus:outline-none focus:border-old-gold placeholder:text-black/30 dark:placeholder:text-white/30"
                    placeholder="e.g. What is your return policy?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60 mb-1">Answer</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.answer}
                    onChange={e => setFormData(p => ({ ...p, answer: e.target.value }))}
                    className="w-full px-4 py-2 border border-black/10 dark:border-white/10 bg-transparent rounded-none focus:outline-none focus:border-old-gold placeholder:text-black/30 dark:placeholder:text-white/30 resize-none"
                    placeholder="e.g. You can return products within 30 days..."
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-black/60 dark:text-white/60 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData(p => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full px-4 py-2 border border-black/10 dark:border-white/10 bg-transparent rounded-none focus:outline-none focus:border-old-gold"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isActiveFaq"
                      checked={formData.isActive}
                      onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-old-gold"
                    />
                    <label htmlFor="isActiveFaq" className="text-sm font-medium text-black/70 dark:text-white/70">Visible to Public</label>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-black/10 dark:border-white/10">
                  <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={pendingActionId === 'saving'} className="px-6 py-2 bg-old-gold text-black text-sm font-semibold hover:bg-old-gold/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    {pendingActionId === 'saving' ? 'Saving...' : 'Save FAQ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

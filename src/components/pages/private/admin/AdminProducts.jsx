import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../../context/AuthContext';
import { createProduct, deleteProduct, getAdminProducts, updateProduct } from '../../../../api/products';
import AdminSearchFilters from '../../../common/AdminSearchFilters';
import { showToast } from '../../../../utils/toast';
import ConfirmationModal from '../../../common/ConfirmationModal';
import Paradoxie from '@/assets/products/Paradoxie.webp';

const initialForm = {
    name: '',
    notes: '',
    price: '', // string to allow empty input
    image: '',
    tag: '',
    featured: false,
    gender: 'Unisex',
    story: '',
    type: 1,
    isActive: true,
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
        return imagePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

export default function AdminProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: '', gender: '', tag: '', type: '' });

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalMounted, setIsModalMounted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [confirmation, setConfirmation] = useState({
        open: false,
        title: '',
        message: '',
        warning: '',
        confirmLabel: 'Confirm',
        onConfirm: null,
        isProcessing: false,
    });

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAdminProducts();
            setProducts(data);
        } catch (err) {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    const loadProductsAfterAction = async () => {
        try {
            const data = await getAdminProducts();
            setProducts(data);
        } catch {
            // silently fail
        }
    };

    useEffect(() => {
        loadProducts();
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    // 🔒 Block page scrolling but keep scrollbar visible
    useEffect(() => {
        if (isModalMounted) {
            // Stop Lenis smooth scrolling
            if (window.__lenis) {
                window.__lenis.stop();
            }

            // Prevent default wheel/touch on document, but allow inside modal
            const preventScroll = (e) => {
                const modalContainer = document.querySelector('.modal-scroll-container');
                if (modalContainer && modalContainer.contains(e.target)) {
                    return; // allow scrolling inside modal
                }
                e.preventDefault();
            };

            document.addEventListener('wheel', preventScroll, { passive: false });
            document.addEventListener('touchmove', preventScroll, { passive: false });

            // Store for cleanup
            window.__scrollPreventListeners = { preventScroll };
        } else {
            // Resume Lenis
            if (window.__lenis) {
                window.__lenis.start();
            }

            // Remove event listeners
            if (window.__scrollPreventListeners) {
                document.removeEventListener('wheel', window.__scrollPreventListeners.preventScroll);
                document.removeEventListener('touchmove', window.__scrollPreventListeners.preventScroll);
                delete window.__scrollPreventListeners;
            }
        }

        // Cleanup on unmount
        return () => {
            if (window.__lenis) {
                window.__lenis.start();
            }
            if (window.__scrollPreventListeners) {
                document.removeEventListener('wheel', window.__scrollPreventListeners.preventScroll);
                document.removeEventListener('touchmove', window.__scrollPreventListeners.preventScroll);
                delete window.__scrollPreventListeners;
            }
        };
    }, [isModalMounted]);

    const sortedProducts = useMemo(() => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [products]);

    const productTagOptions = useMemo(() => {
        const uniqueTags = [...new Set(products.map((p) => p.tag).filter(Boolean))];
        return [
            { value: '', label: 'All Tags' },
            ...uniqueTags.map((tag) => ({ value: tag, label: tag })),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        return sortedProducts.filter((product) => {
            const searchable = [
                product.name,
                product.notes,
                product.tag,
                product.gender,
                product.story,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
            const matchesStatus =
                !filters.status ||
                (filters.status === 'active' ? product.isActive : !product.isActive);
            const matchesGender = !filters.gender || product.gender === filters.gender;
            const matchesTag = !filters.tag || product.tag === filters.tag;
            const matchesType = !filters.type || String(product.type) === filters.type;

            return matchesSearch && matchesStatus && matchesGender && matchesTag && matchesType;
        });
    }, [sortedProducts, searchQuery, filters]);

    const tagOptions = [
        { value: '', label: 'No tag' },
        { value: 'Featured', label: 'Featured' },
        { value: 'New', label: 'New' },
    ];

    const handleFilterChange = (name, value) => {
        setFilters((current) => ({ ...current, [name]: value }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilters({ status: '', gender: '', tag: '', type: '' });
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setImageFile(null);
        setImagePreview('');
        setValidationErrors({});
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingId(product._id);
            setForm({
                name: product.name || '',
                notes: product.notes || '',
                price: product.price?.toString() || '',
                image: product.image || '',
                tag: product.tag || '',
                featured: Boolean(product.featured),
                gender: product.gender || 'Unisex',
                story: product.story || '',
                type: Number(product.type || 1),
                isActive: product.isActive !== false,
            });
            setImagePreview(getImageUrl(product.image));
        } else {
            resetForm();
        }
        setImageFile(null);
        setValidationErrors({});
        setIsModalMounted(true);
        requestAnimationFrame(() => {
            setModalVisible(true);
        });
    };

    const closeModal = () => {
        if (!modalVisible) return;
        setModalVisible(false);
        setTimeout(() => {
            setIsModalMounted(false);
            resetForm();
            setSubmitting(false);
        }, 300);
    };

    const validateForm = () => {
        const errors = {};
        if (!form.name.trim()) {
            errors.name = 'Product name is required';
        }
        const priceValue = parseFloat(form.price);
        if (form.price.trim() === '') {
            errors.price = 'Price is required';
        } else if (isNaN(priceValue) || priceValue < 0) {
            errors.price = 'Price must be a positive number';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price) || 0,
            };

            if (imageFile) {
                const reader = new FileReader();
                const dataUrl = await new Promise((resolve) => {
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(imageFile);
                });
                payload.image = dataUrl;
            }

            if (editingId) {
                await updateProduct(editingId, payload);
                showToast(`Product "${form.name}" has been updated successfully.`, 'success');
            } else {
                await createProduct(payload);
                showToast(`Product "${form.name}" has been created successfully.`, 'success');
            }

            closeModal();
            await loadProductsAfterAction();
        } catch (err) {
            // error handled by interceptor
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        openModal(product);
    };

    const handleDelete = async (id) => {
        const product = products.find((p) => p._id === id);
        const productName = product?.name || 'Product';

        setConfirmation({
            open: true,
            title: `Delete product ${productName}`,
            message: `This will permanently remove ${productName} from your catalog. Are you sure you want to continue?`,
            warning: 'This action cannot be undone.',
            confirmLabel: 'Delete product',
            isProcessing: false,
            onConfirm: async () => {
                setConfirmation((current) => ({ ...current, isProcessing: true }));
                setDeletingId(id);
                try {
                    await deleteProduct(id);
                    showToast(`Product "${productName}" has been removed.`, 'success');
                    await loadProductsAfterAction();
                } catch (err) {
                    // error handled by interceptor
                } finally {
                    setDeletingId(null);
                    setConfirmation((current) => ({ ...current, open: false, isProcessing: false }));
                }
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    // Render modal
    const renderModal = () => {
        if (!isModalMounted) return null;
        return createPortal(
            <div
                className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${modalVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                <div
                    className="modal-scroll-container relative max-w-2xl w-full bg-warm-white dark:bg-dark-teal border border-old-gold/20 shadow-2xl transition-all duration-300 ease-out transform"
                    style={{
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        touchAction: 'auto',
                    }}
                    onWheel={(e) => e.stopPropagation()} // keep Lenis away
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-warm-white/80 dark:bg-dark-teal/80 backdrop-blur-sm border border-old-gold/20 text-dark-teal dark:text-warm-white hover:bg-old-gold hover:text-warm-white dark:hover:text-dark-teal transition-colors duration-300 rounded-none"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl font-semibold font-cormorant mb-4">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Name */}
                                <div className="sm:col-span-2">
                                    <label className="text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Name *</span>
                                        <input
                                            value={form.name}
                                            onChange={(e) => {
                                                setForm({ ...form, name: e.target.value });
                                                if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
                                            }}
                                            placeholder="e.g. Paradoxie"
                                            className={`w-full rounded-none border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${validationErrors.name ? 'border-rose-500' : 'border-black/10'
                                                }`}
                                        />
                                        {validationErrors.name && (
                                            <p className="mt-1 text-sm text-rose-500">{validationErrors.name}</p>
                                        )}
                                    </label>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Price *</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.price}
                                            onChange={(e) => {
                                                setForm({ ...form, price: e.target.value });
                                                if (validationErrors.price) setValidationErrors({ ...validationErrors, price: '' });
                                            }}
                                            placeholder="e.g. 1200"
                                            className={`w-full rounded-none border px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal ${validationErrors.price ? 'border-rose-500' : 'border-black/10'
                                                }`}
                                        />
                                        {validationErrors.price && (
                                            <p className="mt-1 text-sm text-rose-500">{validationErrors.price}</p>
                                        )}
                                    </label>
                                </div>

                                {/* Tag */}
                                <div>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Tag</span>
                                        <select
                                            value={form.tag}
                                            onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                            className="w-full rounded-none border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                                        >
                                            {tagOptions.map(({ value, label }) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Gender</span>
                                        <select
                                            value={form.gender}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                            className="w-full rounded-none border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                                        >
                                            <option value="Unisex">Unisex</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                        </select>
                                    </label>
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Type</span>
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}
                                            className="w-full rounded-none border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                                        >
                                            <option value={1}>Type 1</option>
                                            <option value={2}>Type 2</option>
                                        </select>
                                    </label>
                                </div>

                                {/* Image upload */}
                                <div className="sm:col-span-2">
                                    <label className="text-sm block mb-1 text-black/70 dark:text-white/70">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-black/70 dark:text-white/70 file:mr-4 file:rounded-none file:border-0 file:bg-old-gold/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-old-gold hover:file:bg-old-gold/30"
                                    />
                                    {imagePreview && (
                                        <div className="mt-2 relative w-24 h-24 overflow-hidden border border-black/10 dark:border-white/10">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Notes</span>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                            rows="2"
                                            placeholder="Short description (e.g. Woody, floral)"
                                            className="w-full rounded-none border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                                        />
                                    </label>
                                </div>

                                {/* Story */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm">
                                        <span className="mb-1 block text-black/70 dark:text-white/70">Story</span>
                                        <textarea
                                            value={form.story}
                                            onChange={(e) => setForm({ ...form, story: e.target.value })}
                                            rows="2"
                                            placeholder="The inspiration behind this fragrance…"
                                            className="w-full rounded-none border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-old-gold dark:border-white/10 dark:bg-dark-teal"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    />
                                    Featured on home page
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    />
                                    Active product
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="group relative overflow-hidden px-4 py-2 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-medium transition-all rounded-none"
                                >
                                    <span className="relative z-10">Cancel</span>
                                    <div className="absolute inset-0 bg-black/5 dark:bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="group relative overflow-hidden px-4 py-2 bg-old-gold text-warm-white dark:text-dark-teal text-sm font-medium transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)] disabled:opacity-70 rounded-none"
                                >
                                    <span className="relative z-10">
                                        {submitting ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Product')}
                                    </span>
                                    <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <section className="min-h-screen px-6 py-24 text-black dark:text-white">
            <div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white/80 p-8 shadow-xl backdrop-blur transition-opacity duration-700 dark:border-white/10 dark:bg-dark-teal/80">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1
                            className={`text-3xl font-semibold sm:text-4xl font-cormorant transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            Product <span className="text-old-gold">Management</span>
                        </h1>
                        <p
                            className={`mt-2 max-w-2xl text-base text-black/70 dark:text-white/70 transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            Create, update, and remove fragrances directly from the database.
                        </p>
                    </div>
                    <div
                        className={`transition-all duration-700 delay-150 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        <button
                            onClick={() => openModal()}
                            className="group relative overflow-hidden px-5 py-2 bg-old-gold text-warm-white dark:text-dark-teal text-sm font-medium transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)] rounded-none"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Fragrance
                            </span>
                            <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </button>
                    </div>
                </div>

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
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ],
                            },
                            {
                                name: 'gender',
                                label: 'Gender',
                                options: [
                                    { value: '', label: 'All Genders' },
                                    { value: 'Unisex', label: 'Unisex' },
                                    { value: 'Men', label: 'Men' },
                                    { value: 'Women', label: 'Women' },
                                ],
                            },
                            {
                                name: 'tag',
                                label: 'Tag',
                                options: productTagOptions,
                            },
                            {
                                name: 'type',
                                label: 'Type',
                                options: [
                                    { value: '', label: 'All Types' },
                                    { value: '1', label: 'Type 1' },
                                    { value: '2', label: 'Type 2' },
                                ],
                            },
                        ]}
                        onClear={clearFilters}
                    />
                </div>

                {/* Product Grid */}
                <div
                    className={`mt-10 transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    {loading ? (
                        <div className="rounded-lg border border-dashed border-black/10 p-10 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
                            Loading products…
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-black/10 p-10 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
                            No products match your search or filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="group relative rounded-lg border border-black/10 bg-black/5 overflow-hidden transition-all hover:border-old-gold/30 dark:border-white/10 dark:bg-white/5"
                                >
                                    {/* Product Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-warm-white/50 dark:bg-charcoal/50">
                                        <img
                                            src={product.image ? getImageUrl(product.image) : Paradoxie}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                        {/* Status badges */}
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                                            {product.tag && (
                                                <span className="font-jost text-[10px] tracking-[0.2em] uppercase bg-old-gold text-warm-white dark:text-dark-teal px-2 py-1">
                                                    {product.tag}
                                                </span>
                                            )}
                                            {!product.isActive && (
                                                <span className="font-jost text-[10px] tracking-[0.2em] uppercase bg-black/60 text-white px-2 py-1">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`font-jost text-[10px] tracking-[0.1em] uppercase px-2 py-1 border ${product.gender === 'Men'
                                                ? 'bg-blue-900/20 border-blue-400/40 text-blue-200'
                                                : product.gender === 'Women'
                                                    ? 'bg-pink-900/20 border-pink-400/40 text-pink-200'
                                                    : 'bg-amber-900/20 border-amber-400/40 text-amber-200'
                                                }`}>
                                                {product.gender === 'Men' ? '♂' : product.gender === 'Women' ? '♀' : '✦'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-cormorant text-xl text-dark-teal dark:text-warm-white group-hover:text-old-gold transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="font-inter text-warm-gray dark:text-warm-white/70 text-xs tracking-wide mt-1">
                                            {product.notes}
                                        </p>
                                        <p className="font-jost text-old-gold text-sm tracking-wider mt-1">
                                            ₱{product.price}
                                        </p>
                                    </div>

                                    {/* Admin Actions */}
                                    <div className="p-4 pt-0 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            disabled={deletingId === product._id}
                                            className="group/btn relative flex-1 overflow-hidden px-3 py-1.5 border border-old-gold/40 text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(199,159,72,0.2)] disabled:cursor-not-allowed disabled:opacity-70 rounded-none"
                                        >
                                            <span className="relative z-10">Edit</span>
                                            <div className="absolute inset-0 bg-old-gold/10 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            disabled={deletingId === product._id}
                                            className="group/btn relative flex-1 overflow-hidden px-3 py-1.5 border border-rose-400/40 text-rose-600 dark:text-rose-300 text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] disabled:cursor-not-allowed disabled:opacity-70 rounded-none"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {deletingId === product._id ? (
                                                    <>
                                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                                            <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                                        </svg>
                                                        Deleting…
                                                    </>
                                                ) : 'Delete'}
                                            </span>
                                            <div className="absolute inset-0 bg-rose-50 dark:bg-rose-900/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Portal */}
            {renderModal()}
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
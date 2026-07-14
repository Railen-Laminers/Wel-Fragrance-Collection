import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { getPublicProducts } from '../../../api/products';
import Paradoxie from '@/assets/products/Paradoxie.webp';

export default function Products() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalMounted, setIsModalMounted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedType, setSelectedType] = useState('1');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isLoaded, setIsLoaded] = useState(false);

    const uniqueTags = ['All', ...new Set(products.map(p => p.tag).filter(Boolean))];
    const genderOptions = ['All', 'Men', 'Women', 'Unisex'];
    const typeOptions = ['1', '2'];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await getPublicProducts();
                setProducts(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === 'All' ? true : product.tag === selectedTag;
        const matchesGender = selectedGender === 'All' ? true : product.gender === selectedGender;
        const matchesType = product.type === parseInt(selectedType, 10);
        return matchesSearch && matchesTag && matchesGender && matchesType;
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
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
            setSelectedProduct(null);
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    return (
        <>
            <div className="min-h-screen bg-transparent pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div
                        className={`text-center mb-12 sm:mb-16 transition-all duration-700 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                    The Complete Collection
                                </span>
                            </div>
                        </div>
                        <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white">
                            Our <span className="italic text-old-gold">Fragrances</span>
                        </h1>
                        <p className="font-inter text-warm-gray dark:text-warm-white/70 max-w-2xl mx-auto mt-3 sm:mt-4 text-sm md:text-base px-4">
                            Explore our full range of handcrafted scents, each inspired by the beauty of contrast and the art of storytelling.
                        </p>
                    </div>

                    {/* Search & Filter Bar - Centered Layout */}
                    <div className="mb-10 sm:mb-12 flex flex-col items-center gap-4">
                        {/* Search - Centered, wider */}
                        <div className="w-full max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 bg-warm-white/50 dark:bg-charcoal/50 backdrop-blur-sm border border-old-gold/20 focus:border-old-gold/60 outline-none font-inter text-sm text-dark-teal dark:text-warm-white placeholder:text-warm-gray/70 dark:placeholder:text-warm-white/50 transition-colors duration-300"
                                />
                                <svg
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-old-gold/70"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filters - Centered below search with more gaps and separators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            {/* Type filter */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {typeOptions.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`font-jost text-[10px] sm:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-all duration-300 whitespace-nowrap ${selectedType === type
                                            ? 'bg-old-gold text-warm-white dark:text-dark-teal border-old-gold'
                                            : 'border-old-gold/20 text-dark-teal dark:text-warm-white/70 hover:border-old-gold/60 hover:text-old-gold'
                                            }`}
                                    >
                                        Type {type}
                                    </button>
                                ))}
                            </div>

                            {/* Separator */}
                            <span className="text-old-gold/30 font-light select-none">|</span>

                            {/* Gender filters */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {genderOptions.map((gender) => (
                                    <button
                                        key={gender}
                                        onClick={() => setSelectedGender(gender)}
                                        className={`font-jost text-[10px] sm:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-all duration-300 whitespace-nowrap ${selectedGender === gender
                                            ? 'bg-old-gold text-warm-white dark:text-dark-teal border-old-gold'
                                            : 'border-old-gold/20 text-dark-teal dark:text-warm-white/70 hover:border-old-gold/60 hover:text-old-gold'
                                            }`}
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>

                            {/* Separator */}
                            <span className="text-old-gold/30 font-light select-none">|</span>

                            {/* Tag filters */}
                            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-old-gold/20 scrollbar-track-transparent">
                                {uniqueTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`font-jost text-[10px] sm:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-all duration-300 whitespace-nowrap ${selectedTag === tag
                                            ? 'bg-old-gold text-warm-white dark:text-dark-teal border-old-gold'
                                            : 'border-old-gold/20 text-dark-teal dark:text-warm-white/70 hover:border-old-gold/60 hover:text-old-gold'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && <div className="mb-8 rounded-2xl border border-rose-400/30 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">{error}</div>}

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {loading ? (
                            <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">Loading fragrances…</div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <div
                                    key={product._id || product.name}
                                    className={`group relative cursor-pointer transition-all duration-700 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                        }`}
                                    style={{ transitionDelay: `${index * 80}ms` }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => openModal(product)}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden mb-4 sm:mb-6 bg-warm-white/50 dark:bg-charcoal/50 backdrop-blur-sm">
                                        <div className="absolute inset-4 border border-old-gold/10 z-10 pointer-events-none group-hover:border-old-gold/30 transition-colors duration-500" />
                                        <img
                                            src={product.image || Paradoxie}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-warm-white/60 dark:from-dark-teal/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                        {/* Gender Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className={`font-jost text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border ${product.gender === 'Men'
                                                ? 'bg-blue-900/20 border-blue-400/40 text-blue-200'
                                                : product.gender === 'Women'
                                                    ? 'bg-pink-900/20 border-pink-400/40 text-pink-200'
                                                    : 'bg-amber-900/20 border-amber-400/40 text-amber-200'
                                                }`}>
                                                {product.gender === 'Men' ? '♂' : product.gender === 'Women' ? '♀' : '✦'}
                                            </span>
                                        </div>

                                        {product.tag && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="font-jost text-[10px] tracking-[0.2em] uppercase bg-old-gold text-warm-white dark:text-dark-teal px-3 py-1">
                                                    {product.tag}
                                                </span>
                                            </div>
                                        )}

                                        {/* Type badge REMOVED — no longer displayed */}

                                        <div className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 transition-all duration-500 ${hoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                            <button
                                                className="group/btn relative w-full py-3 overflow-hidden bg-warm-white/20 dark:bg-dark-teal/20 backdrop-blur-md border border-warm-white/30 dark:border-dark-teal/30 font-jost text-xs tracking-[0.2em] uppercase text-dark-teal dark:text-warm-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]"
                                                onClick={(e) => { e.stopPropagation(); openModal(product); }}
                                            >
                                                <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-warm-white dark:group-hover/btn:text-dark-teal">
                                                    Discover
                                                </span>
                                                <div className="absolute inset-0 bg-old-gold transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                                        <h3 className="font-cormorant text-lg sm:text-xl lg:text-2xl text-dark-teal dark:text-warm-white group-hover:text-old-gold transition-colors duration-300">
                                            {product.name}
                                        </h3>
                                        <p className="font-inter text-warm-gray dark:text-warm-white/70 text-xs tracking-wide">
                                            {product.notes}
                                        </p>
                                        <p className="font-jost text-old-gold text-sm tracking-wider">
                                            ₱{product.price}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm">
                                    No fragrances match your filters. Try adjusting your search or filters.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-12 sm:mt-16">
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-3 font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase hover:text-old-gold transition-colors"
                        >
                            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalMounted && selectedProduct && createPortal(
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${modalVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`relative max-w-4xl w-full max-h-[90vh] bg-warm-white dark:bg-dark-teal border border-old-gold/20 shadow-2xl overflow-y-auto transition-all duration-300 ease-out transform ${modalVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                            }`}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-warm-white/80 dark:bg-dark-teal/80 backdrop-blur-sm border border-old-gold/20 text-dark-teal dark:text-warm-white hover:bg-old-gold hover:text-warm-white dark:hover:text-dark-teal transition-colors duration-300"
                            aria-label="Close preview"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="relative aspect-[4/5] md:aspect-auto md:h-full overflow-hidden bg-warm-white/30 dark:bg-charcoal/30">
                                <img
                                    src={selectedProduct.image || Paradoxie}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-warm-white/30 dark:from-dark-teal/30 via-transparent to-transparent opacity-60" />
                                {selectedProduct.tag && (
                                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                                        <span className="font-jost text-[10px] tracking-[0.2em] uppercase bg-old-gold text-warm-white dark:text-dark-teal px-4 py-1.5">
                                            {selectedProduct.tag}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`font-jost text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border ${selectedProduct.gender === 'Men'
                                        ? 'bg-blue-900/20 border-blue-400/40 text-blue-200'
                                        : selectedProduct.gender === 'Women'
                                            ? 'bg-pink-900/20 border-pink-400/40 text-pink-200'
                                            : 'bg-amber-900/20 border-amber-400/40 text-amber-200'
                                        }`}>
                                        {selectedProduct.gender === 'Men' ? '♂' : selectedProduct.gender === 'Women' ? '♀' : '✦'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-4">
                                        <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                            <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                            <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                                Signature Scent
                                            </span>
                                        </div>
                                    </div>
                                    <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark-teal dark:text-warm-white leading-tight">
                                        {selectedProduct.name}
                                    </h2>
                                </div>

                                <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm leading-relaxed mb-3 sm:mb-4">
                                    {selectedProduct.notes}
                                </p>

                                <div className="border-t border-old-gold/10 pt-3 sm:pt-4 mb-4 sm:mb-6">
                                    <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm sm:text-base leading-relaxed italic">
                                        "{selectedProduct.story}"
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 sm:mt-4">
                                    <span className="font-jost text-old-gold text-xl sm:text-2xl tracking-wider">
                                        ₱{selectedProduct.price}
                                    </span>
                                    <button className="group relative px-6 sm:px-8 py-3 overflow-hidden bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]">
                                        <span className="relative z-10">Add to Cart</span>
                                        <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
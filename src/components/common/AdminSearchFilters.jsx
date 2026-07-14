import React, { useState } from 'react';

export default function AdminSearchFilters({
  searchQuery = '',
  onSearchChange = () => { },
  filters = {},
  onFilterChange = () => { },
  filterDefinitions = [],
  onClear,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="border border-black/10 bg-white/50 p-4 dark:border-white/10 dark:bg-dark-teal/50 sm:p-5 rounded-sm">
      {/* Search row – always visible */}
      <div>
        <label
          htmlFor="admin-search"
          className="mb-1 block text-sm font-medium text-black/70 dark:text-white/70"
        >
          Search
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {/* Search icon */}
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20L16.5 16.5" strokeLinecap="round" />
            </svg>
            <input
              id="admin-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search…"
              className="w-full border border-black/10 bg-white/95 py-2 pl-9 pr-3 text-sm text-black outline-none transition duration-200 focus:border-old-gold focus:ring-1 focus:ring-old-gold/20 dark:border-white/10 dark:bg-dark-teal/90 dark:text-white rounded-sm"
            />
          </div>

          {/* Filter toggle button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center border border-black/10 bg-white/95 transition duration-200 hover:border-old-gold/40 hover:bg-old-gold/10 dark:border-white/10 dark:bg-dark-teal/90 dark:hover:border-old-gold/40 dark:hover:bg-old-gold/10 rounded-sm"
            aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
          >
            {isFilterOpen ? (
              /* X (Close) icon */
              <svg
                className="h-4 w-4 text-black/60 dark:text-white/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Filter icon */
              <svg
                className="h-4 w-4 text-black/60 dark:text-white/60"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel – smooth reveal */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        {/* Inner wrapper adds spacing only when panel is open */}
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterDefinitions.map(
              ({ name, label, type = 'select', options, placeholder }) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-sm font-medium text-black/70 dark:text-white/70">
                    {label}
                  </span>
                  {type === 'select' ? (
                    <select
                      value={filters[name] ?? ''}
                      onChange={(e) => onFilterChange(name, e.target.value)}
                      className="w-full border border-black/10 bg-white/95 px-3 py-2 text-sm text-black outline-none transition duration-200 focus:border-old-gold focus:ring-1 focus:ring-old-gold/20 dark:border-white/10 dark:bg-dark-teal/90 dark:text-white rounded-sm"
                    >
                      {options?.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-white text-black dark:bg-dark-teal/90 dark:text-white"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : type === 'date' ? (
                    <input
                      type="date"
                      value={filters[name] ?? ''}
                      onChange={(e) => onFilterChange(name, e.target.value)}
                      className="w-full border border-black/10 bg-white/95 px-3 py-2 text-sm text-black outline-none transition duration-200 focus:border-old-gold focus:ring-1 focus:ring-old-gold/20 dark:border-white/10 dark:bg-dark-teal/90 dark:text-white rounded-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={filters[name] ?? ''}
                      onChange={(e) => onFilterChange(name, e.target.value)}
                      placeholder={placeholder || ''}
                      className="w-full border border-black/10 bg-white/95 px-3 py-2 text-sm text-black outline-none transition duration-200 focus:border-old-gold focus:ring-1 focus:ring-old-gold/20 dark:border-white/10 dark:bg-dark-teal/90 dark:text-white rounded-sm"
                    />
                  )}
                </label>
              ),
            )}

            {/* Clear filters button */}
            {onClear && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onClear}
                  className="w-full border border-black/10 bg-black/[0.025] px-3 py-2 text-sm font-medium text-black transition hover:border-old-gold/40 hover:bg-old-gold/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white rounded-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
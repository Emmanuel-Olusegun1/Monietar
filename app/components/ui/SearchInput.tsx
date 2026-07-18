'use client';

import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = forwardRef<
  HTMLInputElement,
  SearchInputProps
>(({ className = '', value, onClear, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Input */}
      <input
        ref={ref}
        type="text"
        value={value}
        className={`
          w-full
          rounded-xl
          border
          border-[#D9DDD7]
          bg-white
          py-3
          pl-11
          pr-11
          text-sm
          text-gray-900
          placeholder:text-gray-400
          outline-none
          transition-all
          duration-200
          focus:border-[#0F3B23]
          focus:ring-2
          focus:ring-[#0F3B23]/10
          ${className}
        `}
        {...props}
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
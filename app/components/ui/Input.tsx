'use client';

import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] =
      React.useState(false);

    const inputType =
      showPasswordToggle
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`
              w-full
              rounded-xl
              border
              border-[#D9DDD7]
              bg-white
              py-3
              text-sm
              text-gray-900
              outline-none
              transition-all
              duration-200
              placeholder:text-gray-400
              focus:border-[#0F3B23]
              focus:ring-2
              focus:ring-[#0F3B23]/10
              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-400
              ${leftIcon ? 'pl-11' : 'px-4'}
              ${
                rightIcon || showPasswordToggle
                  ? 'pr-11'
                  : 'pr-4'
              }
              ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : ''
              }
              ${className}
            `}
            {...props}
          />

          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
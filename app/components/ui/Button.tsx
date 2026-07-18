'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';

type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'icon';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0F3B23] text-white hover:bg-[#14532D]',

  secondary:
    'bg-[#F3F5F2] text-[#0F3B23] hover:bg-[#E8ECE6]',

  outline:
    'border border-[#D9DDD7] bg-white text-[#0F3B23] hover:bg-[#F8FAF7]',

  ghost:
    'bg-transparent text-[#0F3B23] hover:bg-[#F3F5F2]',

  danger:
    'bg-red-600 text-white hover:bg-red-700',

  success:
    'bg-emerald-600 text-white hover:bg-emerald-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',

  md: 'h-11 px-5 text-sm',

  lg: 'h-12 px-6 text-base',

  icon: 'h-11 w-11',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-[#0F3B23]/20
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>
      )}
    </button>
  );
}
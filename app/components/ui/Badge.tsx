'use client';

import React from 'react';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

type BadgeSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const variantStyles: Record<
  BadgeVariant,
  string
> = {
  primary:
    'bg-[#E7F5EC] text-[#0F3B23]',

  secondary:
    'bg-[#F3F5F2] text-[#4B5563]',

  success:
    'bg-green-100 text-green-700',

  warning:
    'bg-yellow-100 text-yellow-700',

  danger:
    'bg-red-100 text-red-700',

  info:
    'bg-blue-100 text-blue-700',

  neutral:
    'bg-gray-100 text-gray-700',
};

const sizeStyles: Record<
  BadgeSize,
  string
> = {
  sm: 'px-2 py-1 text-xs',

  md: 'px-3 py-1 text-sm',

  lg: 'px-4 py-2 text-sm',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        font-medium
        whitespace-nowrap

        ${rounded ? 'rounded-full' : 'rounded-xl'}

        ${variantStyles[variant]}

        ${sizeStyles[size]}

        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
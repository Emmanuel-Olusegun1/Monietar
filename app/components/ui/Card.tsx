'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  bordered = true,
  shadow = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl
        bg-white
        transition-all
        duration-300

        ${paddingStyles[padding]}

        ${
          bordered
            ? 'border border-[#ECEEE8]'
            : ''
        }

        ${
          shadow
            ? 'shadow-sm'
            : ''
        }

        ${
          hover
            ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
            : ''
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
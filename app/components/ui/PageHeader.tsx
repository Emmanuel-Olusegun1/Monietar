'use client';

import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
      <div>
        <h2 className="text-3xl font-bold text-[#0F3B23]">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
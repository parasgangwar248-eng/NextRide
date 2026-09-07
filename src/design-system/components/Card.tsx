import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive' | 'brand-tint';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-2xl border transition-all duration-150';

  const variantClasses = {
    default: 'border-[#E2E8F0] shadow-sm',
    flat: 'border-[#E2E8F0]',
    interactive:
      'border-[#E2E8F0] hover:border-[#1258D4]/40 hover:shadow-md cursor-pointer active:scale-[0.99]',
    'brand-tint':
      'border-[#C7DCFE] bg-[#F0F5FF]/60 shadow-sm',
  }[variant];

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'driver-action';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 shadow-sm',
    xl: 'px-8 py-4.5 text-lg gap-3 font-bold shadow-md',
  }[size];

  const variantClasses = {
    // Primary brand blue derived from logo
    primary:
      'bg-[#1258D4] text-white hover:bg-[#0D4BB8] active:bg-[#0A3C94] focus:ring-[#1258D4] shadow-sm',
    // Supporting white/neutral surface with brand accent
    secondary:
      'bg-[#F0F5FF] text-[#1258D4] border border-[#C7DCFE] hover:bg-[#E2EDFE] active:bg-[#D3E3FD] focus:ring-[#1258D4]',
    // Crisp neutral outline
    outline:
      'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9] focus:ring-slate-400',
    // Semantic danger
    danger:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] focus:ring-[#DC2626]',
    // High-contrast operational driver action button
    'driver-action':
      'bg-[#1258D4] text-white text-lg font-bold py-5 px-6 rounded-2xl shadow-md hover:bg-[#0D4BB8] active:bg-[#0A3C94] border-2 border-white/20 tracking-wide',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

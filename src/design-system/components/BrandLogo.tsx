import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  taglineText?: string;
  variant?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  taglineText = 'Your next ride, on time, every time',
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-16 h-16 rounded-2xl',
    hero: 'w-20 h-20 rounded-3xl',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-4xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Exact official NextRide uploaded logo asset */}
      <div
        className={`relative overflow-hidden shrink-0 bg-transparent flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02] shadow-xs shadow-blue-500/10 ${iconDimensions}`}
        style={{ aspectRatio: '1/1' }}
      >
        <img
          src="/nextride-logo.jpg"
          alt="NextRide Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span className={`font-bold tracking-tight text-slate-900 ${textSizes}`}>
              Next<span className="text-[#1258D4]">Ride</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-xs text-slate-500 font-medium tracking-normal mt-1 leading-tight">
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

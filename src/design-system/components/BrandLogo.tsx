import React from 'react';
import { BRAND_TOKENS } from '../tokens';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  taglineText?: string;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  taglineText = BRAND_TOKENS.tagline,
  variant = 'horizontal',
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    hero: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
  }[size];

  const titleSizes = {
    sm: 'text-lg font-bold tracking-tight',
    md: 'text-xl sm:text-2xl font-extrabold tracking-tight',
    lg: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
    hero: 'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight',
  }[size];

  const taglineSizes = {
    sm: 'text-xs text-slate-500 font-medium',
    md: 'text-xs sm:text-sm text-slate-600 font-medium',
    lg: 'text-sm sm:text-base text-slate-600 font-medium',
    hero: 'text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-md',
  }[size];

  const isVertical = variant === 'vertical';

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center gap-3' : 'items-center gap-3'
      } ${className}`}
    >
      {/* Primary Brand Logo Reference with strict aspect ratio */}
      <div
        className={`relative overflow-hidden flex-shrink-0 bg-[#1258D4] shadow-sm flex items-center justify-center ${iconDimensions}`}
        style={{ aspectRatio: '1/1' }}
      >
        <img
          src="/nextride-logo.jpg"
          alt="NextRide Official Logo"
          className="w-full h-full object-cover select-none"
          loading="eager"
        />
      </div>

      {variant !== 'icon-only' && (
        <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center">
            <span className={`text-[#0F172A] ${titleSizes}`}>
              Next<span className="text-[#1258D4]">Ride</span>
            </span>
          </div>
          {showTagline && (
            <p className={`${taglineSizes} tracking-normal mt-0.5 leading-snug`}>
              {taglineText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

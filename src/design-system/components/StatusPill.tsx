import React from 'react';
import type { TripStatus } from '../../context/MobilityContext';
import { useLanguage } from '../../context/LanguageContext';

export interface StatusPillProps {
  status: TripStatus | 'confirmed' | 'boarded';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
    lg: 'px-3.5 py-1.5 text-sm font-bold rounded-xl',
  }[size];

  const getStatusConfig = () => {
    switch (status) {
      case 'boarding':
        return {
          label: t.passenger.boarding,
          classes: 'bg-[#F0F5FF] text-[#1258D4] border border-[#BFDBFE] animate-pulse',
          dot: 'bg-[#1258D4]',
        };
      case 'in_transit':
        return {
          label: t.passenger.inTransit,
          classes: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
          dot: 'bg-[#16A34A]',
        };
      case 'delayed':
        return {
          label: t.passenger.delayed,
          classes: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
          dot: 'bg-[#D97706]',
        };
      case 'completed':
        return {
          label: t.passenger.completed,
          classes: 'bg-slate-100 text-slate-700 border border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'confirmed':
        return {
          label: t.passenger.onTime,
          classes: 'bg-[#F0F5FF] text-[#1258D4] border border-[#BFDBFE]',
          dot: 'bg-[#1258D4]',
        };
      case 'boarded':
        return {
          label: t.driver.boarded,
          classes: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
          dot: 'bg-[#16A34A]',
        };
      case 'scheduled':
      default:
        return {
          label: t.passenger.scheduled,
          classes: 'bg-slate-50 text-slate-700 border border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium select-none ${sizeClasses} ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

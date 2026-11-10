import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Quy chuẩn Button theo Design System "e-Border Pass":
  // Primary: nền #006B3F, chữ #FFFFFF; hover nền #004D2C
  // Secondary: nền #FFFFFF, border #9CA3AF, chữ #1F2937; hover nền #F5F7F6
  // Danger: nền #D71920, chữ #FFFFFF; hover nền #B9151B
  // Ghost: nền trong suốt, chữ #006B3F; hover nền #E8F3EE
  // Chữ trong button: 14px, Medium/SemiBold

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#006B3F] text-white hover:bg-[#004D2C] active:bg-[#004D2C] border border-transparent shadow-none',
    secondary:
      'bg-[#FFFFFF] border border-[#9CA3AF] text-[#1F2937] hover:bg-[#F5F7F6] active:bg-[#E8F3EE]',
    danger:
      'bg-[#D71920] text-white hover:bg-[#B9151B] active:bg-[#9B1116] border border-transparent',
    ghost:
      'bg-transparent text-[#006B3F] hover:bg-[#E8F3EE] active:bg-[#D5EADB] border border-transparent',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-[13px] font-medium py-1.5 px-3 min-h-[32px] gap-1.5',
    md: 'text-[14px] font-medium py-2 px-4 min-h-[38px] gap-2',
    lg: 'text-[14px] font-semibold py-2.5 px-5 min-h-[44px] gap-2',
  };

  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer transition-colors duration-150';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded select-none ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Inject Google Font
export const FontInjection = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
    
    body, .font-sans {
      font-family: 'IBM Plex Sans Arabic', sans-serif !important;
    }
    
    .font-mono {
      font-family: 'SF Mono', 'Courier New', Courier, monospace !important;
    }
  `}</style>
);

// COLORS (Defined in Tailwind config ideally, but using arbitrary values for now to match specs exactly)
// Main Text: #1A1A1A
// Titles: #444444
// Secondary: #666666
// Accent: #1464F6
// BG: #F6F6F6
// Cards: #FCFCFC
// Borders: #E9E9E9
// Success: #2E8B57
// Warning: #FFB347
// Error: #D92D20

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'outline-danger';
  size?: 'default' | 'large' | 'small';
  fullWidth?: boolean;
}

export const TButton = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  fullWidth = false,
  className,
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full";
  
  const variants = {
    primary: "bg-[#1464F6] text-white hover:bg-[#0f53d1]",
    secondary: "bg-[#E9E9E9] text-[#1A1A1A] hover:bg-[#dcdcdc]",
    ghost: "bg-transparent text-[#1464F6] hover:bg-[#1464F6]/10",
    outline: "border border-[#E9E9E9] bg-transparent text-[#1A1A1A] hover:bg-[#F6F6F6]",
    'outline-danger': "border border-[#D92D20] bg-transparent text-[#D92D20] hover:bg-[#D92D20]/10",
  };

  const sizes = {
    default: "h-[48px] px-6 text-[16px]",
    large: "h-[56px] px-8 text-[18px]",
    small: "h-[40px] px-4 text-[14px]",
  };

  return (
    <button 
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-[#FCFCFC] border border-[#E9E9E9] rounded-[16px] p-6 shadow-sm",
      onClick && "cursor-pointer active:scale-[0.99] transition-transform",
      className
    )}
  >
    {children}
  </div>
);

export const TInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      "h-[56px] w-full rounded-[16px] border border-[#E9E9E9] bg-white px-4 text-[#1A1A1A] placeholder-[#666666] focus:border-[#1464F6] focus:ring-1 focus:ring-[#1464F6] outline-none transition-all",
      className
    )}
    {...props}
  />
);

export const TBadge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'neutral', className?: string }) => {
  const variants = {
    default: "bg-[#E9E9E9] text-[#1A1A1A]",
    success: "bg-[#2E8B57]/10 text-[#2E8B57]",
    warning: "bg-[#FFB347]/15 text-[#b37417]", // Darkened text for contrast
    error: "bg-[#D92D20]/10 text-[#D92D20]",
    neutral: "bg-[#666666]/10 text-[#666666]",
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-medium leading-[18px]",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const ScreenContainer = ({ children, title, onBack, rightAction, className }: { children: React.ReactNode, title?: string, onBack?: () => void, rightAction?: React.ReactNode, className?: string }) => (
  <div className={cn("w-[390px] h-[844px] bg-[#F6F6F6] overflow-hidden flex flex-col relative border border-gray-200 shadow-xl", className)}>
    {(title || onBack) && (
      <div className="h-[60px] flex items-center px-4 shrink-0 bg-[#F6F6F6] z-10">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {title && <h2 className="text-[20px] font-semibold text-[#1A1A1A] flex-1 text-center mr-8">{title}</h2>}
        {rightAction && <div className="absolute right-4">{rightAction}</div>}
      </div>
    )}
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {children}
    </div>
  </div>
);

// Typography helpers
export const H1 = ({ children, className }: { children: React.ReactNode, className?: string }) => <h1 className={cn("text-[32px] leading-[40px] font-semibold text-[#444444]", className)}>{children}</h1>;
export const H2 = ({ children, className }: { children: React.ReactNode, className?: string }) => <h2 className={cn("text-[24px] leading-[32px] font-semibold text-[#444444]", className)}>{children}</h2>;
export const H3 = ({ children, className }: { children: React.ReactNode, className?: string }) => <h3 className={cn("text-[20px] leading-[28px] font-semibold text-[#444444]", className)}>{children}</h3>;
export const Body = ({ children, className }: { children: React.ReactNode, className?: string }) => <p className={cn("text-[16px] leading-[24px] font-normal text-[#1A1A1A]", className)}>{children}</p>;
export const Caption = ({ children, className }: { children: React.ReactNode, className?: string }) => <p className={cn("text-[12px] leading-[16px] font-normal text-[#666666]", className)}>{children}</p>;

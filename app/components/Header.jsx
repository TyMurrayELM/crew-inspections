'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ClipboardList, FileText, Download, Plus, Languages } from 'lucide-react';

/**
 * Modern Header Component
 * Clean, professional design for Encore Landscape Management
 * Features: Glassmorphism accents, smooth animations, responsive layout
 */
export default function Header({
  title,
  subtitle,
  icon: Icon = ShieldCheck,
  actions = [],
  showLanguageToggle = false,
  language = 'en',
  onLanguageChange = () => {},
}) {
  return (
    <div className="relative mb-6 md:mb-8">
      {/* Subtle background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50" />
      
      {/* Main Header Card */}
      <header className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
        
        <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8">
            
            {/* Left Section: Brand + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              
              {/* Logo */}
              <div className="relative w-32 h-9 sm:w-36 sm:h-10 flex-shrink-0">
                <Image 
                  src="/logoencorenew.png" 
                  alt="Encore Landscape"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

              {/* Title Block */}
              <div className="flex items-center gap-3">
                {/* Icon Badge */}
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2.5 shadow-lg shadow-blue-500/25">
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Title + Subtitle */}
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Language + Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Language Toggle */}
              {showLanguageToggle && (
                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'es', label: 'ES' }
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLanguageChange(code)}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200
                        flex items-center justify-center gap-1.5 uppercase tracking-wide
                        ${language === code
                          ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }
                      `}
                      aria-pressed={language === code}
                      aria-label={code === 'en' ? 'Switch to English' : 'Cambiar a español'}
                    >
                      <Languages className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {actions.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3">
                  {actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    const variant = action.variant || 'primary';
                    
                    const baseClasses = `
                      flex-1 sm:flex-none
                      px-4 sm:px-5 py-2.5
                      font-semibold rounded-xl
                      text-sm
                      flex items-center justify-center gap-2
                      transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    `;

                    const variantStyles = {
                      primary: `
                        bg-gradient-to-r from-slate-800 to-slate-900 
                        text-white 
                        shadow-lg shadow-slate-900/25
                        hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5
                        active:translate-y-0 active:shadow-md
                        focus:ring-slate-500
                      `,
                      secondary: `
                        bg-white
                        text-slate-600 
                        border-2 border-slate-200
                        shadow-sm
                        hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 hover:-translate-y-0.5
                        active:translate-y-0
                        focus:ring-blue-500
                      `,
                      success: `
                        bg-gradient-to-r from-emerald-500 to-emerald-600
                        text-white
                        shadow-lg shadow-emerald-500/25
                        hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5
                        active:translate-y-0 active:shadow-md
                        focus:ring-emerald-500
                      `,
                      outline: `
                        bg-transparent
                        text-slate-600
                        border-2 border-slate-300
                        hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5
                        active:translate-y-0
                        focus:ring-slate-400
                      `,
                    };

                    const content = (
                      <>
                        {ActionIcon && <ActionIcon className="w-4 h-4" strokeWidth={2.5} />}
                        <span>{action.label}</span>
                      </>
                    );

                    const className = `${baseClasses} ${variantStyles[variant]}`;

                    if (action.href) {
                      return (
                        <Link
                          key={index}
                          href={action.href}
                          className={className}
                          aria-label={action.ariaLabel || action.label}
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={className}
                        aria-label={action.ariaLabel || action.label}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// Export commonly used icons for convenience
export { ShieldCheck, ClipboardList, FileText, Download, Plus, Languages };
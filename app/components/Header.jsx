'use client';

import Link from 'next/link';
import { ClipboardList, FileText, Download, Plus, Languages } from 'lucide-react';

/**
 * Modern Header Component
 *
 * A reusable, accessible header with modern design features including:
 * - Gradient accents and elevated design
 * - Professional icons (Lucide React)
 * - Smooth animations and transitions
 * - ARIA labels for accessibility
 * - Responsive mobile layout
 */
export default function Header({
  title,
  subtitle,
  icon: Icon = ClipboardList,
  actions = [],
  showLanguageToggle = false,
  language = 'en',
  onLanguageChange = () => {},
}) {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-xl overflow-hidden mb-6 md:mb-8">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative px-4 md:px-6 py-5 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left section - Title and subtitle */}
          <div className="flex items-start gap-3 md:gap-4 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-2.5 md:p-3 mt-0.5">
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
            </div>

            {/* Title & subtitle */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-blue-100 text-sm md:text-base font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right section - Actions and language toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            {/* Language Toggle */}
            {showLanguageToggle && (
              <div
                className="inline-flex rounded-lg bg-white/10 backdrop-blur-sm p-1 border border-white/20"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200
                    flex items-center gap-1.5
                    ${language === 'en'
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                  aria-pressed={language === 'en'}
                  aria-label="Switch to English"
                >
                  <Languages className="w-3.5 h-3.5" />
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('es')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200
                    flex items-center gap-1.5
                    ${language === 'es'
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                  aria-pressed={language === 'es'}
                  aria-label="Cambiar a español"
                >
                  <Languages className="w-3.5 h-3.5" />
                  ES
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              const baseClasses = `
                px-4 md:px-5 py-2.5 md:py-3
                font-semibold rounded-lg
                transition-all duration-200
                text-center text-sm md:text-base
                flex items-center justify-center gap-2
                shadow-lg hover:shadow-xl
                transform hover:-translate-y-0.5
                active:translate-y-0
              `;

              const variantClasses = {
                primary: 'bg-white text-blue-700 hover:bg-blue-50',
                secondary: 'bg-blue-800 text-white hover:bg-blue-900 border-2 border-white/20',
                success: 'bg-green-600 text-white hover:bg-green-700',
                outline: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/30',
              };

              const content = (
                <>
                  {ActionIcon && <ActionIcon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />}
                  {action.label}
                </>
              );

              const className = `${baseClasses} ${variantClasses[action.variant || 'primary']} ${action.disabled ? 'opacity-50 cursor-not-allowed hover:transform-none' : ''}`;

              // Render as Link or button based on href
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
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400" />
    </header>
  );
}

// Export commonly used icons for convenience
export { ClipboardList, FileText, Download, Plus, Languages };

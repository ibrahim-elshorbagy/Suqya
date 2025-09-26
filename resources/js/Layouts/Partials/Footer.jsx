import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Footer() {
  const { site_settings } = usePage().props;
  const { t } = useTrans();

  const footerText = site_settings?.footer_text;
  const siteName = site_settings?.site_name || 'سُقيا';

  // Don't render footer if no footer text is set
  if (!footerText) {
    return null;
  }

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-0">
            {footerText}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} {siteName}
          </div>
        </div>
      </div>
    </footer>
  );
}

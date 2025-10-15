import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavigationToggles from '@/Components/NavigationToggles';
import { useTrans } from '@/Hooks/useTrans';
import Footer from './Partials/Footer';

export default function UniversalAuthLayout({ children, title = 'Authentication' }) {
  const { locale, site_settings } = usePage().props;
  const { t } = useTrans();

  const siteName = site_settings?.site_name || 'سُقيا';
  const siteDescription = site_settings?.site_description || '';

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Head title={title}>
        {siteDescription && <meta name="description" content={siteDescription} />}
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 backdrop-blur-sm border-b border-neutral-200 dark:border-blue-900 shadow-sm">
        <div className='border-b border-b-neutral-300 dark:border-b-blue-900 bg-blue-50 dark:bg-gradient-to-r dark:from-blue-900 dark:via-blue-800 dark:to-blue-700'>
          <div className='container mx-auto'>
            <div className='flex justify-between items-center mx-4 py-2'>
              {/* Logo and Site Name - Side by Side */}
              <Link href={route('home')} className='flex items-center gap-3 group'>
                <div className="w-12 h-12 transition-transform group-hover:scale-105">
                  <ApplicationLogo />
                </div>
              </Link>

              <div className="max-md:hidden flex items-center gap-4">
                <NavigationToggles variant="compact" showLabels={false} className="hidden sm:flex" />
              </div>
            </div>
            <div className="sm:hidden border-t border-neutral-200 dark:border-blue-900 mt-2 pt-2 mx-4 pb-2">
              <NavigationToggles variant="compact" showLabels={true} className="justify-center" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Single Section */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-neutral-50 to-blue-100 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 pt-24 pb-12 px-4">
          <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-white dark:bg-blue-950/80 shadow-2xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-blue-900 animate-fadeIn">
              <div className="px-6 py-10 sm:px-10">
                {children}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

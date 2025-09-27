import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavigationToggles from '@/Components/NavigationToggles';
import { useTrans } from '@/Hooks/useTrans';
import Footer from './Partials/Footer';

export default function GuestLayout({ children, title = 'Authentication' }) {
  const { locale, site_settings } = usePage().props;
  const { t } = useTrans();

  const siteName = site_settings?.site_name || 'سُقيا';
  const welcomeText = site_settings?.welcome_text || t('auth_modern_left_message');
  const siteDescription = site_settings?.site_description || '';

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Head title={title}>
        {siteDescription && <meta name="description" content={siteDescription} />}
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 backdrop-blur-sm border-b border-neutral-200 dark:border-blue-900 shadow-sm">
        <div className='py-2 border-b border-b-neutral-300 dark:border-b-blue-900 bg-blue-50 dark:bg-gradient-to-r dark:from-blue-900 dark:via-blue-800 dark:to-blue-700'>
          <div className='container mx-auto'>
            <div className='flex justify-between items-center mx-4 py-2'>
              {/* Logo */}
              <Link href={route('home')} className='w-8 h-8'>
                <ApplicationLogo />
              </Link>
              <div className="">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-blue-100">
                  {t('welcome')}
                </h2>
              </div>
              <div className="max-md:hidden flex items-center gap-4">
                <NavigationToggles variant="compact" showLabels={false} className="hidden sm:flex" />
              </div>
            </div>
            <div className="sm:hidden border-t border-neutral-200 dark:border-blue-900 mt-2 pt-2 mx-4">
              <NavigationToggles variant="compact" showLabels={true} className="justify-center" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Modern Two Section Layout */}
      <div className="flex flex-col min-h-screen">
        <main className="py-4 mt-4 flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-neutral-50 to-blue-100 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 pt-20">
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl sm:rounded-2xl overflow-hidden border border-neutral-200 dark:border-blue-900 bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 animate-fadeIn">
            {/* Left Section - Info/Branding */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 dark:from-blue-900 dark:via-blue-800 dark:to-blue-950 text-white px-8 py-12 w-1/2 relative">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-white/20 dark:bg-blue-900/30 rounded-full p-4 mb-4 w-32 h-32 flex items-center justify-center">
                  <ApplicationLogo />
                </div>
                <h2 className="text-3xl font-bold drop-shadow-lg text-white dark:text-blue-100">{siteName}</h2>
                <p className="text-lg opacity-90 text-center max-w-xs font-bold text-white dark:text-blue-200">
                  {welcomeText}
                </p>
                <div className="mt-8">
                  <i className="fa-solid fa-shield-halved text-5xl opacity-40"></i>
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center text-xs opacity-60 text-white dark:text-blue-200">
                &copy; {new Date().getFullYear()} {siteName}
              </div>
            </div>
            {/* Right Section - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 bg-white dark:bg-blue-950/80">
              <div className="w-full max-w-md">
                {/* Mobile welcome text */}
                <div className="md:hidden mb-6 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{siteName}</h2>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {welcomeText}
                    </p>
                  </div>
                </div>
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

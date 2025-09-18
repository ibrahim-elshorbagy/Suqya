import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavigationToggles from '@/Components/NavigationToggles';
import { useTrans } from '@/Hooks/useTrans';

export default function GuestLayout({ children, title = 'Authentication' }) {
  const { locale } = usePage().props;
  const { t } = useTrans();

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Head title={title} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className='py-2 border-b border-b-neutral-300 dark:border-b-neutral-700 bg-blue-50 dark:bg-blue-500'>
          <div className='container mx-auto'>
            <div className='flex justify-between items-center mx-4 py-2'>
              {/* Logo */}
              <Link
                href={route('home')}
                // className="w-24"
              >
                <ApplicationLogo />
              </Link>

              <div className="">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('welcome')}
                </h2>
              </div>

              {/* Right Side - Navigation Toggles */}
              <div className="max-md:hidden flex items-center gap-4">
                <NavigationToggles
                  variant="compact"
                  showLabels={false}
                  className="hidden sm:flex"
                />
              </div>
            </div>

            {/* Mobile toggles row */}
            <div className="sm:hidden border-t border-neutral-200  mt-2 pt-2 mx-4">
              <NavigationToggles
                variant="compact"
                showLabels={true}
                className="justify-center"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-neutral-50 to-blue-100  dark:bg-neutral-800 dark:bg-none pt-20">

        <div className="w-full max-w-md px-4 sm:px-0">
          {children}
        </div>
      </main>


    </div>
  );
}

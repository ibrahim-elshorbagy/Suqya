import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';
import { useTrans } from '@/Hooks/useTrans';


export default function ProfileMenu({ position = 'sidebar' }) {
  const { t } = useTrans();
  const { auth, impersonate_admin_id } = usePage().props;
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Generate profile route based on user role
  const profileRoute = !auth.roles?.includes('admin') && auth.user?.tenant
    ? route('tenant.profile.edit', { slug: auth.user.tenant.slug })
    : route('profile.edit');

  // Handle escape key press and click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuIsOpen(false);
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuIsOpen(false);
      }
    };

    if (menuIsOpen) {
      // Using React's event handler pattern
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);

      // Cleanup function
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuIsOpen]);

  const HandleLogout = () => {
    router.post(route('logout'), {}, { preserveScroll: true });
  }

  // Determine dropdown positioning based on context
  const dropdownPositionClasses = position === 'navbar'
    ? 'top-full mt-2 ltr:right-0 rtl:left-0' // Navbar: dropdown opens downward from top-right
    : 'md:bottom-0 ltr:md:right-[-195px] rtl:md:left-[-195px]'; // Sidebar: dropdown opens to the side

  // Determine arrow rotation based on context and menu state
  const arrowRotationClasses = position === 'navbar'
    ? (menuIsOpen ? '-rotate-90' : 'rotate-90') // Navbar: arrow points down, rotates up when open
    : (menuIsOpen ? 'rotate-90' : 'ltr:rotate-90 rtl:rotate-90 ltr:md:rotate-0 rtl:md:rotate-180'); // Sidebar: arrow rotates down when open

  return (
    <div className="mt-auto relative" ref={menuRef} >
      <button
        type="button"
        className={`flex w-full items-center rounded-xl gap-4 p-2 px-4 text-left text-neutral-800 hover:bg-blue-500/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neutral-300 dark:hover:bg-blue-400/5 dark:hover:text-neutral-100 dark:focus-visible:outline-blue-400 ${menuIsOpen ? 'bg-blue-500/10 dark:bg-blue-400/10' : ''}`}
        aria-haspopup="true"
        aria-expanded={menuIsOpen}
        onClick={() => setMenuIsOpen((v) => !v)}
      >
        {auth.user?.image_url ? (
          <div className="size-8 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={auth.user.image_url}
              alt={auth.user.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="size-8 rounded-xl bg-blue-500 flex items-center justify-center text-white font-semibold">
            {auth.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black dark:text-neutral-100">{auth.user?.name || 'Guest'}</span>
          <span className="sr-only">profile settings</span>
        </div>
        <i className={`fa-solid fa-chevron-right rtl:mr-auto ltr:ml-auto shrink-0 transition-transform duration-200 ${arrowRotationClasses}`} aria-hidden="true"></i>
      </button>
      {/* Menu */}
      {menuIsOpen && (
        <div
          className={`absolute w-full md:w-48 ${dropdownPositionClasses} z-20 border divide-y divide-neutral-300 border-neutral-300 bg-neutral-100 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl animate-fade-in`}
          role="menu"
        >
          <div className="flex flex-col py-1.5">
            <Link href={profileRoute} className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-neutral-800 underline-offset-2 hover:bg-blue-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-blue-400/5 dark:hover:text-neutral-100" role="menuitem">
              <i className="fa-solid fa-user shrink-0" aria-hidden="true"></i>
              <span>{t('profile')}</span>
            </Link>
          </div>
          <div className="flex flex-col py-1.5">
            <ThemeToggle className="w-full justify-start px-2 py-1.5 text-sm font-medium text-neutral-800 underline-offset-2 hover:bg-blue-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-blue-400/5 dark:hover:text-neutral-100" />
          </div>
          {/* <div className="flex flex-col py-1.5">
              <LanguageToggle className="w-full justify-start px-2 py-1.5 text-sm font-medium text-neutral-800 underline-offset-2 hover:bg-blue-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-blue-400/5 dark:hover:text-neutral-100" />
          </div> */}
          {impersonate_admin_id && (
            <div className="flex flex-col py-1.5">
              <button
                onClick={() => router.post(route('admin.return_to_admin'), {}, { preserveScroll: true })}
                className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-blue-800 underline-offset-2 hover:bg-blue-500/10 hover:text-blue-900 focus-visible:underline focus:outline-hidden dark:text-blue-300 dark:hover:bg-blue-400/10 dark:hover:text-blue-100"
                role="menuitem"
              >
                <i className="fa-solid fa-user-shield shrink-0" aria-hidden="true"></i>
                <span>{t('return_to_admin')}</span>
              </button>
            </div>
          )}
          <div className="flex flex-col py-1.5">
            <button onClick={HandleLogout} className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-neutral-800 underline-offset-2 hover:bg-blue-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-blue-400/5 dark:hover:text-neutral-100" role="menuitem">
              <i className="fa-solid fa-right-from-bracket shrink-0" aria-hidden="true"></i>
              <span>{t('sign_out')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

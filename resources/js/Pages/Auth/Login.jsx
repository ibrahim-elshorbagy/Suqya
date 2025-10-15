import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Login({ status, canResetPassword, tenant, isMainLogin = true }) {
  const { t } = useTrans();
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();

    // Submit to the correct route based on login type
    if (isMainLogin) {
      // Main platform login
      post(route('login'), {
        onFinish: () => reset('password'),
      });
    } else {
      // Tenant login - use tenant slug
      post(route('tenant-user.login.store', { slug: tenant.slug }), {
        onFinish: () => reset('password'),
      });
    }
  };

  return (
    <GuestLayout title={t('auth_login')}>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-right-to-bracket"></i> {t('auth_welcome_back')}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t('auth_sign_in_to_your_account')}
        </p>
      </div>
      <div className="">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <InputLabel htmlFor="email" value={t('auth_email')} />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="email"
              isFocused={true}
              onChange={(e) => setData('email', e.target.value)}
              icon="fa-envelope"
              required
              placeholder={t('auth_email')}
            />
            <InputError message={errors.email} className="mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <InputLabel htmlFor="password" value={t('auth_password')} />
              {canResetPassword && (
                <Link
                  href={isMainLogin ? route('password.request') : route('tenant-user.password.request', { slug: tenant.slug })}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('auth_forgot_password')}
                </Link>
              )}
            </div>
            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              autoComplete="current-password"
              onChange={(e) => setData('password', e.target.value)}
              icon="fa-lock"
              placeholder={t('auth_password')}
              required
            />
            <InputError message={errors.password} className="mt-2" />
          </div>
          <div>
            <label className="flex items-center">
              <Checkbox
                name="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <span className="ms-2 text-sm text-neutral-700 dark:text-neutral-300">
                {t('auth_remember_me')}
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-70"
          >
            {processing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-right-to-bracket"></i>
            )}
            {t('auth_login')}
          </button>

          {/* Only show OAuth on main login */}
          {isMainLogin && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {t('auth_or')}
                  </span>
                </div>
              </div>

              <a
                href={route('auth.redirect', 'google')}
                className="w-full flex justify-center items-center gap-3 px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t('auth_continue_with_google')}
              </a>

              <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                {t('auth_dont_have_account')} {" "}
                <Link href={route('register')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {t('auth_register')}
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </GuestLayout>
  );
}

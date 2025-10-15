import UniversalAuthLayout from '@/Layouts/UniversalAuthLayout';
import { Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function VerifyEmail({ status }) {
  const { t } = useTrans();
  const { post, processing } = useForm({});

  const submit = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <UniversalAuthLayout title={t('auth_verify_email')}>
      <div className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-envelope-circle-check text-2xl text-blue-500 dark:text-blue-400"></i>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-blue-100">
          {t('auth_verify_email')}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {t('auth_one_last_step')}
        </p>
      </div>

      <div className="text-center mb-6 text-sm text-neutral-700 dark:text-neutral-300 space-y-2">
        <p>{t('auth_verification_email_sent')}</p>
        <p>{t('auth_click_link_complete')}</p>
      </div>

      {status === 'verification-link-sent' && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle"></i>
            <span>{t('auth_verification_link_sent') || 'A new verification link has been sent to your email address.'}</span>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <button
          type="submit"
          disabled={processing}
          className="w-full flex justify-center items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-70"
        >
          {processing ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
          {t('auth_resend_verification_email')}
        </button>

        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="w-full flex justify-center items-center gap-2 px-4 py-2 font-semibold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-all"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          {t('auth_logout')}
        </Link>
      </form>
    </UniversalAuthLayout>
  );
}

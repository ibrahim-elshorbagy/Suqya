import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}) {
  const user = usePage().props.auth.user;
  const { t } = useTrans();

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
    });

  const submit = (e) => {
    e.preventDefault();

    patch(route('profile.update'));
  };

  return (
    <section className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('update_profile_info')}
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <InputLabel htmlFor="name" value={t('full_name')} />
            <TextInput
              id="name"
              className="mt-1 block w-full"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              required
              isFocused
              autoComplete="name"
              icon="fa-user"
            />
            <InputError className="mt-2" message={errors.name} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="email" value={t('email_address')} />
            <TextInput
              id="email"
              type="email"
              className="mt-1 block w-full"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoComplete="email"
              icon="fa-envelope"
            />
            <InputError className="mt-2" message={errors.email} />
          </div>
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <i className="fa-solid fa-exclamation-circle"></i>
              <span>{t('email_not_verified')}</span>
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('resend_verification_email')}
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <div className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                {t('verification_link_sent')}
              </div>
            )}
          </div>
        )}
        {mustVerifyEmail && user.email_verified_at !== null && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <i className="fa-solid fa-circle-check"></i>
              <span>{t('email_verified')}</span>
            </p>
          </div>
        )}


        <div className="pt-4 flex items-center gap-4">
          <PrimaryButton
            type="submit"
            disabled={processing}
            icon="fa-floppy-disk"
            rounded="rounded-lg"
            withShadow={false}
          >
            {t('save_changes')}
          </PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <i className="fa-solid fa-check"></i> {t('saved_successfully')}
            </p>
          </Transition>
        </div>
      </form>
    </section>
  );
}

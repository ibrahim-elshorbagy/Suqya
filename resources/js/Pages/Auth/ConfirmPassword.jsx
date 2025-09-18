import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function ConfirmPassword() {
  const { t } = useTrans();
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  const submit = (e) => {
    e.preventDefault();

    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout title={t('auth_confirm_password_title')}>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-shield-halved"></i> {t('auth_confirm_password_title')}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t('auth_confirm_password_subtitle')}
        </p>
      </div>
      <div className="">
        <div className="mb-4 flex items-center p-3 rounded-lg bg-blue-50 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          <i className="fa-solid fa-shield-halved mr-2"></i>
          <span>{t('auth_secure_area_message')}</span>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <InputLabel htmlFor="password" value={t('auth_password')} />
            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              isFocused={true}
              onChange={(e) => setData('password', e.target.value)}
              icon="fa-lock"
              required
            />
            <InputError message={errors.password} className="mt-2" />
          </div>
          <button
            type="submit"
            disabled={processing}
            className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-70"
          >
            {processing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-check-circle"></i>
            )}
            {t('auth_confirm_password_button')}
          </button>
        </form>
      </div>
    </GuestLayout>
  );
}

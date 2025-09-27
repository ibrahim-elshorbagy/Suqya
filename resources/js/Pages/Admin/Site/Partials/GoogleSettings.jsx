import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useTrans } from '@/Hooks/useTrans';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function GoogleSettings({ settings }) {
  const { t } = useTrans();

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    settings: {
      google_client_id: settings.google_client_id || '',
      google_client_secret: settings.google_client_secret || ''
    },
    env_settings: ['google_client_id', 'google_client_secret'] // Settings that should be stored in .env file
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.site-settings.update'), {
      preserveScroll: true
    });
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fab fa-google text-blue-500"></i>
          {t('google_settings')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {t('google_settings_description')}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={submit} className="space-y-6">
          {/* Google Client ID */}
          <div>
            <InputLabel value={t('google_client_id')} />
            <TextInput
              value={data.settings.google_client_id}
              onChange={(e) => setData('settings', {
                ...data.settings,
                google_client_id: e.target.value
              })}
              icon="fab fa-google"
              className="mt-1 block w-full"
              placeholder="123456789-abcdefg.apps.googleusercontent.com"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('google_client_id_help')}
            </p>
            <InputError message={errors['settings.google_client_id']} className="mt-2" />
          </div>

          {/* Google Client Secret */}
          <div>
            <InputLabel value={t('google_client_secret')} />
            <TextInput
              type="password"
              value={data.settings.google_client_secret}
              onChange={(e) => setData('settings', {
                ...data.settings,
                google_client_secret: e.target.value
              })}
              icon="fa-key"
              className="mt-1 block w-full"
              placeholder="GOCSPX-..."
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('google_client_secret_help')}
            </p>
            <InputError message={errors['settings.google_client_secret']} className="mt-2" />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-info-circle text-blue-500 mt-1"></i>
              <div className="flex-1 text-sm">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Google OAuth Callback URI
                </h4>
                <div className="bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-md px-3 py-2 flex items-center justify-between">
                  <span className="text-blue-800 dark:text-blue-200 break-all ">
                    https://my.suqya.net/auth/google/callback
                  </span>
                  <button
                    className="ml-3 px-2 py-1 text-xs rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText("https://my.suqya.net/auth/google/callback") }}
                  >
                    Copy
                  </button>
                </div>
                {/*
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mt-4 mb-2">
                    {t('google_setup_instructions')}
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>{t('google_step_1')}</li>
                    <li>{t('google_step_2')}</li>
                    <li>{t('google_step_3')}</li>
                    <li>{t('google_step_4')}</li>
                  </ol>
                  */}
              </div>
            </div>
          </div>


          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
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
      </div>
    </div>
  );
}

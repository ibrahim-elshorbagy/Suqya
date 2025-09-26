import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useTrans } from '@/Hooks/useTrans';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EmailSettings({ settings }) {
  const { t } = useTrans();

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    settings: {
      site_email: settings.site_email || '',
      site_email_name: settings.site_email_name || '',
      site_reply_to: settings.site_reply_to || '',
      mail_host: settings.mail_host || '',
      mail_port: settings.mail_port || '587',
      mail_username: settings.mail_username || '',
      mail_password: settings.mail_password || ''
    },
    env_settings: ['site_email', 'site_email_name', 'mail_host', 'mail_port', 'mail_username', 'mail_password'] // Settings that should be stored in .env file
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
          <i className="fa-solid fa-envelope text-blue-500"></i>
          {t('email_settings')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {t('smtp_settings_description')}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={submit} className="space-y-6">
          {/* Site Email */}
          <div>
            <InputLabel value={t('site_email')} />
            <TextInput
              type="email"
              value={data.settings.site_email}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_email: e.target.value
              })}
              icon="fa-envelope"
              className="mt-1 block w-full"
              placeholder="noreply@example.com"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('site_email_help')}
            </p>
            <InputError message={errors['settings.site_email']} className="mt-2" />
          </div>

          {/* Site Email Name */}
          <div>
            <InputLabel value={t('site_email_name')} />
            <TextInput
              value={data.settings.site_email_name}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_email_name: e.target.value
              })}
              icon="fa-tag"
              className="mt-1 block w-full"
              placeholder={t('site_email_name_placeholder')}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('site_email_name_help')}
            </p>
            <InputError message={errors['settings.site_email_name']} className="mt-2" />
          </div>

          {/* Reply To Email */}
          <div>
            <InputLabel value={t('site_reply_to')} />
            <TextInput
              type="email"
              value={data.settings.site_reply_to}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_reply_to: e.target.value
              })}
              icon="fa-reply"
              className="mt-1 block w-full"
              placeholder="support@example.com"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('site_reply_to_help')}
            </p>
            <InputError message={errors['settings.site_reply_to']} className="mt-2" />
          </div>

          {/* SMTP Configuration Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-server text-blue-500"></i>
              {t('smtp_configuration')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SMTP Host */}
              <div>
                <InputLabel value={t('mail_host')} />
                <TextInput
                  value={data.settings.mail_host}
                  onChange={(e) => setData('settings', {
                    ...data.settings,
                    mail_host: e.target.value
                  })}
                  icon="fa-server"
                  className="mt-1 block w-full"
                  placeholder="smtp.gmail.com"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t('mail_host_help')}
                </p>
                <InputError message={errors['settings.mail_host']} className="mt-2" />
              </div>

              {/* SMTP Port */}
              <div>
                <InputLabel value={t('mail_port')} />
                <TextInput
                  type="number"
                  value={data.settings.mail_port}
                  onChange={(e) => setData('settings', {
                    ...data.settings,
                    mail_port: e.target.value
                  })}
                  icon="fa-plug"
                  className="mt-1 block w-full"
                  placeholder="587"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t('mail_port_help')}
                </p>
                <InputError message={errors['settings.mail_port']} className="mt-2" />
              </div>

              {/* SMTP Username */}
              <div>
                <InputLabel value={t('mail_username')} />
                <TextInput
                  value={data.settings.mail_username}
                  onChange={(e) => setData('settings', {
                    ...data.settings,
                    mail_username: e.target.value
                  })}
                  icon="fa-user"
                  className="mt-1 block w-full"
                  placeholder="your-email@gmail.com"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t('mail_username_help')}
                </p>
                <InputError message={errors['settings.mail_username']} className="mt-2" />
              </div>

              {/* SMTP Password */}
              <div>
                <InputLabel value={t('mail_password')} />
                <TextInput
                  type="password"
                  value={data.settings.mail_password}
                  onChange={(e) => setData('settings', {
                    ...data.settings,
                    mail_password: e.target.value
                  })}
                  icon="fa-key"
                  className="mt-1 block w-full"
                  placeholder="••••••••••••••••"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t('mail_password_help')}
                </p>
                <InputError message={errors['settings.mail_password']} className="mt-2" />
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

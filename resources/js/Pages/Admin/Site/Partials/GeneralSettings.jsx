import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function GeneralSettings({ settings, timezones = [] }) {
  const { t } = useTrans();
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    settings: {
      site_name: settings.site_name || '',
      site_description: settings.site_description || '',
      site_keywords: settings.site_keywords || '',
      timezone: settings.timezone || 'UTC',
      welcome_text: settings.welcome_text || '',
      footer_text: settings.footer_text || '',
      site_logo: settings.site_logo || '',
      site_favicon: settings.site_favicon || ''
    },
    files: {},
    env_settings: ['site_name', 'timezone'] // Settings that should be stored in .env file
  });

  // Use passed timezones or fallback to basic ones
  const timezoneOptions = timezones.length > 0 ? timezones : [
    { value: 'UTC', label: 'UTC' },
    { value: 'Asia/Riyadh', label: 'Asia/Riyadh' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo' }
  ];

  const handleFileChange = (key, file) => {
    if (file) {
      // Update files object for upload
      setData((prevData) => ({
        ...prevData,
        files: { ...prevData.files, [key]: file },
        settings: { ...prevData.settings, [key]: 'uploading' }
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        if (key === 'site_logo') setLogoPreview(e.target.result);
        if (key === 'site_favicon') setFaviconPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = (e) => {
    e.preventDefault();

    // Debug logging
    console.log('Form data being submitted:', data);
    console.log('Files:', data.files);
    console.log('Settings:', data.settings);

    post(route('admin.site-settings.update'), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        console.log('Upload successful');
        // Reset file previews on success
        setLogoPreview(null);
        setFaviconPreview(null);
      },
      onError: (errors) => {
        console.log('Upload errors:', errors);
      }
    });
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-cog text-blue-500"></i>
          {t('general_settings')}
        </h2>
      </div>

      <div className="p-6">
        <form onSubmit={submit} className="space-y-6">
          {/* Site Name */}
          <div>
            <InputLabel value={t('site_name')} />
            <TextInput
              value={data.settings.site_name}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_name: e.target.value
              })}
              icon="fa-globe"
              className="mt-1 block w-full"
            />
            <InputError message={errors['settings.site_name']} className="mt-2" />
          </div>

          {/* Site Description */}
          <div>
            <InputLabel value={t('site_description')} />
            <TextArea
              value={data.settings.site_description}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_description: e.target.value
              })}
              icon="fa-file-text"
              className="mt-1 block w-full"
              rows="3"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('site_description_help')}
            </p>
            <InputError message={errors['settings.site_description']} className="mt-2" />
          </div>

          {/* Site Keywords */}
          <div>
            <InputLabel value={t('site_keywords')} />
            <TextArea
              value={data.settings.site_keywords}
              onChange={(e) => setData('settings', {
                ...data.settings,
                site_keywords: e.target.value
              })}
              icon="fa-tags"
              className="mt-1 block w-full"
              placeholder={t('site_keywords_placeholder')}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('site_keywords_help')}
            </p>
            <InputError message={errors['settings.site_keywords']} className="mt-2" />
          </div>

          {/* Timezone */}
          <div>
            <SelectInput
              label={t('timezone')}
              value={data.settings.timezone}
              onChange={(e) => setData('settings', {
                ...data.settings,
                timezone: e.target.value
              })}
              options={timezoneOptions}
              icon="fa-clock"
            />
            <InputError message={errors['settings.timezone']} className="mt-2" />
          </div>

          {/* Logo Upload */}
          <div>
            <InputLabel value={t('site_logo')} />
            <div className="mt-2 flex items-center gap-4">
              {(logoPreview || settings.site_logo) && (
                <img
                  src={logoPreview || `/storage/${settings.site_logo}`}
                  alt="Logo"
                  className="h-16 w-16 object-contain border rounded"
                />
              )}
              <div>
                <input
                  type="file"
                  onChange={(e) => handleFileChange('site_logo', e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  <i className="fas fa-upload"></i>
                  {t('choose_logo')}
                </label>
              </div>
            </div>
            <InputError message={errors['files.site_logo']} className="mt-2" />
          </div>

          {/* Favicon Upload */}
          <div>
            <InputLabel value={t('site_favicon')} />
            <div className="mt-2 flex items-center gap-4">
              {(faviconPreview || settings.site_favicon) && (
                <img
                  src={faviconPreview || `/storage/${settings.site_favicon}`}
                  alt="Favicon"
                  className="h-8 w-8 object-contain border rounded"
                />
              )}
              <div>
                <input
                  type="file"
                  onChange={(e) => handleFileChange('site_favicon', e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                  id="favicon-upload"
                />
                <label
                  htmlFor="favicon-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  <i className="fas fa-upload"></i>
                  {t('choose_favicon')}
                </label>
              </div>
            </div>
            <InputError message={errors['files.site_favicon']} className="mt-2" />
          </div>

          {/* Welcome Text */}
          <div>
            <InputLabel value={t('welcome_text')} />
            <TextArea
              value={data.settings.welcome_text}
              onChange={(e) => setData('settings', {
                ...data.settings,
                welcome_text: e.target.value
              })}
              icon="fa-hand-wave"
              className="mt-1 block w-full"
              rows="3"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {t('welcome_text_description')}
            </p>
            <InputError message={errors['settings.welcome_text']} className="mt-2" />
          </div>

          {/* Footer Text */}
          <div>
            <InputLabel value={t('footer_text')} />
            <TextArea
              value={data.settings.footer_text}
              onChange={(e) => setData('settings', {
                ...data.settings,
                footer_text: e.target.value
              })}
              icon="fa-bookmark"
              className="mt-1 block w-full"
              rows="2"
            />
            <InputError message={errors['settings.footer_text']} className="mt-2" />
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

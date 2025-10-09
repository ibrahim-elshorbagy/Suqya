import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useState, useRef } from 'react';

export default function UpdateBasicInfo({ tenant, currencies, className = '' }) {
  const { t } = useTrans();
  const faviconInput = useRef();

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    name: tenant?.name || '',
    slug: tenant?.slug || '',
    currency_id: tenant?.currency_id || '',
    favicon: null,
    welcome_message_title: tenant?.welcome_message_title || '',
  });

  const [faviconPreview, setFaviconPreview] = useState(null);

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(t('file_too_large') || 'File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/ico', 'image/x-icon'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('invalid_file_type') || 'Please select a valid image file (JPG, PNG, GIF, WEBP, ICO)');
        return;
      }

      setData('favicon', file);

      // Create preview for images (not for ICO files as they might not display properly)
      if (file.type !== 'image/x-icon' && file.type !== 'image/ico') {
        const reader = new FileReader();
        reader.onload = (e) => setFaviconPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFaviconPreview(null);
      }
    }
  };

  const clearFavicon = () => {
    setData('favicon', null);
    setFaviconPreview(null);
    if (faviconInput.current) {
      faviconInput.current.value = '';
    }
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('tenant.basic-info.update', tenant.slug), data, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setFaviconPreview(null);
        if (faviconInput.current) {
          faviconInput.current.value = '';
        }
      }
    });
  };



  return (
    <section className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('update_basic_info_description')}
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <InputLabel htmlFor="company_name" value={t('company_name')} />
            <TextInput
              id="company_name"
              className="mt-1 block w-full"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              required
              isFocused
              autoComplete="organization"
              icon="fa-building"
            />
            <InputError className="mt-2" message={errors.name} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="company_slug" value={t('company_slug')} />
            <TextInput
              id="company_slug"
              className="mt-1 block w-full"
              value={data.slug}
              onChange={(e) => setData('slug', e.target.value)}
              required
              autoComplete="url"
              icon="fa-link"
              placeholder="company-name-slug"
            />
            <InputError className="mt-2" message={errors.slug} />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('slug_condition')}
            </p>
          </div>
        </div>

        <div className='space-y-2'>
          <SelectInput
            name="currency_id"
            value={data.currency_id}
            onChange={(e) => setData('currency_id', e.target.value)}
            options={[
              { value: '', label: t('select_currency') || 'Select Currency' },
              ...currencies.map(currency => ({
                value: currency.id,
                label: `${currency.name} (${currency.code})`
              }))
            ]}
            label={t('currency') || 'Currency'}
            icon="fa-money-bill"
          />
          <InputError className="mt-2" message={errors.currency_id} />
        </div>

        {/* Favicon Section */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t('favicon') || 'Favicon'}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('favicon_description') || 'Upload a favicon for your company (recommended size: 16x16 or 32x32 pixels)'}
          </p>

          <div className="flex items-start gap-6">
            {/* Current Favicon */}
            {tenant?.favicon ? (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700 p-2">
                  <img
                    src={`/storage/${tenant.favicon}`}
                    alt="Current favicon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('current_favicon') || 'Current'}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <i className="fa-solid fa-image text-neutral-400 text-xl"></i>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{t('no_favicon') || 'No favicon'}</p>
              </div>
            )}

            {/* Preview New Favicon */}
            {faviconPreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={faviconPreview}
                  alt="Favicon preview"
                  className="h-16 w-16 rounded-lg object-cover border-2 border-blue-400 dark:border-blue-600 p-1 bg-white dark:bg-neutral-800"
                />
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_favicon') || 'New'}</p>
                <button
                  type="button"
                  onClick={clearFavicon}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove') || 'Remove'}
                </button>
              </div>
            ) : data.favicon && (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center border-2 border-green-400 dark:border-green-600">
                  <i className="fa-solid fa-image text-green-600 dark:text-green-400 text-xl"></i>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('new_favicon') || 'New'}</p>
                <button
                  type="button"
                  onClick={clearFavicon}
                  className="text-xs text-red-600 hover:underline"
                >
                  {t('remove') || 'Remove'}
                </button>
              </div>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={faviconInput}
              className="hidden"
              onChange={handleFaviconChange}
              accept=".ico,.png,.jpg,.jpeg,.gif,.webp"
            />

            <label
              htmlFor="favicon"
              onClick={() => faviconInput.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-upload"></i>
              {t('choose_favicon') || 'Choose Favicon'}
            </label>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {t('favicon_requirements') || 'ICO, PNG, JPG, GIF, WEBP files up to 10MB. Recommended size: 16x16 or 32x32 pixels.'}
            </p>
            <InputError message={errors.favicon} className="mt-2" />
          </div>
        </div>

        {/* Welcome Message Section */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {t('welcome_message') || 'Welcome Message'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className='space-y-2'>
              <InputLabel htmlFor="welcome_message_title" value={t('welcome_message_title') || 'Welcome Title'} />
              <TextArea
                rows={3}
                id="welcome_message_title"
                className="mt-1 block w-full"
                value={data.welcome_message_title}
                onChange={(e) => setData('welcome_message_title', e.target.value)}
                placeholder={t('welcome_title_placeholder') || 'Welcome to our store!'}
                icon="fa-heading"
              />
              <InputError className="mt-2" message={errors.welcome_message_title} />
            </div>

          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <PrimaryButton
            type="submit"
            disabled={processing}
            icon="fa-floppy-disk"
            rounded="rounded-lg"
            withShadow={false}
          >
            {processing ? (t('saving') || 'Saving...') : (t('save_changes') || 'Save Changes')}
          </PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <i className="fa-solid fa-check"></i> {t('saved_successfully') || 'Saved successfully!'}
            </p>
          </Transition>
        </div>
      </form>
    </section>
  );
}

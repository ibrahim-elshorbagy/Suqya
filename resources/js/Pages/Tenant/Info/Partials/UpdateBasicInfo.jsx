import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import ActionButton from '@/Components/ActionButton';
import { Transition } from '@headlessui/react';
import { useForm, router, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useState, useEffect } from 'react';

export default function UpdateBasicInfo({ tenant, currencies, className = '' }) {
  const { t } = useTrans();
  const { flash } = usePage().props;
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrImageKey, setQrImageKey] = useState(Date.now());

  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    name: tenant?.name || '',
    slug: tenant?.slug || '',
    currency_id: tenant?.currency_id || '',
  });

  // Update QR image key when tenant QR code changes
  useEffect(() => {
    if (tenant?.qr_code) {
      setQrImageKey(Date.now());
    }
  }, [tenant?.qr_code]);

  // Handle flash messages for QR generation
  useEffect(() => {
    if (flash?.status === 'success' && flash?.title?.includes('QR')) {
      setQrImageKey(Date.now());
      // Force page refresh to get updated tenant data
      setTimeout(() => {
        router.reload({ only: ['tenant'] });
      }, 500);
    }
  }, [flash]);

  const submit = (e) => {
    e.preventDefault();
    patch(route('tenant.basic-info.update'), data, {
      preserveScroll: true,
    });
  };

  const generateQrCode = () => {
    if (isGeneratingQr) return; // Prevent multiple requests

    console.log('Generating QR code for tenant:', tenant?.id, 'slug:', tenant?.slug);
    setIsGeneratingQr(true);

    router.post(route('tenant.generate-qr'), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        console.log('QR generation success:', page);
        setIsGeneratingQr(false);
        setQrImageKey(Date.now());
        // Reload tenant data
        router.reload({ only: ['tenant'] });
      },
      onError: (errors) => {
        console.error('QR generation error:', errors);
        setIsGeneratingQr(false);
      },
      onFinish: () => {
        console.log('QR generation finished');
        setIsGeneratingQr(false);
      },
    });
  };

  const copyQrCode = async () => {
    if (!tenant?.qr_code) return;

    try {
      // Create a canvas to convert the image to blob
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS if needed

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            alert(t('qr_code_copied') || 'QR Code copied to clipboard!');
          } catch (error) {
            console.error('Failed to copy QR code:', error);
            alert(t('copy_failed') || 'Failed to copy QR code to clipboard');
          }
        }, 'image/png');
      };

      img.onerror = () => {
        console.error('Failed to load QR code image');
        alert(t('copy_failed') || 'Failed to copy QR code to clipboard');
      };

      // Load the image
      img.src = `/storage/${tenant.qr_code}?v=${qrImageKey}`;

    } catch (error) {
      console.error('Copy QR code error:', error);
      alert(t('copy_failed') || 'Failed to copy QR code to clipboard');
    }
  };


  const downloadQrCode = () => {
    if (tenant?.qr_code) {
      const link = document.createElement('a');
      link.href = `/storage/${tenant.qr_code}?download=1`;
      link.download = `${tenant.slug}-qr-code.${tenant.qr_code.split('.').pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openQrCodeInNewTab = () => {
    if (tenant?.qr_code) {
      window.open(`/storage/${tenant.qr_code}`, '_blank');
    }
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

        {/* QR Code Section */}
        {tenant?.slug && (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-qrcode text-blue-500"></i>
                  {t('qr_code')}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {t('qr_code_description')}
                </p>
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong>{t('website_url')}:</strong>
                  <span className="ml-2 text-blue-600 dark:text-blue-400 break-all">
                    {window.location.origin}/{tenant.slug}
                  </span>
                </div>

              </div>

              <div className="flex flex-col items-center gap-3">
                {tenant?.qr_code ? (
                  <>
                    <div className="bg-white p-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-sm">
                      <img
                        key={qrImageKey}
                        src={`/storage/${tenant.qr_code}?v=${qrImageKey}`}
                        alt="QR Code"
                        className="w-24 h-24 lg:w-32 lg:h-32"
                        onLoad={() => console.log('QR image loaded successfully')}
                        onError={(e) => {
                          console.error('QR code failed to load:', e);
                          console.log('Image src:', e.target.src);
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <ActionButton
                        onClick={downloadQrCode}
                        variant="success"
                        icon="fa-download"
                        size="sm"
                        as="button"
                        type="button"
                      >
                        {t('download')}
                      </ActionButton>
                      <ActionButton
                        onClick={copyQrCode}
                        variant="info"
                        icon="fa-copy"
                        size="sm"
                        as="button"
                        type="button"
                      >
                        {t('copy')}
                      </ActionButton>

                      <ActionButton
                        onClick={openQrCodeInNewTab}
                        variant="primary"
                        icon="fa-external-link-alt"
                        size="sm"
                        as="button"
                        type="button"
                      >
                        {t('view')}
                      </ActionButton>
                      <ActionButton
                        onClick={generateQrCode}
                        variant="info"
                        icon={isGeneratingQr ? "fa-spinner fa-spin" : "fa-refresh"}
                        size="sm"
                        as="button"
                        type="button"
                        disabled={isGeneratingQr}
                      >
                        {isGeneratingQr ? (t('generating') || 'Generating...') : (t('regenerate_qr') || 'Regenerate')}
                      </ActionButton>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-700">
                      {isGeneratingQr ? (
                        <i className="fa-solid fa-spinner fa-spin text-blue-500 text-3xl"></i>
                      ) : (
                        <i className="fa-solid fa-qrcode text-neutral-400 dark:text-neutral-500 text-3xl"></i>
                      )}
                    </div>
                    <ActionButton
                      onClick={generateQrCode}
                      variant="success"
                      icon={isGeneratingQr ? "fa-spinner fa-spin" : "fa-qrcode"}
                      size="sm"
                      as="button"
                      type="button"
                      disabled={isGeneratingQr || !tenant.slug}
                    >
                      {isGeneratingQr ? (t('generating') || 'Generating...') : (t('generate_qr') || 'Generate QR')}
                    </ActionButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </form>
    </section>
  );
}

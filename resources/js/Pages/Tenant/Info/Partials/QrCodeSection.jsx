import ActionButton from '@/Components/ActionButton';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useState, useEffect } from 'react';

export default function QrCodeSection({ tenant, className = '' }) {
  const { t } = useTrans();
  const { flash } = usePage().props;
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrImageKey, setQrImageKey] = useState(Date.now());

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

  const generateQrCode = () => {
    if (isGeneratingQr) return; // Prevent multiple requests

    setIsGeneratingQr(true);

    router.post(route('tenant.generate-qr'), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setIsGeneratingQr(false);
        setQrImageKey(Date.now());
        // Reload tenant data
        router.reload({ only: ['tenant'] });
      },
      onError: (errors) => {
        setIsGeneratingQr(false);
      },
      onFinish: () => {
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
      {tenant?.slug ? (
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
              <div className="text-sm text-neutral-700 dark:text-neutral-300 ">
                <strong>{t('website_url')}:</strong>
                <br />
                <span className="ml-2 text-blue-600 dark:text-blue-400 break-all flex gap-2">
                  <span>{window.location.origin}/{tenant.slug}</span>
                  <a
                    href={`${window.location.origin}/${tenant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    aria-label="Open tenant link in new tab"
                  >
                    <i className="fa fa-external-link" aria-hidden="true"></i>
                  </a>
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
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-exclamation-triangle text-yellow-600 dark:text-yellow-400"></i>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {t('save_basic_info_first') || 'Please save your basic information first to generate a QR code.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

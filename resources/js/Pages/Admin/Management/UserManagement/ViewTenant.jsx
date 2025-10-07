import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import ActionButton from '@/Components/ActionButton';
import MapViewer from '@/Components/MapViewer';

export default function ViewTenant({ auth, tenant, user }) {
  const { t } = useTrans();

  const handleBack = () => {
    router.get(route('admin.users.index'));
  };


  const handleLoginAs = () => {
    if (confirm(t('are_you_sure_login_as') + ` "${user.name}"?`)) {
      router.post(route('admin.login_as', user.id), {}, { preserveScroll: true });
    }
  };

  const downloadFile = (filePath, fileName) => {
    if (filePath) {
      const link = document.createElement('a');
      link.href = `/storage/${filePath}`;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openFileInNewTab = (filePath) => {
    if (filePath) {
      window.open(`/storage/${filePath}`, '_blank');
    }
  };

  return (
    <AppLayout user={auth.user}>
      <Head title={`${t('view_tenant')} - ${tenant.name}`} />

      <div className="m-3 xl:m-5">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ActionButton
                onClick={handleBack}
                variant="secondary"
                icon="fa-arrow-right"
                size="sm"
                as="button"
              >
                {t('back')}
              </ActionButton>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {t('view_tenant')}
              </h1>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('tenant_details_and_information')}
            </p>
          </div>
          <div className="flex gap-2">
            <ActionButton
              onClick={handleLoginAs}
              variant="info"
              icon="fa-right-to-bracket"
              size="sm"
              as="button"
            >
              {t('login_as')}
            </ActionButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Contact */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-building text-blue-500"></i>
                  {t('basic_information')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('company_name')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.name || t('not_provided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('company_slug')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.slug || t('not_provided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('currency')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.currency ? `${tenant.currency.name} (${tenant.currency.code})` : t('not_provided')}
                    </p>
                  </div>
                </div>
                {tenant.slug && (
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('website_url')}
                    </label>
                    <p className="text-blue-600 dark:text-blue-400 mt-1 break-all">
                      <a
                        href={`${window.location.origin}/${tenant.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {window.location.origin}/{tenant.slug}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-phone text-blue-500"></i>
                  {t('contact_information')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div clas>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                      <i className="fa-solid fa-phone text-xs"></i>
                      {t('phone_number')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1 ">
                      <span dir="ltr">
                        {tenant.phone || t('not_provided')}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                      <i className="fa-brands fa-whatsapp text-xs"></i>
                      {t('whatsapp_number')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1 ">
                      {tenant.whatsapp ? (
                        <a
                          href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          <span dir='ltr'>{tenant.whatsapp}</span>
                        </a>
                      ) : (
                        t('not_provided')
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <i className="fa-solid fa-envelope text-xs"></i>
                    {t('email_address')}
                  </label>
                  <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                    {tenant.email || t('not_provided')}
                  </p>
                </div>

              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-map-marker-alt text-blue-500"></i>
                  {t('location_information')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('country')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.country || t('not_provided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('city')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.city || t('not_provided')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('area')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {tenant.area || t('not_provided')}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('full_address')}
                  </label>
                  <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                    {tenant.full_address || t('not_provided')}
                  </p>
                </div>

                {/* Interactive Map */}
                {(tenant.latitude && tenant.longitude) && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <i className="fa-solid fa-map text-blue-500"></i>
                      {t('location_on_map')}
                    </label>
                    <MapViewer
                      latitude={tenant.latitude}
                      longitude={tenant.longitude}
                      name={tenant.name}
                    />
                  </div>
                )}
              </div>
            </div>


            {/* User Information */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-user text-blue-500"></i>
                  {t('owner_information')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('name')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('email_address')}
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t('status')}
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${user.blocked
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                      <i className={`fa-solid ${user.blocked ? 'fa-ban' : 'fa-check-circle'} mx-1`}></i>
                      {user.blocked ? t('blocked') : t('active')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('created_at')}
                  </label>
                  <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Logo, QR Code & Documents */}
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-palette text-blue-500"></i>
                  {t('company_logo')}
                </h2>
              </div>
              <div className="p-6 text-center">
                {tenant.logo ? (
                  <div className="space-y-3">
                    <img
                      src={`/storage/${tenant.logo}`}
                      alt={tenant.name}
                      className="w-32 h-32 mx-auto rounded-lg object-cover border-2 border-neutral-200 dark:border-neutral-700"
                    />
                    <div className="flex justify-center gap-2">
                      <ActionButton
                        onClick={() => openFileInNewTab(tenant.logo)}
                        variant="primary"
                        icon="fa-eye"
                        size="xs"
                        as="button"
                      >
                        {t('view')}
                      </ActionButton>
                      <ActionButton
                        onClick={() => downloadFile(tenant.logo, `${tenant.slug}-logo.${tenant.logo.split('.').pop()}`)}
                        variant="success"
                        icon="fa-download"
                        size="xs"
                        as="button"
                      >
                        {t('download')}
                      </ActionButton>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-32 h-32 mx-auto rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                      <i className="fa-solid fa-building text-neutral-400 text-4xl"></i>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-3">
                      {t('no_logo_uploaded')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Section */}
            {tenant.qr_code && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-qrcode text-blue-500"></i>
                    {t('qr_code')}
                  </h2>
                </div>
                <div className="p-6 text-center">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 inline-block">
                      <img
                        src={`/storage/${tenant.qr_code}`}
                        alt="QR Code"
                        className="w-32 h-32"
                      />
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      <p className="break-all">
                        {window.location.origin}/{tenant.slug}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      <ActionButton
                        onClick={() => openFileInNewTab(tenant.qr_code)}
                        variant="primary"
                        icon="fa-eye"
                        size="xs"
                        as="button"
                      >
                        {t('view')}
                      </ActionButton>
                      <ActionButton
                        onClick={() => downloadFile(tenant.qr_code, `${tenant.slug}-qr-code.${tenant.qr_code.split('.').pop()}`)}
                        variant="success"
                        icon="fa-download"
                        size="xs"
                        as="button"
                      >
                        {t('download')}
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-file-alt text-blue-500"></i>
                  {t('business_documents')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Commercial Registration */}
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-file-alt text-blue-500"></i>
                    {t('commercial_registration')}
                  </h4>
                  {tenant.commercial_registration ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <i className="fa-solid fa-file-alt text-blue-600 dark:text-blue-400 text-xl"></i>
                      </div>
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          onClick={() => openFileInNewTab(tenant.commercial_registration)}
                          variant="primary"
                          icon="fa-eye"
                          size="xs"
                          as="button"
                        >
                          {t('view')}
                        </ActionButton>
                        <ActionButton
                          onClick={() => downloadFile(tenant.commercial_registration, `${tenant.slug}-commercial-registration.${tenant.commercial_registration.split('.').pop()}`)}
                          variant="success"
                          icon="fa-download"
                          size="xs"
                          as="button"
                        >
                          {t('download')}
                        </ActionButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                        <i className="fa-solid fa-file-alt text-neutral-400 text-xl"></i>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">
                        {t('not_uploaded')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Profession License */}
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-file-alt text-blue-500"></i>
                    {t('profession_license')}
                  </h4>
                  {tenant.profession_license ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <i className="fa-solid fa-file-alt text-blue-600 dark:text-blue-400 text-xl"></i>
                      </div>
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          onClick={() => openFileInNewTab(tenant.profession_license)}
                          variant="primary"
                          icon="fa-eye"
                          size="xs"
                          as="button"
                        >
                          {t('view')}
                        </ActionButton>
                        <ActionButton
                          onClick={() => downloadFile(tenant.profession_license, `${tenant.slug}-profession-license.${tenant.profession_license.split('.').pop()}`)}
                          variant="success"
                          icon="fa-download"
                          size="xs"
                          as="button"
                        >
                          {t('download')}
                        </ActionButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                        <i className="fa-solid fa-file-alt text-neutral-400 text-xl"></i>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">
                        {t('not_uploaded')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

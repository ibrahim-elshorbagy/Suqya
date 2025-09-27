import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';

export default function EditModal({ isOpen, onClose, user, roles }) {
  const { t } = useTrans();
  const { data, setData, post, errors, reset, processing } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    _method: 'PUT',
  });

  useEffect(() => {
    if (user && isOpen) {
      setData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        tenant_name: user.tenant?.name || '',
        tenant_slug: user.tenant?.slug || '',
        tenant_phone: user.tenant?.phone || '',
        tenant_address: user.tenant?.address || '',
        _method: 'PUT',
      });
    } else if (!isOpen) {
      reset();
    }
  }, [user, isOpen]);


  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('admin.users.update', user.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };


  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('edit')}
      icon="fa-pen-to-square"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputLabel htmlFor="name" value={t('full_name')} required />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            onChange={(e) => setData('name', e.target.value)}
            required
            icon="fa-user"
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="email" value={t('email_address')} required />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
            required
            icon="fa-envelope"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="password" value={t('password')} />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            onChange={(e) => setData('password', e.target.value)}
            icon="fa-lock"
            placeholder={t('leave_empty_to_keep_current')}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="password_confirmation" value={t('password_confirmation')} />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            icon="fa-lock"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>
        {data.role === 'tenant' && (
          <>
            <div className="mb-4">
              <InputLabel htmlFor="tenant_name" value={t('tenant_name')} required />
              <TextInput
                id="tenant_name"
                type="text"
                name="tenant_name"
                value={data.tenant_name || ''}
                className="mt-1 block w-full"
                onChange={(e) => setData('tenant_name', e.target.value)}
                icon="fa-building"
                required
              />
              <InputError message={errors.tenant_name} className="mt-2" />
            </div>
            {/* Tenant Slug */}
            <div className="mb-4">
              <InputLabel htmlFor="tenant_slug" value={t('tenant_slug')} required />
              <TextInput
                id="tenant_slug"
                type="text"
                name="tenant_slug"
                value={data.tenant_slug || ''}
                className="mt-1 block w-full"
                onChange={(e) => setData('tenant_slug', e.target.value)}
                icon="fa-link"
                required
              />
              <InputError message={errors.tenant_slug} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="tenant_phone" value={t('tenant_phone')} />
              <TextInput
                id="tenant_phone"
                type="text"
                name="tenant_phone"
                value={data.tenant_phone || ''}
                className="mt-1 block w-full"
                onChange={(e) => setData('tenant_phone', e.target.value)}
                icon="fa-phone"
              />
              <InputError message={errors.tenant_phone} className="mt-2" />
            </div>
            <div className="mb-4">
              <InputLabel htmlFor="tenant_address" value={t('tenant_address')} />
              <TextInput
                id="tenant_address"
                type="text"
                name="tenant_address"
                value={data.tenant_address || ''}
                className="mt-1 block w-full"
                onChange={(e) => setData('tenant_address', e.target.value)}
                icon="fa-location-dot"
              />
              <InputError message={errors.tenant_address} className="mt-2" />
            </div>
          </>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <SecondaryButton
            type="button"
            onClick={onClose}
            icon="fa-xmark"
            rounded="rounded-lg"
            disabled={processing}
          >
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            icon="fa-floppy-disk"
            rounded="rounded-lg"
            withShadow={false}
            disabled={processing}
          >
            {processing ? t('saving_changes') : t('save_changes')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}

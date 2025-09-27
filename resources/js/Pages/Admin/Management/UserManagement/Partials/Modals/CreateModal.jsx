import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import AppModal from '@/Components/AppModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function CreateModal({ isOpen, onClose, roles }) {
  const { t } = useTrans();
  const { data, setData, post, errors, reset, processing } = useForm({
    name: '',
    tenant_name: '',
    tenant_slug: '',
    tenant_phone: '',
    tenant_address: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.users.store'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  // Prepare roles for dropdown
  const roleOptions = [
    { value: '', label: t('select_role_required') },
    ...roles.map(role => ({
      value: role.name,
      label: role.name === 'admin' ? t('admin') : t('tenant_role'),
    })),
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add')}
      icon="fa-user-plus"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <InputLabel htmlFor="name" value={t('full_name')} required />
          <TextInput
            id="name"
            type="text"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            onChange={(e) => setData('name', e.target.value)}
            icon="fa-user"
            required
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <InputLabel htmlFor="email" value={t('email_address')} required />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
            icon="fa-envelope"
            required
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* Password */}
        <div className="mb-4">
          <InputLabel htmlFor="password" value={t('password')} required />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            onChange={(e) => setData('password', e.target.value)}
            icon="fa-lock"
            required
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <InputLabel htmlFor="password_confirmation" value={t('password_confirmation')} required />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            icon="fa-lock"
            required
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        {/* Role */}
        <div className="mb-4">
          <InputLabel htmlFor="role" value={t('role')} required />
          <SelectInput
            name="role"
            value={data.role}
            onChange={(e) => setData('role', e.target.value)}
            options={roleOptions}
            icon="fa-user-shield"
            required
          />
          <InputError message={errors.role} className="mt-2" />
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


        {/* Buttons */}
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
            {processing ? t('saving') : t('save')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}

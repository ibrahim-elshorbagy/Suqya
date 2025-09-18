import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Register() {
  const { t } = useTrans();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    tenant_name: '',
    tenant_slug: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout title={t('register_company')}>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-building"></i> {t('register_company')}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {t('register_company_subtitle')}
        </p>
      </div>
      <div className="">
        <form onSubmit={submit} className="space-y-6">
          {/* Company Name */}
          <div>
            <InputLabel htmlFor="tenant_name" value={t('company_name')} required />
            <TextInput
              id="tenant_name"
              name="tenant_name"
              value={data.tenant_name}
              className="mt-1 block w-full"
              autoComplete="organization"
              onChange={(e) => setData('tenant_name', e.target.value)}
              required
              placeholder={t('company_name')}
              icon="fa-building"
            />
            <InputError message={errors.tenant_name} className="mt-2" />
          </div>
          {/* Company Slug */}
          <div>
            <InputLabel htmlFor="tenant_slug" value={t('company_slug')} required />
            <TextInput
              id="tenant_slug"
              name="tenant_slug"
              value={data.tenant_slug}
              className="mt-1 block w-full"
              autoComplete="off"
              onChange={(e) => setData('tenant_slug', e.target.value)}
              required
              icon="fa-link"
              placeholder={t('company_slug_placeholder')}
            />
            <span className=' italic text-sm text-gray-500'>suqya.net/water-company-slug</span>
            <InputError message={errors.tenant_slug} className="mt-2" />
          </div>
          {/* Full Name */}
          <div>
            <InputLabel htmlFor="name" value={t('auth_full_name')} required />
            <TextInput
              id="name"
              name="name"
              value={data.name}
              className="mt-1 block w-full"
              autoComplete="name"
              isFocused={true}
              onChange={(e) => setData('name', e.target.value)}
              required
              icon="fa-user"
              placeholder={t('auth_full_name')}

            />
            <InputError message={errors.name} className="mt-2" />
          </div>
          {/* Username */}
          <div>
            <InputLabel htmlFor="username" value={t('auth_username')} required />
            <TextInput
              id="username"
              name="username"
              value={data.username}
              className="mt-1 block w-full"
              autoComplete="username"
              onChange={(e) => setData('username', e.target.value)}
              required
              icon="fa-at"
              placeholder={t('auth_username')}

            />
            <InputError message={errors.username} className="mt-2" />
          </div>
          {/* Email */}
          <div>
            <InputLabel htmlFor="email" value={t('auth_email_address')} required />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="email"
              onChange={(e) => setData('email', e.target.value)}
              required
              icon="fa-envelope"
              placeholder={t('auth_email_address')}

            />
            <InputError message={errors.email} className="mt-2" />
          </div>
          {/* Password */}
          <div>
            <InputLabel htmlFor="password" value={t('auth_password')} required />
            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              autoComplete="new-password"
              onChange={(e) => setData('password', e.target.value)}
              required
              icon="fa-lock"
              placeholder={t('auth_password')}

            />
            <InputError message={errors.password} className="mt-2" />
          </div>
          {/* Confirm Password */}
          <div>
            <InputLabel htmlFor="password_confirmation" value={t('auth_confirm_password')} required />
            <TextInput
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full"
              autoComplete="new-password"
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
              icon="fa-lock"
              placeholder={t('auth_confirm_password')}

            />
            <InputError message={errors.password_confirmation} className="mt-2" />
          </div>
          <button
            type="submit"
            disabled={processing}
            className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-70"
          >
            {processing ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-building"></i>
            )}
            {t('register_company') || 'تسجيل شركة جديدة'}
          </button>
          <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            {t('auth_already_have_account')} {" "}
            <Link href={route('login')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {t('auth_login')}
            </Link>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}

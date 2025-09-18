import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdateCompanyInformation({ className = '' }) {
  const user = usePage().props.auth.user;
  const { t } = useTrans();

  // Get tenant information from user (assuming user has tenant relationship)
  const tenant = user.tenant || {};

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: tenant.name || '',
      slug: tenant.slug || '',
      phone: tenant.phone || '',
      address: tenant.address || '',
    });

  const submit = (e) => {
    e.preventDefault();

    patch(route('company.update'));
  };

  return (
    <section className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('update_company_info')}
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
            <InputLabel htmlFor="company_phone" value={t('company_phone')} />
            <TextInput
              id="company_phone"
              className="mt-1 block w-full"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              autoComplete="tel"
              icon="fa-phone"
            />
            <InputError className="mt-2" message={errors.phone} />
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
              placeholder="water-company-link"
            />
            <InputError className="mt-2" message={errors.slug} />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('slug_condition')}
            </p>
          </div>
        </div>

        <div className='space-y-2'>
          <InputLabel htmlFor="company_address" value={t('company_address')} />
          <TextInput
            id="company_address"
            className="mt-1 block w-full"
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            autoComplete="street-address"
            icon="fa-map-marker-alt"
          />
          <InputError className="mt-2" message={errors.address} />
        </div>

        <div className="pt-4 flex items-center gap-4">
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
    </section>
  );
}

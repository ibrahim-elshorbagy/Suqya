import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdateContactInfo({ tenant, className = '' }) {
  const { t } = useTrans();

  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    phone: tenant?.phone || '',
    whatsapp: tenant?.whatsapp || '',
    email: tenant?.email || '',
    address: tenant?.address || '',
  });

  const submit = (e) => {
    e.preventDefault();

    patch(route('tenant.contact-info.update'), data, {
      preserveScroll: true,
    });
  };

  return (
    <section className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('update_contact_info_description')}
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='space-y-2'>
            <InputLabel htmlFor="phone" value={t('phone_number')} />
            <TextInput
              id="phone"
              type="tel"
              className="mt-1 block w-full"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              autoComplete="tel"
              icon="fa-phone"
              placeholder="+1234567890"
            />
            <InputError className="mt-2" message={errors.phone} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="whatsapp" value={t('whatsapp_number')} />
            <TextInput
              id="whatsapp"
              type="tel"
              className="mt-1 block w-full"
              value={data.whatsapp}
              onChange={(e) => setData('whatsapp', e.target.value)}
              autoComplete="tel"
              icon="fa-whatsapp"
              placeholder="+1234567890"
            />
            <InputError className="mt-2" message={errors.whatsapp} />
          </div>
        </div>

        <div className='space-y-2'>
          <InputLabel htmlFor="email" value={t('email_address')} />
          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            autoComplete="email"
            icon="fa-envelope"
            placeholder="info@company.com"
          />
          <InputError className="mt-2" message={errors.email} />
        </div>

        <div className='space-y-2'>
          <InputLabel htmlFor="address" value={t('address')} />
          <TextArea
            id="address"
            className="mt-1 block w-full"
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            rows={3}
            icon="fa-map-marker-alt"
            placeholder={t('enter_company_address')}
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

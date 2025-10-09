import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdateBasicInfo({ tenant, currencies, className = '' }) {
  const { t } = useTrans();
  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    name: tenant?.name || '',
    slug: tenant?.slug || '',
    currency_id: tenant?.currency_id || '',
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('tenant.basic-info.update', tenant.slug), data, {
      preserveScroll: true,
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

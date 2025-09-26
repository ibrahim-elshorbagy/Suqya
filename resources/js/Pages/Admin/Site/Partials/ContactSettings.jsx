import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState, useEffect, useRef } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ContactSettings({ settings }) {
  const { t } = useTrans();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    settings: {
      support_whatsapp: settings.support_whatsapp || '',
      support_phone: settings.support_phone || '',
      support_mobile: settings.support_mobile || '',
      support_email: settings.support_email || '',
      company_address: settings.company_address || '',
      google_map_link: settings.google_map_link || '',
      business_latitude: settings.business_latitude || null,
      business_longitude: settings.business_longitude || null
    }
  });

  // Initialize OpenStreetMap with Leaflet
  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapRef.current && window.L) {
        const initialLat = data.settings.business_latitude || 31.9539;
        const initialLng = data.settings.business_longitude || 35.9106;

        const mapInstance = window.L.map(mapRef.current).setView([initialLat, initialLng], 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const markerInstance = window.L.marker([initialLat, initialLng], { draggable: true }).addTo(mapInstance);

        markerInstance.on('dragend', function (e) {
          const position = e.target.getLatLng();
          setData('settings', {
            ...data.settings,
            business_latitude: position.lat,
            business_longitude: position.lng
          });
        });

        mapInstance.on('click', function (e) {
          markerInstance.setLatLng(e.latlng);
          setData('settings', {
            ...data.settings,
            business_latitude: e.latlng.lat,
            business_longitude: e.latlng.lng
          });
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      }
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.site-settings.update'), {
      preserveScroll: true
    });
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-phone text-blue-500"></i>
          {t('contact_info')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {t('contact_info_description')}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp Number */}
            <div>
              <InputLabel value={t('support_whatsapp')} />
              <TextInput
                value={data.settings.support_whatsapp}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  support_whatsapp: e.target.value
                })}
                icon="fab fa-whatsapp"
                className="mt-1 block w-full"
                placeholder="+966XXXXXXXXX"
              />
              <p className="text-xs text-neutral-500 mt-1">
                {t('whatsapp_help')}
              </p>
              <InputError message={errors['settings.support_whatsapp']} className="mt-2" />
            </div>

            {/* Phone Number */}
            <div>
              <InputLabel value={t('support_phone')} />
              <TextInput
                value={data.settings.support_phone}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  support_phone: e.target.value
                })}
                icon="fa-phone"
                className="mt-1 block w-full"
                placeholder="+966-11-XXXXXXX"
              />
              <InputError message={errors['settings.support_phone']} className="mt-2" />
            </div>

            {/* Mobile Number */}
            <div>
              <InputLabel value={t('support_mobile')} />
              <TextInput
                value={data.settings.support_mobile}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  support_mobile: e.target.value
                })}
                icon="fa-mobile"
                className="mt-1 block w-full"
                placeholder="+966XXXXXXXXX"
              />
              <InputError message={errors['settings.support_mobile']} className="mt-2" />
            </div>

            {/* Email */}
            <div>
              <InputLabel value={t('support_email')} />
              <TextInput
                type="email"
                value={data.settings.support_email}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  support_email: e.target.value
                })}
                icon="fa-envelope"
                className="mt-1 block w-full"
                placeholder="support@example.com"
              />
              <InputError message={errors['settings.support_email']} className="mt-2" />
            </div>
          </div>

          {/* Company Address */}
          <div>
            <InputLabel value={t('company_address')} />
            <TextArea
              value={data.settings.company_address}
              onChange={(e) => setData('settings', {
                ...data.settings,
                company_address: e.target.value
              })}
              icon="fa-map-marker-alt"
              className="mt-1 block w-full"
              rows="3"
              placeholder={t('address_placeholder')}
            />
            <InputError message={errors['settings.company_address']} className="mt-2" />
          </div>

          {/* Interactive Location Map */}
          <div className="space-y-2">
            <InputLabel value={t('business_location')} />
            <div
              ref={mapRef}
              className="w-full h-96 border border-neutral-300 dark:border-neutral-700 rounded-lg"
            ></div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('click_drag_map_description')}
            </p>
          </div>

          {/* Hidden Coordinates */}
          <div className="hidden">
            <div>
              <InputLabel value={t('latitude')} />
              <TextInput
                type="number"
                step="any"
                value={data.settings.business_latitude || ''}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  business_latitude: e.target.value
                })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <InputLabel value={t('longitude')} />
              <TextInput
                type="number"
                step="any"
                value={data.settings.business_longitude || ''}
                onChange={(e) => setData('settings', {
                  ...data.settings,
                  business_longitude: e.target.value
                })}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
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
      </div>
    </div>
  );
}

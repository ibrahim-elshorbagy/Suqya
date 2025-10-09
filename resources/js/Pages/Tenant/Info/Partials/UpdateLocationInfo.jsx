import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useEffect, useRef, useState } from 'react';

export default function UpdateLocationInfo({ tenant, className = '' }) {
  const { t } = useTrans();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    country: tenant?.country || '',
    city: tenant?.city || '',
    area: tenant?.area || '',
    full_address: tenant?.full_address || '',
    latitude: tenant?.latitude || null,
    longitude: tenant?.longitude || null,
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
        const initialLat = data.latitude || 31.9539;  // Default to Jordan (Amman)
        const initialLng = data.longitude || 35.9106;

        const mapInstance = window.L.map(mapRef.current).setView([initialLat, initialLng], 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const markerInstance = window.L.marker([initialLat, initialLng], { draggable: true }).addTo(mapInstance);

        markerInstance.on('dragend', function (e) {
          const position = e.target.getLatLng();
          setData('latitude', position.lat);
          setData('longitude', position.lng);
        });

        mapInstance.on('click', function (e) {
          markerInstance.setLatLng(e.latlng);
          setData('latitude', e.latlng.lat);
          setData('longitude', e.latlng.lng);
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

    patch(route('tenant.location-info.update', tenant.slug), data, {
      preserveScroll: true,
    });
  };

  return (
    <section className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('update_location_info_description')}
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className='space-y-2'>
            <InputLabel htmlFor="country" value={t('country')} />
            <TextInput
              id="country"
              className="mt-1 block w-full"
              value={data.country}
              onChange={(e) => setData('country', e.target.value)}
              icon="fa-flag"
              placeholder={t('enter_country')}
            />
            <InputError className="mt-2" message={errors.country} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="city" value={t('city')} />
            <TextInput
              id="city"
              className="mt-1 block w-full"
              value={data.city}
              onChange={(e) => setData('city', e.target.value)}
              icon="fa-city"
              placeholder={t('enter_city')}
            />
            <InputError className="mt-2" message={errors.city} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="area" value={t('area')} />
            <TextInput
              id="area"
              className="mt-1 block w-full"
              value={data.area}
              onChange={(e) => setData('area', e.target.value)}
              icon="fa-map-pin"
              placeholder={t('enter_area')}
            />
            <InputError className="mt-2" message={errors.area} />
          </div>
        </div>

        <div className='space-y-2'>
          <InputLabel htmlFor="full_address" value={t('full_address')} />
          <TextArea
            id="full_address"
            className="mt-1 block w-full"
            value={data.full_address}
            onChange={(e) => setData('full_address', e.target.value)}
            rows={3}
            icon="fa-map-marker-alt"
            placeholder={t('enter_full_address')}
          />
          <InputError className="mt-2" message={errors.full_address} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 hidden">
          <div className='space-y-2'>
            <InputLabel htmlFor="latitude" value={t('latitude')} />
            <TextInput
              id="latitude"
              type="number"
              step="any"
              className="mt-1 block w-full"
              value={data.latitude || ''}
              onChange={(e) => setData('latitude', e.target.value)}
              icon="fa-map-marker-alt"
              placeholder="31.9539"
            />
            <InputError className="mt-2" message={errors.latitude} />
          </div>

          <div className='space-y-2'>
            <InputLabel htmlFor="longitude" value={t('longitude')} />
            <TextInput
              id="longitude"
              type="number"
              step="any"
              className="mt-1 block w-full"
              value={data.longitude || ''}
              onChange={(e) => setData('longitude', e.target.value)}
              icon="fa-map-marker-alt"
              placeholder="35.9106"
            />
            <InputError className="mt-2" message={errors.longitude} />
          </div>
        </div>

        <div className="space-y-2">
          <InputLabel value={t('location_picker')} />
          <div
            ref={mapRef}
            className="w-full h-128 border border-neutral-300 dark:border-neutral-700 rounded-lg"
            style={{ height: '600px' }}
          ></div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('click_drag_map_description')}
          </p>
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

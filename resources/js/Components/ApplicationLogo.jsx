import { usePage } from '@inertiajs/react';

import { useState } from 'react';

export default function ApplicationLogo(props) {
  const { site_settings } = usePage().props;
  const siteName = site_settings?.site_name || 'سُقيا';
  const siteLogo = site_settings?.site_logo;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="text-center text-xl dark:text-white font-bold flex items-center justify-center" {...props}>
      {siteLogo && !imageError ? (
        <img
          className="w-auto object-contain"
          src={`/storage/${siteLogo}`}
          alt={siteName}
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{siteName}</span>
      )}
    </div>
  );
}

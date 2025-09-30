import { useTrans } from '@/Hooks/useTrans';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import RouteOptimizer from './Components/RouteOptimizer';

export default function TestMap({ auth }) {
  const { t } = useTrans();

  return (
    <AppLayout user={auth.user}>
      <Head title={t('view_map')} />

      <div className="py-6">
        <RouteOptimizer t={t} />
      </div>
    </AppLayout>
  );
}

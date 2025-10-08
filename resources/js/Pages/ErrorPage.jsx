import React from 'react';
import ErrorLayout from '@/Layouts/ErrorLayout/ErrorLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function ErrorPage({ status, site_settings }) {
  const { t } = useTrans();
  const { locale } = usePage().props;

  // SEO-optimized titles in Arabic and English
  const title = {
    503: t('server_error'),
    500: t('server_error'),
    404: t('not_found_404'),
    403: t('forbidden'),
    401: t('unauthorized'),
    429: t('too_many_requests'),
    419: t('page_expired'),
  }[status] || t('error');

  const description = {
    503: t('server_error_message'),
    500: t('server_error_message'),
    404: t('page_not_found'),
    403: t('access_denied'),
    401: t('unauthorized_message'),
    429: t('too_many_requests_message'),
    419: t('page_expired_message'),
  }[status] || t('error_occurred');

  return (
    <ErrorLayout status={status}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-6 min-w-[300px] lg:min-w-[400px]">
          <div className="mb-4 flex justify-center">
            <i className="fa-solid fa-triangle-exclamation text-6xl text-red-500"></i>
          </div>

          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {title}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={route('home')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-500"
            >
              <i className="fa-solid fa-home"></i>
              {t('return_home')}
            </Link>
          </div>
        </div>
      </div>
    </ErrorLayout>
  );
}

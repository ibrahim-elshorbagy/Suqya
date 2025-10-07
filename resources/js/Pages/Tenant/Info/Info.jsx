import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { usePage } from '@inertiajs/react';

import UpdateBasicInfo from './Partials/UpdateBasicInfo';
import UpdateContactInfo from './Partials/UpdateContactInfo';
import UpdateLocationInfo from './Partials/UpdateLocationInfo';
import UpdateBrandingInfo from './Partials/UpdateBrandingInfo';
import UpdateDocumentsForm from './Partials/UpdateDocumentsForm';
import QrCodeSection from './Partials/QrCodeSection';

export default function Info() {
    const { t } = useTrans();
    const { tenant, currencies } = usePage().props;
    const [activeSection, setActiveSection] = useState('basic-info');

    // Check if URL has a hash and set the active section on load
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setActiveSection(hash);
        }

        // Listen for hash changes
        const handleHashChange = () => {
            const newHash = window.location.hash.substring(1);
            if (newHash) {
                setActiveSection(newHash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Handle menu item click
    const handleMenuClick = (section) => {
        setActiveSection(section);
        window.location.hash = section;
    };

    return (
        <AppLayout>
            <Head title={t('tenant_info_settings')} />

            <div className='m-3 xl:m-5'>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {t('tenant_info_settings')}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {t('manage_tenant_info')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left sidebar with navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden sticky top-4">
                            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {t('info_menu')}
                                </h2>
                            </div>
                            <div className="p-2 space-y-2">
                                <button
                                    onClick={() => handleMenuClick('basic-info')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'basic-info' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-building ${activeSection === 'basic-info' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('basic_information')}</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('contact-info')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'contact-info' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-phone ${activeSection === 'contact-info' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('contact_information')}</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('location-info')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'location-info' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-map-marker-alt ${activeSection === 'location-info' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('location_information')}</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('documents')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'documents' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-file-alt ${activeSection === 'documents' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('documents')}</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('branding')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'branding' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-palette ${activeSection === 'branding' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('branding')}</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('qr-code')}
                                    className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'qr-code' ? 'bg-blue-500/10 text-black dark:text-white font-medium' : ''}`}
                                >
                                    <i className={`fa-solid fa-qrcode ${activeSection === 'qr-code' ? 'text-blue-500' : ''}`}></i>
                                    <span>{t('qr_code')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="lg:col-span-2 min-h-[60vh]">
                        {/* Basic Information Section */}
                        {activeSection === 'basic-info' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-building text-blue-500"></i>
                                        {t('basic_information')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateBasicInfo tenant={tenant} currencies={currencies} />
                                </div>
                            </div>
                        )}

                        {/* Contact Information Section */}
                        {activeSection === 'contact-info' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-phone text-blue-500"></i>
                                        {t('contact_information')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateContactInfo tenant={tenant} />
                                </div>
                            </div>
                        )}

                        {/* Location Information Section */}
                        {activeSection === 'location-info' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-map-marker-alt text-blue-500"></i>
                                        {t('location_information')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateLocationInfo tenant={tenant} />
                                </div>
                            </div>
                        )}

                        {/* Documents Section */}
                        {activeSection === 'documents' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-file-alt text-blue-500"></i>
                                        {t('documents')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateDocumentsForm tenant={tenant} />
                                </div>
                            </div>
                        )}

                        {/* Branding Section */}
                        {activeSection === 'branding' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-palette text-blue-500"></i>
                                        {t('branding')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateBrandingInfo tenant={tenant} />
                                </div>
                            </div>
                        )}

                        {/* QR Code Section */}
                        {activeSection === 'qr-code' && (
                            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                        <i className="fa-solid fa-qrcode text-blue-500"></i>
                                        {t('qr_code')}
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <QrCodeSection tenant={tenant} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

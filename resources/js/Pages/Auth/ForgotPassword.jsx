import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function ForgotPassword({ status }) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout title={t('auth_forgot_password_title')}>
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-envelope"></i> {t('auth_forgot_password_title')}
                </h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {t('auth_enter_email_reset')}
                </p>
            </div>
            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
                <div className="p-6">
                    {status && (
                        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <div className="flex items-center">
                                <i className="fa-solid fa-check-circle mr-2"></i>
                                <span>{status}</span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value={t('auth_email_address')} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                icon="fa-envelope"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all disabled:opacity-70"
                        >
                            {processing ? (
                                <i className="fa-solid fa-circle-notch animate-spin"></i>
                            ) : (
                                <i className="fa-solid fa-paper-plane"></i>
                            )}
                            {t('auth_send_reset_link')}
                        </button>
                        <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                            {t('auth_remember_password')} {" "}
                            <Link href={route('login')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                {t('auth_back_to_login')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

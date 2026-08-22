import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const { flash } = usePage().props
    useEffect(() => {
        if (flash.success) {
        setIsAlertVisible(true);
        const timeoutId = setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        return () => {
            clearTimeout(timeoutId);
        };
        }
    }, [flash.success]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title={t('auth.login.title')} />

            <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            {flash.success && isAlertVisible &&
            <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert">
                <div className="flex">
                    <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                    <div>
                    <p className="font-bold">{t('auth.login.success')}</p>
                    <p className="text-sm">{flash.success}</p>
                    </div>
                </div>
            </div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value={t('auth.fields.email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={t('auth.fields.password')} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="mx-2 text-sm text-gray-600">{t('auth.login.remember')}</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4 gap-x-4">
                    {/* {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                        >
                            Forgot your password?
                        </Link>
                    )} */}

                    <Link
                        href={route('register')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                    >
                        {t('auth.login.register_prompt')}
                    </Link>

                    <PrimaryButton disabled={processing}>
                        {t('auth.login.submit')}
                    </PrimaryButton>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}

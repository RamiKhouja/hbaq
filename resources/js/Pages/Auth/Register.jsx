import { useMemo, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t, i18n } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [accountType, setAccountType] = useState('user');
    const [errors, setErrors] = useState([]);
    const [serverErrors, setServerErrors] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [existingCompany, setExistingCompany] = useState(null);
    const [mfChecked, setMfChecked] = useState(false);

    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        country: 'Tunisia',
        state: 'Tunis',
        city: '',
        zip: '',
        address_1: '',
        address_2: '',
    });

    const [companyInfo, setCompanyInfo] = useState({
        mf: '',
        name: '',
        phone: '',
        email: '',
        mf_image: null,
        country: 'Tunisia',
        state: 'Tunis',
        city: '',
        zip: '',
        address_1: '',
        address_2: '',
    });

    const steps = useMemo(() => {
        if (accountType === 'company') {
            return existingCompany
                ? [{ id: 1, name: t('auth.register.steps.personal') }, { id: 2, name: t('auth.register.steps.company') }]
                : [{ id: 1, name: t('auth.register.steps.personal') }, { id: 2, name: t('auth.register.steps.company') }, { id: 3, name: t('auth.register.steps.company_address') }];
        }

        return [{ id: 1, name: t('auth.register.steps.personal') }, { id: 2, name: t('auth.register.steps.address') }];
    }, [accountType, existingCompany, t]);

    const currentStepMeta = steps.find((step) => step.id === currentStep) || steps[0];

    const addError = (name, message) => {
        setErrors((previous) => [...previous, { name, message }]);
        setAlertVisible(true);
    };

    const resetErrors = () => {
        setErrors([]);
        setServerErrors({});
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCompanyChange = (e) => {
        const { name, value, files } = e.target;
        setCompanyInfo((previous) => ({
            ...previous,
            [name]: files ? files[0] : value,
        }));

        if (name === 'mf') {
            setExistingCompany(null);
            setMfChecked(false);
        }
    };

    const handleAccountTypeChange = (type) => {
        setAccountType(type);
        setCurrentStep(1);
        setExistingCompany(null);
        setMfChecked(false);
    };

    const companyDisplayName = (company) => {
        if (!company?.name) {
            return '';
        }

        if (typeof company.name === 'string') {
            try {
                const parsed = JSON.parse(company.name);
                return parsed[i18n.language] || parsed.en || parsed.fr || parsed.ar || company.name;
            } catch {
                return company.name;
            }
        }

        return company.name[i18n.language] || company.name.en || company.name.fr || company.name.ar || '';
    };

    const checkUserInfo = () => {
        resetErrors();

        const invalidName = !userInfo.firstname.trim();
        const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
        const invalidPass = userInfo.password.length < 8;
        const invalidConfirm = userInfo.password !== userInfo.password_confirmation;
        const invalidPhone = !userInfo.phone.trim();

        if (invalidName) addError('firstname', t('auth.validation.first_name_required'));
        if (invalidEmail) addError('email', t('auth.validation.valid_email_required'));
        if (invalidPass) addError('password', t('auth.validation.password_length'));
        if (invalidConfirm) addError('password_confirmation', t('auth.validation.passwords_mismatch'));
        if (invalidPhone) addError('phone', t('auth.validation.phone_required'));

        return !(invalidName || invalidEmail || invalidPass || invalidConfirm || invalidPhone);
    };

    const checkAddress = (address, prefix = '') => {
        resetErrors();

        const required = [
            ['state', t('auth.validation.state_required')],
            ['city', t('auth.validation.city_required')],
            ['zip', t('auth.validation.zip_required')],
            ['address_1', t('auth.validation.address_required')],
        ];

        const invalid = required.filter(([field]) => !String(address[field] || '').trim());
        invalid.forEach(([field, message]) => addError(`${prefix}${field}`, message));

        return invalid.length === 0;
    };

    const checkCompanyInfo = () => {
        resetErrors();

        if (!companyInfo.mf.trim()) {
            addError('company_mf', t('auth.validation.mf_required'));
            return false;
        }

        if (existingCompany) {
            return true;
        }

        const missing = [];
        if (!companyInfo.name.trim()) missing.push(['company_name', t('auth.validation.company_name_required')]);
        if (!companyInfo.phone.trim()) missing.push(['company_phone', t('auth.validation.company_phone_required')]);
        if (companyInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
            missing.push(['company_email', t('auth.validation.valid_company_email')]);
        }

        missing.forEach(([name, message]) => addError(name, message));
        return missing.length === 0;
    };

    const checkMf = async () => {
        resetErrors();

        if (!companyInfo.mf.trim()) {
            addError('company_mf', t('auth.validation.mf_required'));
            return;
        }

        try {
            const response = await axios.get('/register/company-mf', {
                params: { mf: companyInfo.mf },
            });

            setExistingCompany(response.data.company);
            setMfChecked(true);
        } catch {
            addError('company_mf', t('auth.validation.mf_check_failed'));
        }
    };

    const goNext = async () => {
        if (currentStep === 1) {
            if (checkUserInfo()) {
                setCurrentStep(2);
            }
            return;
        }

        if (accountType === 'company' && currentStep === 2) {
            if (!mfChecked) {
                await checkMf();
                return;
            }

            if (checkCompanyInfo() && !existingCompany) {
                setCurrentStep(3);
            }
            return;
        }

        if (accountType === 'user' && currentStep === 2 && checkAddress(userInfo)) {
            submit();
            return;
        }

        if (accountType === 'company' && currentStep === 3 && checkAddress(companyInfo, 'company_')) {
            submit();
        }
    };

    const goBack = () => {
        setCurrentStep((previous) => Math.max(1, previous - 1));
    };

    const buildFormData = () => {
        const formData = new FormData();

        formData.append('account_type', accountType);
        formData.append('firstname', userInfo.firstname);
        formData.append('lastname', userInfo.lastname);
        formData.append('email', userInfo.email);
        formData.append('password', userInfo.password);
        formData.append('password_confirmation', userInfo.password_confirmation);
        formData.append('phone', userInfo.phone);

        if (accountType === 'company') {
            formData.append('company_mf', companyInfo.mf);

            if (existingCompany) {
                formData.append('company_id', existingCompany.id);
            } else {
                formData.append('company_name', companyInfo.name);
                formData.append('company_phone', companyInfo.phone);
                formData.append('company_email', companyInfo.email);
                formData.append('company_country', companyInfo.country);
                formData.append('company_state', companyInfo.state);
                formData.append('company_city', companyInfo.city);
                formData.append('company_zip', companyInfo.zip);
                formData.append('company_address_1', companyInfo.address_1);
                formData.append('company_address_2', companyInfo.address_2);

                if (companyInfo.mf_image) {
                    formData.append('mf_image', companyInfo.mf_image);
                }
            }
        } else {
            formData.append('country', userInfo.country);
            formData.append('state', userInfo.state);
            formData.append('city', userInfo.city);
            formData.append('zip', userInfo.zip);
            formData.append('address_1', userInfo.address_1);
            formData.append('address_2', userInfo.address_2);
            formData.append('address_type', 'shipping');
        }

        return formData;
    };

    const submit = () => {
        router.post('/register', buildFormData(), {
            forceFormData: true,
            onError: (validationErrors) => {
                setServerErrors(validationErrors);
                setErrors(Object.entries(validationErrors).map(([name, message]) => ({ name, message })));
                setAlertVisible(true);
            },
        });
    };

    const renderProgress = () => (
        <nav aria-label={t('auth.register.progress')} className="w-full">
            <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 bg-white md:flex md:divide-y-0">
                {steps.map((step, stepIdx) => {
                    const complete = step.id < currentStep;
                    const current = step.id === currentStep;

                    return (
                        <li key={step.name} className="relative md:flex md:flex-1">
                            <div className="flex w-full items-center px-5 py-4 text-sm font-medium">
                                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${complete ? 'bg-primary' : current ? 'border-2 border-primary' : 'border-2 border-gray-300'}`}>
                                    {complete ? (
                                        <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    ) : (
                                        <span className={current ? 'text-primary' : 'text-gray-500'}>{step.id}</span>
                                    )}
                                </span>
                                <span className={`${i18n.language === 'ar' ? 'mr-4' : 'ml-4'} text-sm font-medium ${current || complete ? 'text-primary' : 'text-gray-500'}`}>{step.name}</span>
                            </div>

                            {stepIdx !== steps.length - 1 && (
                                <div className={`absolute top-0 hidden h-full w-5 md:block ${i18n.language === 'ar' ? 'left-0' : 'right-0'}`} aria-hidden="true">
                                    <svg className={`h-full w-full text-gray-300 ${i18n.language === 'ar' ? '-scale-x-100' : ''}`} viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                        <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );

    const renderAddressFields = (data, onChange, prefix = '') => (
        <>
            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor={`${prefix}state`} value={t('auth.fields.state')} />
                    <select
                        id={`${prefix}state`}
                        name="state"
                        value={data.state}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                    >
                        <option value="Tunis">Tunis</option>
                        <option value="Ariana">Ariana</option>
                    </select>
                    <InputError message={serverErrors[`${prefix}state`]} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor={`${prefix}city`} value={t('auth.fields.city')} />
                    <TextInput id={`${prefix}city`} name="city" value={data.city} className="mt-1 block w-full" onChange={onChange} />
                    <InputError message={serverErrors[`${prefix}city`]} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor={`${prefix}zip`} value={t('auth.fields.zip')} />
                    <TextInput id={`${prefix}zip`} name="zip" value={data.zip} className="mt-1 block w-full" onChange={onChange} />
                    <InputError message={serverErrors[`${prefix}zip`]} className="mt-2" />
                </div>
            </div>
            <div className="mt-4">
                <InputLabel htmlFor={`${prefix}address_1`} value={t('auth.fields.address')} />
                <TextInput id={`${prefix}address_1`} name="address_1" value={data.address_1} className="mt-1 block w-full" onChange={onChange} />
                <InputError message={serverErrors[`${prefix}address_1`]} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor={`${prefix}address_2`} value={t('auth.fields.address_extra')} />
                <TextInput id={`${prefix}address_2`} name="address_2" value={data.address_2} className="mt-1 block w-full" onChange={onChange} />
                <InputError message={serverErrors[`${prefix}address_2`]} className="mt-2" />
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <Head title={t('auth.register.title')} />
            <div>
                <Link href="/">
                    <img className="w-44" src="/pictures/hbaq-logo.png" alt="Hbaq" />
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                </Link>
            </div>
            <div className="bg-gray-100 px-4 py-8">
                <div className="mx-auto w-full max-w-3xl">
                    {errors.length > 0 && alertVisible && (
                        <div className="mb-6 rounded-lg bg-red-50 px-4 pt-4 text-red-800 shadow-sm" role="alert">
                            <div className="flex items-start justify-between">
                                <div>
                                    {errors.map((error) => (
                                        <div key={error.name} className="mb-4 flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-red-700" />
                                            <p className="text-sm">{error.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => setAlertVisible(false)}>
                                    <XMarkIcon className="h-5 w-5 text-red-800" />
                                </button>
                            </div>
                        </div>
                    )}

                    {renderProgress()}

                    <form onSubmit={(e) => e.preventDefault()} className="mt-6 rounded-lg bg-white px-6 py-5 shadow-md">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <h1 className="text-lg font-medium text-gray-900">{currentStepMeta.name}</h1>
                            <Link href={route('login')} className="text-sm text-gray-600 underline hover:text-gray-900">
                                {t('auth.register.login_prompt')}
                            </Link>
                        </div>

                        {currentStep === 1 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="firstname" value={t('auth.fields.first_name')} />
                                        <TextInput id="firstname" name="firstname" value={userInfo.firstname} className="mt-1 block w-full" onChange={handleUserChange} required />
                                        <InputError message={serverErrors.firstname} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="lastname" value={t('auth.fields.last_name')} />
                                        <TextInput id="lastname" name="lastname" value={userInfo.lastname} className="mt-1 block w-full" onChange={handleUserChange} />
                                        <InputError message={serverErrors.lastname} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value={t('auth.fields.email')} />
                                    <TextInput id="email" type="email" name="email" value={userInfo.email} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    <InputError message={serverErrors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="phone" value={t('auth.fields.phone')} />
                                    <TextInput id="phone" type="tel" name="phone" value={userInfo.phone} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    <InputError message={serverErrors.phone} className="mt-2" />
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="password" value={t('auth.fields.password')} />
                                        <TextInput id="password" type="password" name="password" value={userInfo.password} className="mt-1 block w-full" onChange={handleUserChange} required />
                                        <InputError message={serverErrors.password} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value={t('auth.fields.confirm_password')} />
                                        <TextInput id="password_confirmation" type="password" name="password_confirmation" value={userInfo.password_confirmation} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    </div>
                                </div>

                                <fieldset className="mt-6">
                                    <legend className="text-sm font-medium text-gray-900">{t('auth.register.register_as')}</legend>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <label className="flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-3">
                                            <input type="radio" name="account_type" value="user" checked={accountType === 'user'} onChange={() => handleAccountTypeChange('user')} className="text-primary focus:ring-primary" />
                                            <span className="mx-3 text-sm text-gray-700">{t('auth.register.simple_user')}</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-3">
                                            <input type="radio" name="account_type" value="company" checked={accountType === 'company'} onChange={() => handleAccountTypeChange('company')} className="text-primary focus:ring-primary" />
                                            <span className="mx-3 text-sm text-gray-700">{t('auth.register.company_member')}</span>
                                        </label>
                                    </div>
                                </fieldset>
                            </>
                        )}

                        {accountType === 'company' && currentStep === 2 && (
                            <>
                                <div>
                                    <div>
                                        <InputLabel htmlFor="mf" value={t('auth.fields.mf')} />
                                        <TextInput id="mf" name="mf" value={companyInfo.mf} className="mt-1 block w-full" onChange={handleCompanyChange} onBlur={checkMf} />
                                        <InputError message={serverErrors.company_mf} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="company_name" value={t('auth.fields.company_name')} />
                                        <TextInput id="company_name" name="name" value={existingCompany ? companyDisplayName(existingCompany) : companyInfo.name} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                        <InputError message={serverErrors.company_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="company_phone" value={t('auth.fields.company_phone')} />
                                        <TextInput id="company_phone" name="phone" value={existingCompany?.phone || companyInfo.phone} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                        <InputError message={serverErrors.company_phone} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="company_email" value={t('auth.fields.company_email')} />
                                    <TextInput id="company_email" type="email" name="email" value={existingCompany?.email || companyInfo.email} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                    <InputError message={serverErrors.company_email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="mf_image" value={t('auth.fields.mf_document')} />
                                    <input id="mf_image" name="mf_image" type="file" disabled={!!existingCompany} accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx" onChange={handleCompanyChange} className="mt-1 block w-full text-sm text-gray-700 disabled:opacity-50" />
                                    <InputError message={serverErrors.mf_image} className="mt-2" />
                                </div>

                                {existingCompany && (
                                    <div className="mt-6 rounded-md bg-brown-50 p-4 text-sm text-brown-900">
                                        {t('auth.register.company_exists', { company: companyDisplayName(existingCompany) })}
                                    </div>
                                )}
                            </>
                        )}

                        {accountType === 'user' && currentStep === 2 && renderAddressFields(userInfo, handleUserChange)}

                        {accountType === 'company' && currentStep === 3 && renderAddressFields(companyInfo, handleCompanyChange, 'company_')}

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <button type="button" onClick={goBack} disabled={currentStep === 1} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40">
                                {t('auth.register.back')}
                            </button>
                            <div className="flex items-center gap-3">
                                {existingCompany && currentStep === 2 && (
                                    <PrimaryButton type="button" onClick={submit}>
                                        {t('auth.register.confirm_membership')}
                                    </PrimaryButton>
                                )}
                                {!(existingCompany && currentStep === 2) && (
                                    <PrimaryButton type="button" onClick={goNext}>
                                        {currentStep === steps.length ? t('auth.register.submit') : t('auth.register.next')}
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

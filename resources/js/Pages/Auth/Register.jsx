import { useMemo, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router } from '@inertiajs/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const [accountType, setAccountType] = useState('user');
    const [errors, setErrors] = useState([]);
    const [serverErrors, setServerErrors] = useState({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [checkingMf, setCheckingMf] = useState(false);
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
                ? [{ id: 1, name: 'Personal Info' }, { id: 2, name: 'Company Info' }]
                : [{ id: 1, name: 'Personal Info' }, { id: 2, name: 'Company Info' }, { id: 3, name: 'Company Address' }];
        }

        return [{ id: 1, name: 'Personal Info' }, { id: 2, name: 'Address' }];
    }, [accountType, existingCompany]);

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
                return parsed.en || parsed.ar || company.name;
            } catch {
                return company.name;
            }
        }

        return company.name.en || company.name.ar || '';
    };

    const checkUserInfo = () => {
        resetErrors();

        const invalidName = !userInfo.firstname.trim();
        const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
        const invalidPass = userInfo.password.length < 8;
        const invalidConfirm = userInfo.password !== userInfo.password_confirmation;
        const invalidPhone = !userInfo.phone.trim();

        if (invalidName) addError('firstname', 'First name is required');
        if (invalidEmail) addError('email', 'Valid email is required');
        if (invalidPass) addError('password', 'Password must be at least 8 characters');
        if (invalidConfirm) addError('password_confirmation', 'Passwords do not match');
        if (invalidPhone) addError('phone', 'Phone is required');

        return !(invalidName || invalidEmail || invalidPass || invalidConfirm || invalidPhone);
    };

    const checkAddress = (address, prefix = '') => {
        resetErrors();

        const required = [
            ['state', 'State is required'],
            ['city', 'City is required'],
            ['zip', 'Zip code is required'],
            ['address_1', 'Address is required'],
        ];

        const invalid = required.filter(([field]) => !String(address[field] || '').trim());
        invalid.forEach(([field, message]) => addError(`${prefix}${field}`, message));

        return invalid.length === 0;
    };

    const checkCompanyInfo = () => {
        resetErrors();

        if (!companyInfo.mf.trim()) {
            addError('company_mf', 'MF is required');
            return false;
        }

        if (existingCompany) {
            return true;
        }

        const missing = [];
        if (!companyInfo.name.trim()) missing.push(['company_name', 'Company name is required']);
        if (!companyInfo.phone.trim()) missing.push(['company_phone', 'Company phone is required']);
        if (companyInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
            missing.push(['company_email', 'Valid company email is required']);
        }

        missing.forEach(([name, message]) => addError(name, message));
        return missing.length === 0;
    };

    const checkMf = async () => {
        resetErrors();

        if (!companyInfo.mf.trim()) {
            addError('company_mf', 'MF is required');
            return;
        }

        setCheckingMf(true);

        try {
            const response = await axios.get('/register/company-mf', {
                params: { mf: companyInfo.mf },
            });

            setExistingCompany(response.data.company);
            setMfChecked(true);
        } catch {
            addError('company_mf', 'Could not check the MF right now');
        } finally {
            setCheckingMf(false);
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
        <nav aria-label="Progress" className="w-full">
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
                                <span className={`ml-4 text-sm font-medium ${current || complete ? 'text-primary' : 'text-gray-500'}`}>{step.name}</span>
                            </div>

                            {stepIdx !== steps.length - 1 && (
                                <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                                    <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
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
                    <InputLabel htmlFor={`${prefix}state`} value="State" />
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
                    <InputLabel htmlFor={`${prefix}city`} value="City" />
                    <TextInput id={`${prefix}city`} name="city" value={data.city} className="mt-1 block w-full" onChange={onChange} />
                    <InputError message={serverErrors[`${prefix}city`]} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor={`${prefix}zip`} value="Zip Code" />
                    <TextInput id={`${prefix}zip`} name="zip" value={data.zip} className="mt-1 block w-full" onChange={onChange} />
                    <InputError message={serverErrors[`${prefix}zip`]} className="mt-2" />
                </div>
            </div>
            <div className="mt-4">
                <InputLabel htmlFor={`${prefix}address_1`} value="Address" />
                <TextInput id={`${prefix}address_1`} name="address_1" value={data.address_1} className="mt-1 block w-full" onChange={onChange} />
                <InputError message={serverErrors[`${prefix}address_1`]} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor={`${prefix}address_2`} value="Apartment, Building..." />
                <TextInput id={`${prefix}address_2`} name="address_2" value={data.address_2} className="mt-1 block w-full" onChange={onChange} />
                <InputError message={serverErrors[`${prefix}address_2`]} className="mt-2" />
            </div>
        </>
    );

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen bg-gray-100 px-4 py-8">
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
                                Already have an account?
                            </Link>
                        </div>

                        {currentStep === 1 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="firstname" value="Firstname" />
                                        <TextInput id="firstname" name="firstname" value={userInfo.firstname} className="mt-1 block w-full" onChange={handleUserChange} required />
                                        <InputError message={serverErrors.firstname} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="lastname" value="Lastname" />
                                        <TextInput id="lastname" name="lastname" value={userInfo.lastname} className="mt-1 block w-full" onChange={handleUserChange} />
                                        <InputError message={serverErrors.lastname} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput id="email" type="email" name="email" value={userInfo.email} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    <InputError message={serverErrors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="phone" value="Phone number" />
                                    <TextInput id="phone" type="tel" name="phone" value={userInfo.phone} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    <InputError message={serverErrors.phone} className="mt-2" />
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" />
                                        <TextInput id="password" type="password" name="password" value={userInfo.password} className="mt-1 block w-full" onChange={handleUserChange} required />
                                        <InputError message={serverErrors.password} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <TextInput id="password_confirmation" type="password" name="password_confirmation" value={userInfo.password_confirmation} className="mt-1 block w-full" onChange={handleUserChange} required />
                                    </div>
                                </div>

                                <fieldset className="mt-6">
                                    <legend className="text-sm font-medium text-gray-900">Register as</legend>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <label className="flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-3">
                                            <input type="radio" name="account_type" value="user" checked={accountType === 'user'} onChange={() => handleAccountTypeChange('user')} className="text-primary focus:ring-primary" />
                                            <span className="ml-3 text-sm text-gray-700">Simple user</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-3">
                                            <input type="radio" name="account_type" value="company" checked={accountType === 'company'} onChange={() => handleAccountTypeChange('company')} className="text-primary focus:ring-primary" />
                                            <span className="ml-3 text-sm text-gray-700">Company member</span>
                                        </label>
                                    </div>
                                </fieldset>
                            </>
                        )}

                        {accountType === 'company' && currentStep === 2 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                                    <div>
                                        <InputLabel htmlFor="mf" value="MF" />
                                        <TextInput id="mf" name="mf" value={companyInfo.mf} className="mt-1 block w-full" onChange={handleCompanyChange} onBlur={checkMf} />
                                        <InputError message={serverErrors.company_mf} className="mt-2" />
                                    </div>
                                    <button type="button" onClick={checkMf} disabled={checkingMf} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">
                                        {checkingMf ? 'Checking...' : 'Check MF'}
                                    </button>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="company_name" value="Company name" />
                                        <TextInput id="company_name" name="name" value={existingCompany ? companyDisplayName(existingCompany) : companyInfo.name} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                        <InputError message={serverErrors.company_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="company_phone" value="Company phone" />
                                        <TextInput id="company_phone" name="phone" value={existingCompany?.phone || companyInfo.phone} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                        <InputError message={serverErrors.company_phone} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="company_email" value="Company email" />
                                    <TextInput id="company_email" type="email" name="email" value={existingCompany?.email || companyInfo.email} disabled={!!existingCompany} className="mt-1 block w-full disabled:bg-gray-100" onChange={handleCompanyChange} />
                                    <InputError message={serverErrors.company_email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="mf_image" value="MF document" />
                                    <input id="mf_image" name="mf_image" type="file" disabled={!!existingCompany} accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx" onChange={handleCompanyChange} className="mt-1 block w-full text-sm text-gray-700 disabled:opacity-50" />
                                    <InputError message={serverErrors.mf_image} className="mt-2" />
                                </div>

                                {existingCompany && (
                                    <div className="mt-6 rounded-md bg-brown-50 p-4 text-sm text-brown-900">
                                        The company {companyDisplayName(existingCompany)} already exists, are you a member?
                                    </div>
                                )}
                            </>
                        )}

                        {accountType === 'user' && currentStep === 2 && renderAddressFields(userInfo, handleUserChange)}

                        {accountType === 'company' && currentStep === 3 && renderAddressFields(companyInfo, handleCompanyChange, 'company_')}

                        <div className="mt-8 flex items-center justify-between gap-4">
                            <button type="button" onClick={goBack} disabled={currentStep === 1} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40">
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                {existingCompany && currentStep === 2 && (
                                    <PrimaryButton type="button" onClick={submit}>
                                        Yes, register me
                                    </PrimaryButton>
                                )}
                                {!(existingCompany && currentStep === 2) && (
                                    <PrimaryButton type="button" onClick={goNext}>
                                        {currentStep === steps.length ? 'Register' : 'Next'}
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

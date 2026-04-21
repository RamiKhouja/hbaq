import { useEffect,  useState  } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AddressInput from '@/Components/AdressInput';
import { CheckIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import SecondaryButton from '@/Components/SecondaryButton';



export default function Register() {

    const {t, i18n} = useTranslation();

    const [errors, setErrors] = useState([])

    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        country: 'Tunisia',
        state : 'Tunis',
        city : '',
        zip : '',
        address_1: '',
        address_2: ''
    })

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
    
        // Show preview if an image is selected
        if (e.target.files.length > 0) {
          const reader = new FileReader();
          reader.onload = (event) => {
            document.getElementById('image-preview').src = event.target.result;
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      };

    const [steps, setSteps] = useState([
        { id: 1, name: 'Personal Info', href: '#', status: 'current' },
        { id: 2, name: 'Address', href: '#', status: 'upcoming' },
    ]);

    const checkUserInfo = async () => {
        setErrors([]);

        let invalidName = !userInfo.firstname || userInfo.firstname.trim() === '';
        if (invalidName) {
            setErrors((prevErrors) => [...prevErrors, { name: 'firstname', message: 'Name is required' }]);
            setAlertVisible(true);
        }
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
        let invalidEmail = !userInfo.email || !isValidEmail;
        if (invalidEmail) {
            setErrors((prevErrors) => [...prevErrors, { name: 'email', message: 'Valid email is required' }]);
            setAlertVisible(true);
        }
        const isValidPassword = userInfo.password.length >= 8;
        let invalidPass = !userInfo.password || !isValidPassword;
        if (invalidPass) {
            setErrors((prevErrors) => [...prevErrors, { name: 'password', message: 'Password must be at least 8 characters' }]);
            setAlertVisible(true);
        }
        const isValidConfirm = userInfo.password === userInfo.password_confirmation;
        if (!isValidConfirm) {
            setErrors((prevErrors) => [...prevErrors, { name: 'password_confirmation', message: 'Passwords do not match' }]);
            setAlertVisible(true);
        }
        let invalidPhone = !userInfo.phone || userInfo.phone.trim() === '';
        if (invalidPhone) {
            setErrors((prevErrors) => [...prevErrors, { name: 'phone', message: 'Phone is required' }]);
            setAlertVisible(true);
        }

        if(invalidName || invalidEmail || invalidPass || !isValidConfirm || invalidPhone) {
            return false;
        } else {
            return true;
        }
    }

    const handleNextStep = (id) => {
        
        setSteps((prevSteps) => {
            return prevSteps.map((step) => {
              if (step.id === id) {
                return { ...step, status: 'complete' };
              } else if (step.id === id + 1) {
                return { ...step, status: 'current' };
              } else {
                return step;
              }
            });
        });
    }

    const handleCheck = async (id) => {

        if(id==1) {
            if(await checkUserInfo()) {
                handleNextStep(1);
            }
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        if(await checkUserInfo()) {
            const formData = new FormData();
            formData.append('firstname', userInfo.firstname);
            formData.append('lastname', userInfo.lastname);
            formData.append('email', userInfo.email);
            formData.append('password', userInfo.password);
            formData.append('phone', userInfo.phone);
            formData.append('country', 'Tunisia');
            formData.append('state', userInfo.state);
            formData.append('city', userInfo.city);
            formData.append('zip', userInfo.zip);
            formData.append('address_1', userInfo.address_1);
            formData.append('address_2', userInfo.address_2);
            // post(route('register'));
            router.post("/register", formData, {
                forceFormData: true,
            });
        }
    };

    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(()=>{
    },[errors])

    return (
        <>
        <Head title="Register" />
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            {/* <div>
                <Link href="/">
                    <img className="h-20 my-10" src="/pictures/logo-1.png" alt="Seoof" />
                </Link>
            </div> */}
            {errors.length>0 && alertVisible && (
                <div className="bg-red-50 rounded-lg text-red-800 px-4 pt-4 shadow-sm my-8 md:w-2/3 lg:w-1/2" role="alert">
                    <div className="flex justify-between items-start">
                        <div>
                        {errors.map((error) => (
                            <div key={error.name} className="flex mb-4 items-center">
                                <div className="py-1"><svg className="fill-current h-6 w-6 text-red-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                                <div>
                                <p className="text-sm">{error.message}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                        <button onClick={()=>setAlertVisible(false)}>
                            <XMarkIcon className='w-5 h-5 text-red-800'/>
                        </button>
                    </div>
                </div>
            )}
            <nav aria-label="Progress" className='md:w-2/3 lg:w-1/2'>
                <ol role="list" className="divide-y divide-gray-300 bg-white rounded-md border border-gray-300 md:flex md:divide-y-0">
                    {steps.map((step, stepIdx) => (
                    <li key={step.name} className="relative md:flex md:flex-1">
                        {step.status === 'complete' ? (
                        <div className="group flex w-full items-center">
                            <span className="flex items-center px-6 py-4 text-sm font-medium">
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primdark">
                                <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </span>
                            <span className="ml-4 text-sm font-medium text-primary">{step.name}</span>
                            </span>
                        </div>
                        ) : step.status === 'current' ? (
                        <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                            <span className="text-primary">{step.id}</span>
                            </span>
                            <span className="ml-4 text-sm font-medium text-primary">{step.name}</span>
                        </div>
                        ) : (
                        <div className="group flex items-center">
                            <span className="flex items-center px-6 py-4 text-sm font-medium">
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                                <span className="text-gray-500">{step.id}</span>
                            </span>
                            <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                            </span>
                        </div>
                        )}

                        {stepIdx !== steps.length - 1 ? (
                        <>
                            {/* Arrow separator for lg screens and up */}
                            <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                            <svg
                                className="h-full w-full text-gray-300"
                                viewBox="0 0 22 80"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path
                                d="M0 -2L20 40L0 82"
                                vectorEffect="non-scaling-stroke"
                                stroke="currentcolor"
                                strokeLinejoin="round"
                                />
                            </svg>
                            </div>
                        </>
                        ) : null}
                    </li>
                    ))}
                </ol>
            </nav>
            <form onSubmit={submit} className='md:w-2/3 lg:w-1/2'>
                {steps.map((step) => {
                    if(step.id==1 && step.status=='current') {
                        return (
                            <div key={step.id} className="w-full mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                                <div className="grid sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Firstname" />
                                        <TextInput
                                            id="firstname"
                                            name="firstname"
                                            value={userInfo.firstname}
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={handleUserChange}
                                            required
                                        />

                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div className='mt-4 sm:mt-0'>
                                        <InputLabel htmlFor="name" value="Lastname" />
                                        <TextInput
                                            id="name"
                                            name="lastname"
                                            value={userInfo.lastname}
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={handleUserChange}
                                            required
                                        />

                                        <InputError message={errors.lastname} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={userInfo.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={handleUserChange}
                                        required
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="phone" value="Phone number" />

                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={userInfo.phone}
                                        className="mt-1 block w-full"
                                        autoComplete="phone"
                                        onChange={handleUserChange}
                                        required
                                    />

                                    <InputError message={errors.phone} className="mt-2" />
                                </div>
                                <div className="grid sm:grid-cols-2 sm:gap-x-4 mt-4">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" />

                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={userInfo.password}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={handleUserChange}
                                            required
                                        />

                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={userInfo.password_confirmation}
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            onChange={handleUserChange}
                                            required
                                        />

                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-8 gap-x-4">
                                    <Link
                                        href={route('login')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                                    >
                                        Already have an account? Login
                                    </Link>
                                    <button
                                        type='button'
                                        className='bg-primary text-white rounded-lg px-4 py-2'
                                        onClick={()=>handleCheck(1)}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )
                    } else if (step.id==2 && step.status=='current') {
                        return (
                            <div key={step.id} className="w-full mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                                <div>
                                    <div className="grid sm:grid-cols-3 sm:gap-x-4">
                                        <div>
                                            <InputLabel htmlFor="state" value="State" />
                                            <div className="mt-2 grid grid-cols-1">
                                                <select
                                                    id="state"
                                                    name="state"
                                                    value={userInfo.state}
                                                    onChange={handleUserChange}
                                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                                                >
                                                    <option value={'Tunis'}>Tunis</option>
                                                    <option value={'Ariana'}>Ariana</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='mt-4 sm:mt-0'>
                                            <InputLabel htmlFor="city" value="City" />
                                            <TextInput
                                                id="city"
                                                name="city"
                                                value={userInfo.city}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={handleUserChange}
                                            />
                                        </div>
                                        <div className='mt-4 sm:mt-0'>
                                            <InputLabel htmlFor="zip" value="Zip Code" />
                                            <TextInput
                                                id="zip"
                                                name="zip"
                                                value={userInfo.zip}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={handleUserChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <InputLabel htmlFor="address" value="Address" />
                                        <TextInput
                                            id="address_1"
                                            name="address_1"
                                            value={userInfo.address_1}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={handleUserChange}
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <InputLabel htmlFor="address" value="Appartment, Building..." />
                                        <TextInput
                                            id="address_2"
                                            name="address_2"
                                            value={userInfo.address_2}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={handleUserChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('login')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                                    >
                                        Already registered?
                                    </Link>
                                    {/* <button
                                        type='button'
                                        className='inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 ml-4'
                                        onClick={() => handleNextStep(1)}
                                    >
                                        Back
                                    </button>   */}
                                    <PrimaryButton className="ml-4" >
                                        Register
                                    </PrimaryButton>
                                </div>
                            </div>
                        )
                    }
                })}
                
            </form>
            
        </div>
        </>
    );
}

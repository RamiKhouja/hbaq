import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, WalletIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="grid md:grid-cols-3 md:gap-8">
                        <div className="md:col-span-3 p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                        {/* <div className="md:col-span-1 p-4 sm:p-8 bg-white shadow sm:rounded-lg h-fit">
                            <div className='flex justify-center gap-x-4 items-center'>
                                <WalletIcon className='w-10 h-10 text-primary' />
                                <p className="text-2xl font-medium text-primary">Wallet</p>
                            </div>
                            <div className="mt-8 flex space-x-4">
                                <p className="text-lg text-gray-900 font-medium">Amount</p>
                                <p className="text-lg text-gray-900 font-medium">{wallet.balance} SAR</p>
                                {wallet.status == 'positive'
                                ? (<ArrowTrendingUpIcon className='text-green-700 w-6 h-6'/>)
                                : (<ArrowTrendingDownIcon className='text-red-700 w-6 h-6'/>)
                                }
                            </div>
                        </div> */}
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

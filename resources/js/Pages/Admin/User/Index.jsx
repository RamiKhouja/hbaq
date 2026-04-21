import React, {useState, useEffect} from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import SecondaryButton from '@/Components/SecondaryButton';
import DeleteModal from '@/Components/DeleteModal';
import { useTranslation } from 'react-i18next';


export default function Index({users, profiles, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [activeView, setAvtiveView] = useState(users) 

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
  useEffect(()=>{},[users]);

  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  function prepareUserDelete (user) {
    setOpen(true);
    setUserToDelete(user);
  }

  function deleteUser( id ) {
    router.delete(`/admin/users/${id}`);
  }

  return (
    <>
    <AdminLayout user={auth?.user}>
      <Head title="Customers" />
      <div className="px-4 sm:px-6 lg:px-8">
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.user.list.customers')}</h1>
            <p className="mt-2 text-sm text-gray-700">
            {t('admin.user.list.list-of-clients')}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                
                <SecondaryButton className="ml-4" onClick={()=>{setAvtiveView (users) }}>
                  Registered Customers
                </SecondaryButton>
                <SecondaryButton className="ml-4" onClick={()=>{setAvtiveView (profiles) }}>
                  Guest Customers
                </SecondaryButton>
                {/*
                <SecondaryButton className="ml-4" onClick={()=>{setAvtiveView (verified_users) }}>
                {t('admin.user.list.accepted')}
                </SecondaryButton> */}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'?'text-right':'text-left'}>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">
                    {t('admin.user.list.name')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.user.list.email')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.user.list.phone')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.user.list.city')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900 flex justify-center">
                    Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeView && activeView.map( (user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.firstname} {user.lastname??''}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.city}, {user.state}</td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {user.pended==0
                          ? (<p className='text-orange-600'>{t('admin.user.list.pending')}</p>)
                          : (<p>{t('admin.user.list.approved')}</p>)
                        }
                      </td> */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center justify-center">
                        {/* {user.pended ==0 ? (
                        <Link title='Approve' href={`/admin/clients/customers/validate/${user.id}`} className="text-brown-700 hover:text-brown-900">
                          <CheckCircleIcon className='w-6 h-6'/>
                        </Link>
                        ):(<div className='w-5'></div>)} */}
                        <button type="button" onClick={()=>prepareUserDelete(user)} className="text-red-800 hover:text-red-900">
                          <TrashIcon className='w-5 h-5'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>    
    </AdminLayout>
    <DeleteModal 
      open={open} 
      setOpen={setOpen} 
      id={userToDelete?.id} 
      name={userToDelete?.name + ' ' + userToDelete?.lastname??''}
      deleteItem={deleteUser}
      what={"Customer"}
    />
    </>
  )
}

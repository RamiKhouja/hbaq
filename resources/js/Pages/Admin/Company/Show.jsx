import React, {useState, useEffect} from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import SecondaryButton from '@/Components/SecondaryButton';
import DeleteModal from '@/Components/DeleteModal';
import { useTranslation } from 'react-i18next';


export default function Show(company, auth) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const address = company.users[0].addresses[0];
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

  const [open, setOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  function prepareCompanyDelete (company) {
    setOpen(true);
    setCompanyToDelete(company);
  }

  function deleteCompany( id ) {
    router.delete(`/admin/company/${id}`);
  }
  function update( id ) {
    router.put(`/admin/company/${id}`);
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Stores" />
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
        </div>
        }
        <div className="flex justify-end mb-8">
          {!company.users[0].pended && (
          <Link 
            title='Approve' 
            href={`/admin/clients/customers/validate/${company.users[0].id}`}
            className='px-4 py-1 border border-brown-700 text-brown-700 rounded-lg hover:bg-brown-700 hover:text-white'
          >
            {t('admin.company.show.approve')}
          </Link>
          )}
          {/* <SecondaryButton className="ml-4">
              Delete
          </SecondaryButton> */}
        </div>
        <div className="grid gap-y-8 md:gap-x-8 md:grid-cols-2">
          <div className='shadow-md p-4 h-fit rounded-lg'>
            <p className="text-2xl text-brown-700 mb-8">{t('admin.company.show.store-details')}</p>
            <div className="grid gap-4 grid-cols-2">
              <p className='text-gray-900'>{t('admin.company.show.name-en')}</p>
              <p className='text-lg font-semibold text-gray-900'>{company.name.en}</p>
              <p className='text-gray-900'>{t('admin.company.show.name-ar')}</p>
              <p className='text-lg font-medium text-gray-900'>{company.name.ar}</p>
              <p className='text-gray-900'>{t('admin.company.show.phone')}</p>
              <p className='text-lg font-medium text-gray-900'>{company.phone}</p>
              <p className='text-gray-900'>{t('admin.company.show.status')}</p>
              <p className='text-lg font-medium text-gray-900'>{company.users[0].pended ? t('admin.company.show.active') : t('admin.company.show.pending')}</p>
              <p className='text-gray-900'>{t('admin.company.show.cr')}</p>
              <p className='text-lg font-semibold text-gray-900'>{company.rn}</p>
              <p className='text-gray-900'>{t('admin.company.show.vat')}</p>
              <p className='text-lg font-semibold text-gray-900'>{company.vat}</p>
              <p className='text-gray-900'>{t('admin.company.show.cr-pic')}</p>
              <a href={'/'+company.cr_image} target='_blank' className=''>
                <img src={'/'+company.cr_image} alt="" className='w-full shadow-md rounded-lg' />
              </a>
              <p className='text-gray-900'>{t('admin.company.show.vat-pic')}</p>
              <a href={'/'+company.vat_image} target='_blank' className=''>
                <img src={'/'+company.vat_image} alt="" className='w-full shadow-md rounded-lg' />
              </a>
            </div>
          </div>
          <div className='shadow-md p-4 h-fit rounded-lg'>
            <p className="text-2xl text-brown-700 mb-8">{t('admin.company.show.store-address')}</p>
            <div className="grid gap-4 grid-cols-2">
              <p className='text-gray-900'>{t('admin.company.show.country')}</p>
              <p className='text-lg font-semibold text-gray-900'>{address.country}</p>
              <p className='text-gray-900'>{t('admin.company.show.state')}</p>
              <p className='text-lg font-medium text-gray-900'>{address.state}</p>
              <p className='text-gray-900'>{t('admin.company.show.city')}</p>
              <p className='text-lg font-medium text-gray-900'>{address.city}</p>
              <p className='text-gray-900'>{t('admin.company.show.zip')}</p>
              <p className='text-lg font-medium text-gray-900'>{address.zip}</p>
              <p className='text-gray-900'>{t('admin.company.show.address')}</p>
              <p className='text-lg font-semibold text-gray-900'>{address.address_1}</p>
              <p className='text-gray-900'>{t('admin.company.show.add-address')}</p>
              <p className='text-lg font-semibold text-gray-900'>{address.address_2}</p>
            </div>
          </div>
        </div>
    </div>
    </AdminLayout>
  )
}

import { useState, useEffect } from 'react'
import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({brands, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  function deleteBrand( id ) {
    router.delete(`/admin/catalog/brands/${id}`);
  }
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

  const [brandFile, setBrandFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBrandFile(files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (brandFile) {
      formData.append('brand_file', brandFile);
      router.post('/admin/catalog/brands/import', formData, {
        forceFormData: true,
      });
    }
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Brands" />
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
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.brand.list.brands')}</h1>
            <p className="mt-2 text-sm text-gray-700">
            {t('admin.brand.list.list-of-brands')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex gap-x-4">
            <form onSubmit={handleSubmit}>
              {brandFile && (
                <button type='submit'>Import Brands</button>
              )}
              <div className="mt-2 flex items-center gap-x-3">
              <div className="relative">
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={handleChange}
                >
                  Import
                </button>
                <input
                  type="file"
                  name="brand_file"
                  id="file-input"
                  className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={handleChange}
                />
              </div>
            </div>
            </form>
            <Link
              type="button"
              href='/admin/catalog/brands/create'
              className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
            >
              {t('admin.brand.list.add-brand')}
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'? 'text-right' : 'text-left'}>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">
                    {t('admin.brand.list.logo')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.brand.list.name')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.brand.list.url')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {brands && brands.data.map( (item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.logo && (
                          <img src={'/'+item.logo} alt={item.name} className='h-10'/>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.url}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center">
                        <Link href={`/admin/catalog/brands/edit/${item.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button type="button" onClick={() => deleteBrand(item.id)} className="text-red-800 hover:text-brown-900">
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
        <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
          {brands.links.map((link, index) => (
            <Link
              key={index}
              className={`mr-2 px-3 py-1 rounded-full ring-1 ring-primary hover:bg-brown-800 hover:text-white ${link.active ? 'bg-primary text-white' : 'bg-white text-primary'}`}
              href={link.url}
            >
              {link.label == "&laquo; Previous" ? t('shop.prev') : (link.label=="Next &raquo;" ? t('shop.next') : link.label)}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

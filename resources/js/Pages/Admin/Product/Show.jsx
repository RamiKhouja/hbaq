import { router, Head, Link, usePage } from '@inertiajs/react'
import parse from 'html-react-parser';
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react'
import DeleteModal from '@/Components/DeleteModal';
import { useTranslation } from 'react-i18next';

export default function Index({product, inventories, prices, attOptions, auth}) {

  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  function deleteProduct( id ) {
    router.delete(`/admin/catalog/products/${id}`);
  }
  function prepareProdToDelete (product) {
    setOpen(true);
    setProductToDelete(product);
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

  return (
    <>
    <AdminLayout user={auth?.user}>
      <Head title={product?.name.en} />
      {flash.success && isAlertVisible &&
      <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <div>
            <p className="font-bold">Succès !</p>
            <p className="text-sm">{flash.success}</p>
          </div>
        </div>
      </div>}
      { product && (
        <div>
          <div className='md:grid md:grid-cols-3 md:gap-4 mb-8'>
            <div>
            {product.main_image && (
                <img 
                  src={'/'+product.main_image} 
                  alt={product.name.en} 
                  className='w-full rounded-lg'
                />
              )}
            </div>
            <div className='col-span-2'>
              <div className='flex justify-between mb-4'>
                <p className="text-3xl text-brown-800">{t('admin.product.show.general-info')}</p>
                <div className='flex gap-x-2'>
                  <Link type="button" href={`/admin/catalog/products/edit/${product.id}`} className="flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <PencilSquareIcon className={`w-4 h-4 ${lang=='ar'? 'ml-2':'mr-2'}`}/>
                    {t('admin.product.show.edit')}
                  </Link>
                  {auth?.user?.role === 'admin' && (
                  <button type="button" onClick={()=>prepareProdToDelete(product)} className="flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <TrashIcon className={`w-4 h-4 ${lang=='ar'? 'ml-2':'mr-2'}`}/>
                    {t('admin.product.show.delete')}
                  </button>
                  )}
                </div>
              </div>
              <p className="text-2xl text-gray-800">{product.name.en}</p>
              <p className="text-2xl text-gray-800">{product.name.ar}</p>
              <table className="my-4 border-0">
                <tr>
                  <td><p className="text-gray-600">{t('admin.product.show.url')} :</p></td>
                  <td><p className="text-gray-800 col-span-4">{product.url}</p></td>
                </tr>
                <tr>
                  <td><p className="text-gray-600">Stock :</p></td>
                  <td><p className="text-gray-800 col-span-4">{product.stock ?? 0} {product.unit}</p></td>
                </tr>
                {product.categories && (
                <tr>
                  <td><p className={`text-gray-600 ${lang=='ar'?'pl-2':'pr-2'}`}>{t('admin.product.show.categories')} :</p></td>
                  <div className='flex gap-x-2'>
                  {product.categories.map((category, index)=>(
                    <td key={index}>
                    <p className="text-gray-800 col-span-4">
                      {lang=='ar'? category.name.ar : category.name.en} 
                      {index<product.categories.length-1 && (',')}
                    </p>
                    </td>
                  ))}
                  </div>
                </tr>
                )}
                <tr>
                  <td><p className="text-gray-600">Meilleure vente :</p></td>
                  <td><p className="text-gray-800 col-span-4">{product.is_featured ? t('yes') : t('no')}</p></td>
                </tr>
                <tr>
                  <td><p className="text-gray-600">Produit de saison :</p></td>
                  <td><p className="text-gray-800 col-span-4">{product.is_season ? t('yes') : t('no')}</p></td>
                </tr>
                {/* <tr>
                  <td><p className="text-gray-600">{t('admin.product.show.new')} :</p></td>
                  <td><p className="text-gray-800 col-span-4">{product.is_new ? t('yes') : t('no')}</p></td>
                </tr> */}
              </table>
              <div className="mt-6">
                <h2 className="mb-3 text-base font-semibold text-gray-900">Options de prix</h2>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">Prix</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">Qté</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">Remise</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">Dates</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {product.prices?.map((priceOption) => (
                        <tr key={priceOption.id}>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{priceOption.price} DT</td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                            {priceOption.min_qty} - {priceOption.max_qty}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                            {priceOption.discount_price
                              ? `${priceOption.discount_price} DT (${priceOption.discount_percentage || 0}%)`
                              : '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                            {priceOption.start_date || priceOption.end_date
                              ? `${priceOption.start_date || '-'} / ${priceOption.end_date || '-'}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className='w-full px-4 sm:px-6 lg:px-8 mt-8 md:grid md:grid-cols-2 md:gap-4'>
            <div className="mb-6 md:mb-0">
              <h1 className="text-base font-semibold leading-6 text-gray-900 mb-2">{t('admin.product.show.english-description')}</h1>
              <div className="text-sm text-gray-700">{parse(product.description?.en ?? t('admin.product.show.no-description'))}</div>
            </div>
            <div>
              <h1 className="text-base font-semibold leading-6 text-gray-900 mb-2">{t('admin.product.show.arabic-description')}</h1>
              <div className="text-sm text-gray-700">{parse(product.description?.ar ?? t('admin.product.show.no-description'))}</div>
            </div>
            <div className="mb-6 md:mb-0">
              <h1 className="text-base font-semibold leading-6 text-gray-900 mb-2">Description en français</h1>
              <div className="text-sm text-gray-700">{parse(product.description?.fr ?? t('admin.product.show.no-description'))}</div>
            </div>
          </div>
          
          <div className='w-full px-4 sm:px-6 lg:px-8 mt-8'>
            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-4">{t('admin.product.show.images')}</h1>
            <div className='sm:grid sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
              {product.pictures && product.pictures.map((item) => (
                <img 
                key={item.id}
                  src={'/'+item.path} 
                  alt={'picture '+item.order} 
                  className='w-full rounded-lg mb-4 sm:mb-0'
                />
              ))}
              {/* <a href="#" className='w-full h-36 rounded-lg border-2 border-dashed border-brown-700 bg-brown-100 flex items-center'>
                <PlusIcon className='text-brown-700 w-8 h-8 mx-auto'/>
              </a> */}
            </div>
          </div>
        </div>
      ) }
    </AdminLayout>
    <DeleteModal 
      open={open} 
      setOpen={setOpen} 
      id={productToDelete?.id} 
      name={productToDelete?.name?.en}
      deleteItem={deleteProduct}
      what={"produit"}
    />
    </>
  )
}

import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index({products, auth}) {
  // const checkbox = useRef()
  // const [checked, setChecked] = useState(false)
  // const [indeterminate, setIndeterminate] = useState(false)
  // const [selectedProducts, setSelectedProducts] = useState([])

  function deleteProduct( id ) {
    router.delete(`/admin/catalog/products/${id}`);
  }

  const {t, i18n} = useTranslation();

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < products.length
  //   setChecked(selectedProducts.length === products.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedProducts])

  // function toggleAll() {
  //   setSelectedProducts(checked || indeterminate ? [] : products)
  //   setChecked(!checked && !indeterminate)
  //   setIndeterminate(false)
  // }

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
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

  const [prodFile, setProdFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProdFile(files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (prodFile) {
      formData.append('prod_file', prodFile);
      router.post('/admin/catalog/products/import', formData, {
        forceFormData: true,
      });
    }
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Products" />
      {flash.success && isAlertVisible &&
      <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <div>
            <p className="font-bold">Success!</p>
            <p className="text-sm">{flash.success}</p>
          </div>
        </div>
      </div>}
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.product.list.products')}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t('admin.product.list.list-of-prods')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex gap-x-4">
          {/* <form onSubmit={handleSubmit}>
            {prodFile && (
              <button type='submit'>Import Products</button>
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
                name="prod_file"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleChange}
              />
            </div>
          </div>
          </form> */}
          <Link
            type="button"
            href='/admin/catalog/products/create'
            className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.product.list.add-prod')}
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {/* {selectedProducts.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Bulk edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Delete all
                  </button>
                </div>
              )} */}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className={i18n.language=='ar'?'text-right':'text-left'}>
                  <tr>
                    {/* <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th> */}
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      {t('admin.product.list.image')}
                    </th>
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      {t('admin.product.list.name')}
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Price
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      {t('admin.product.list.category')}
                    </th> 
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      Best Seller
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.data.map((product) => (
                    // <tr key={product.id} className={selectedProducts.includes(product) ? 'bg-gray-50' : undefined}></tr>
                    <tr key={product.id}>
                      {/* <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedProducts.includes(product) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
                          value={product.id}
                          checked={selectedProducts.includes(product)}
                          onChange={(e) =>
                            setSelectedProducts(
                              e.target.checked
                                ? [...selectedProducts, product]
                                : selectedProducts.filter((p) => p !== product)
                            )
                          }
                        />
                      </td> */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {product.main_image && (
                          <img src={'/'+product.main_image} alt={product.name.en} className='h-10'/>
                        )}
                      </td>
                      {/* <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedProducts.includes(product) ? 'text-brown-600' : 'text-gray-900'
                        )}
                      > */}
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900'
                        )}
                      >
                        {i18n.language=='ar'
                        ? (<p title={product.name.ar}>{truncateString(product.name.ar,4)}</p>)
                        : (<p title={product.name.en}>{truncateString(product.name.en,4)}</p>)
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.price} {t('product.tnd')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {product.categories?.map((category)=>(<p key={category.id}>
                          {i18n.language=='ar' ? category.name.ar : category.name.en}
                        </p>))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{product.is_featured?t('yes'):t('no')}</td>
                      <td className="py-4 px-4 text-right text-sm font-medium flex gap-x-2 items-center">
                        <Link title={t('admin.product.list.view-prod')} href={`/admin/catalog/products/show/${product.id}`} className="text-gray-800 hover:text-brown-900">
                          <EyeIcon className='w-5 h-5'/>
                        </Link>
                        <Link title={t('admin.product.list.edit-prod')} href={`/admin/catalog/products/edit/${product.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        {auth?.user?.role === 'admin' && (
                        <button title={t('admin.product.list.delete-prod')} type="button" onClick={() => deleteProduct(product.id)} className="text-red-800 hover:text-brown-900">
                          <TrashIcon className='w-5 h-5'/>
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
        {products.links.map((link, index) => (
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




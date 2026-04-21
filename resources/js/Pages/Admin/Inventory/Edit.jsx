import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const EditInventory = ({inv, auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  const [inventory, setInventory] = useState({
    product_id: inv.product.id,
    in_stock: inv.in_stock, 
    qty: inv.qty,
    unit: inv.unit, 
    qty_set: inv.qty_set, 
    min_qty: inv.min_qty, 
    warehouse: inv.warehouse
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory({
      ...inventory,
      [name]: e.target.type === 'checkbox' 
        ? e.target.checked 
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.post(`/admin/catalog/inventories/update/${inv.id}`, inventory);
  };

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
    <AdminLayout user={auth?.user}>
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
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.inventory.inventory')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.inventory.update-stock-by')} {lang=='ar'? inv.product.name.ar : inv.product.name.en}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='md:grid md:grid-cols-3 md:gap-4 mb-4'>
          <div className='mb-4 md:mb-0 w-full'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.inventory.qty')}
            </label>
            <input
              type="number"
              name="qty"
              id="qty"
              className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder="quantity"
              value={inventory.qty}
              onChange={handleChange}
            />
          </div>
          <div className="relative flex items-start mb-4 md:mb-0 my-auto">
            <div className={`${lang=='ar'?'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="comments" className="font-medium text-gray-900">
              {t('admin.inventory.in-stock')}
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="in_stock"
                name="in_stock"
                type="checkbox"
                checked={inventory.in_stock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.inventory.out-stock-qty')}
            </label>
            <input
              type="number"
              name="min_qty"
              id="min_qty"
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder="min qty"
              value={inventory.min_qty}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='md:grid md:grid-cols-3 md:gap-4 mb-4'>
         <div className='mb-4'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.inventory.unit')}
            </label>
            <select name='unit' onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6">
              <option value='item'>{t('item')}</option>
              <option value='set'>{t('set')}</option>
            </select>
          </div>
          {inventory.unit==='set' && (
            <div className='w-full'>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.inventory.qty-set')}
              </label>
              <input
                type="number"
                name="qty_set"
                id="qty_set"
                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="min qty"
                value={inventory.qty_set}
                onChange={handleChange}
              />
            </div>
          )}
          <div className='w-full'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.inventory.warehouse')}
            </label>
            <input
              type="text"
              name="warehouse"
              id="warehouse"
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder="Warehouse"
              value={inventory.warehouse}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.inventory.save')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditInventory;

import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CreatePriceOption = ({product, groups, auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  const [priceOption, setPriceOption] = useState({
    min_qty: 1,
    unit: 'item',
    price: 0.00,
    currency: 'SR',
    is_discount: false,
    discount: 0.00,
    discount_price: null,
    discount_start: null,
    discount_end: null,
    group_id: 1,
    product_id: product.id,
    more: false
  });

  const empty = () => {
    setPriceOption({
      min_qty: 1,
      unit: 'item',
      price: 0.00,
      currency: 'SR',
      is_discount: false,
      discount: 0.00,
      discount_price: null,
      discount_start: null,
      discount_end: null,
      group_id: 1,
      product_id: product.id,
      more: false
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name==='group_id') {
      setPriceOption({
        ...priceOption,
        [name]: parseInt(value)
      });
    } 
    else if (name==='discount') {
      setPriceOption({
        ...priceOption,
        discount: value,
        discount_price: Math.round((priceOption.price - priceOption.price*value/100) * 100) / 100
      });
    }
    else if (name==='discount_price') {
      setPriceOption({
        ...priceOption,
        discount_price: value,
        discount: Math.round(((priceOption.price-value)*100 / priceOption.price) * 100) / 100
      });
    } 
    else {
      setPriceOption({
        ...priceOption,
        [name]: e.target.type === 'checkbox' 
          ? e.target.checked 
          : e.target.type === 'number'
            ? value && parseFloat(value)
            : value
      });
    }
  };

  const handleMore = (more) => {
    setPriceOption({
      ...priceOption,
      more: more
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/admin/prices', priceOption);
    empty();
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
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.price.add-price-option')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.price.create-price-for')} {lang=='ar'? product.name.ar : product.name.en}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='md:grid md:grid-cols-3 md:gap-4 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.price')}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-xs mb-2" style={{fontFamily:"Noto Nastaliq Urdu"}}>ريال</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                step={0.01}
                min={0.00}
                id="price"
                name="price"
                value={priceOption.price}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                {t('admin.price.sar')}
                </span>
              </div>
            </div>
          </div>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.unit')}
            </label>
            <select name='unit' onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6">
              <option value='item'>{t('item')}</option>
              <option value='set'>{t('set')}</option>
            </select>
          </div>
          <div className='w-full'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.min-qty')}
            </label>
            <input
              type="number"
              name="min_qty"
              id="min_qty"
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder="min qty"
              value={priceOption.min_qty}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='md:grid md:grid-cols-3 md:gap-4 mb-4'>
          {groups && (
          <div className='mb-4 md:mb-0'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.group')}
            </label>
            <select name='group_id' onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6">
            <option key={999} value={''}>{t('admin.price.select')}</option>
            {groups.map((group)=>(
              <option key={group.id} value={group.id}>{group.name.en}</option>
            ))}
            </select>
          </div>
          )}
          <div className="relative flex items-start mb-4 md:mb-0 my-auto">
            <div className={`${lang=='ar'?'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="is_discount" className="font-medium text-gray-900">
              {t('admin.price.discount')}
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="is_discount"
                name="is_discount"
                type="checkbox"
                checked={priceOption.is_discount}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
          {priceOption.is_discount && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.discount-perct')}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="number"
                placeholder="0.00"
                step={0.01}
                min={0.00}
                id="discount"
                name="discount"
                value={priceOption.discount}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  %
                </span>
              </div>
            </div>
          </div>
          )}
        </div>
        {priceOption.is_discount && (
        <div className='md:grid md:grid-cols-3 md:gap-4 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.discount-price')}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-xs mb-2" style={{fontFamily:"Noto Nastaliq Urdu"}}>ريال</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                step={0.01}
                min={0.00}
                id="discount_price"
                name="discount_price"
                value={priceOption.discount_price}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                {t('admin.price.sar')}
                </span>
              </div>
            </div>
          </div>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.price.discount-start')}
            </label>
            <input
              type="date"
              id="discount_start"
              name="discount_start"
              value={priceOption.discount_start}
              onChange={handleChange}
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.price.discount-end')}
            </label>
            <input
              type="date"
              id="discount_end"
              name="discount_end"
              value={priceOption.discount_end}
              onChange={handleChange}
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        )}
        <div className="flex flex-row-reverse mt-4 gap-x-4">
          <button
            type="submit"
            onClick={()=>handleMore(false)}
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.price.save')}
          </button>
          <button
            type="submit"
            onClick={()=>handleMore(true)}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {t('admin.price.save-more')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreatePriceOption;

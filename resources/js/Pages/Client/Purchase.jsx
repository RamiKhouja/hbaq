import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { useTranslation } from 'react-i18next';

const Purchase = (product) => {
  const { t, i18n } = useTranslation();

    const [purchase, setPurchase] = useState({
      quantity : 0,
    });  
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setPurchase({
        ...purchase,
        [name]:  value,
      });
    };
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Use FormData to handle file uploads
      const formData = new FormData();
      formData.append('pruduct_id', product.id);
      formData.append('quantity', purchase.quantity);
    
     
      router.post(`/catalog/products/${product.id}/purchase`, formData, {
        forceFormData: true,
      });
    };
    const { flash } = usePage().props

    return (
      <ClientLayout>
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <form onSubmit={handleSubmit} >
         
          <div className='md:columns-2 mb-4'>
            <div className='mb-4 md:mb-0'>
              <label htmlFor="product" className="block text-sm font-medium leading-6 text-gray-900">
                product
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="product"
                  id="product"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={product.name_en}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                quantity
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={purchase.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>       
          
          <div className="flex flex-row-reverse">
            <button
              type="submit"
              className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-800"
            >
              command
            </button>
          </div>
        </form>
      </ClientLayout>
    );
  };
  
  export default Purchase;
  
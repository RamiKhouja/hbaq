import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Select from 'react-select';
import AdminLayout from '@/Layouts/AdminLayout';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CreateService = ({auth}) => {

  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState({
    name_en: '',
    name_ar: '',
    name_fr: '',
    description_en: '',
    description_ar: '',
    description_fr: '',
    show_in_home: false,
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setService({
      ...service,
      [name]: files 
        ? files[0] 
        : e.target.type === 'checkbox' 
          ? e.target.checked 
          : value,
    });
  };

  const handleFileChange = (e) => {
    handleChange(e);

    // Show preview if an image is selected
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('image-preview').src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('name_en', service.name_en);
    formData.append('name_ar', service.name_ar);
    formData.append('name_fr', service.name_fr);
    formData.append('description_en', service.description_en);
    formData.append('description_ar', service.description_ar);
    formData.append('description_fr', service.description_fr);
    formData.append('show_in_home', service.show_in_home ? 1 : 0); 

    if (service.image) {
      formData.append('image', service.image);
    }
    
    router.post('/admin/services', formData, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.service.new.new-service')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.service.new.create-new-by')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='md:columns-2 lg:columns-3 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.name-en')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_en"
                id="name_en"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Service name"
                value={service.name_en}
                onChange={handleChange}
              />
              {submitted && service.name_en=='' && (
                <p className='text-xs text-red-500 mt-1'>Service name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.name-ar')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_ar"
                id="name_ar"
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="اسم الخدمة"
                value={service.name_ar}
                onChange={handleChange}
              />
              {submitted && service.name_ar=='' && (
                <p className='text-xs text-red-500 mt-1'>Service name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.name-fr')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_fr"
                id="name_fr"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Nom du service"
                value={service.name_fr}
                onChange={handleChange}
              />
              {submitted && service.name_fr=='' && (
                <p className='text-xs text-red-500 mt-1'>Service name required</p>
              )}
            </div>
          </div>
        </div>
        <div className='md:columns-2 mb-4'>
          <div>
            <div className="relative  items-start">
              <div className={`${lang=='ar'? 'ml-3':'mr-3'} text-sm leading-6`}>
                <label htmlFor="comments" className="font-medium text-gray-900">
                {t('admin.service.new.show-in-home')}
                </label>
              </div>
              <div className="flex h-6 items-center">
                <input
                  id="show_in_home"
                  name="show_in_home"
                  type="checkbox"
                  checked={service.show_in_home}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.service.new.main-image')}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                src={service.image ? URL.createObjectURL(service.image) : '/pictures/default.jpg'}
                alt="Preview"
                className='w-32 rounded-lg'
              />
            </div>
            <div className="relative">
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={handleFileChange}
              >
                {t('admin.product.new.choose-image')}
              </button>
              <input
                type="file"
                name="image"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
            {submitted && !service.image && (
              <p className='text-xs text-red-500 mt-1'>Please choose an image</p>
            )}
            {/* <input
              type="file"
              name="image"
              onChange={handleFileChange}
            /> */}
          </div>
        </div>
        <div className="md:columns-2 lg:columns-3 mb-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.english-description')}
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_en"
                id="description_en"
                placeholder='Fully describe the service.'
                value={service.description_en}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.arabic-description')}
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_ar"
                id="description_ar"
                placeholder='وصف كامل للخدمة'
                value={service.description_ar}
                onChange={handleChange}
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.service.new.french-description')}
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_fr"
                id="description_fr"
                placeholder='Decrivez votre service'
                value={service.description_fr}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.service.new.create-service')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateService;

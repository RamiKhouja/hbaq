import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

const EditBrand = ({brand, auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;

  const [data, setData] = useState({
    name: brand.name,
    url: brand.url,
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If the input is a file input, store the file in the state
    setData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
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
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('url', data.url);
    formData.append('logo', data.logo);
    
    router.post(`/admin/catalog/brands/update/${brand.id}`, formData, {
      forceFormData: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.brand.new.edit-brand')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.brand.new.update-by')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.brand.new.name')}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder={t('admin.brand.new.brand-name')}
              value={data.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.brand.new.url')}
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="url"
              id="url"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              placeholder="brand-url"
              value={data.url}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-span-full mb-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.brand.new.logo')}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                src={data.logo ? URL.createObjectURL(data.logo) : ('/'+brand.logo)}
                alt="Preview"
                className='w-32 rounded-lg'
              />
            </div>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.brand.new.update-brand')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditBrand;

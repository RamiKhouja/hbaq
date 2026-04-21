import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const CreateCategory = ({parentCats, auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState({
    name_en: '',
    name_ar: '',
    name_fr: '',
    description_en: '',
    description_ar: '',
    description_fr: '',
    type: 'menu',
    image: null,
    menu_show: true,
    parent_id: null
  });

  const typeOptions = [
    { label: 'Menu', value: 'menu' },
    { label: 'Event', value: 'event' }
  ];
  const [selectedType, setSelectedType] = useState(typeOptions[0]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCategory({
      ...category,
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

  const handleTypeChange = (type) => {
    setSelectedType(type)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('menu_show', category.menu_show ? 1 : 0); // Convert to 1 or 0 for a boolean checkbox
    formData.append('name_en', category.name_en);
    formData.append('name_ar', category.name_ar);
    formData.append('name_fr', category.name_fr);
    formData.append('description_en', category.description_en);
    formData.append('description_ar', category.description_ar);
    formData.append('description_fr', category.description_fr);

    // Append image if it exists
    if (category.image) {
      formData.append('image', category.image);
    }

    // Append parent_id if it exists
    if (category.parent_id !== null) {
      formData.append('parent_id', category.parent_id);
    }
    
    router.post('/admin/catalog/categories', formData, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.category.new.new-cat')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.category.new.create-new-by')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {parentCats && (
          <div className='mb-4'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.category.new.parent-cat')}
            </label>
            <select
              id="parent_id"
              name="parent_id"
              onChange={handleChange}
              className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6'
            >
              <option key={9999} value={null}>{t('admin.category.new.no-parent')}</option>
              {parentCats.map((cat)=>(
                <option key={cat.id} value={cat.id}>{lang=='ar'? cat.name.ar : cat.name.en}</option>
              ))}
            </select>
          </div>
        )}
        <div className='md:columns-3 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.category.new.name-en')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_en"
                id="name_en"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Category name"
                value={category.name_en}
                onChange={handleChange}
              />
              {submitted && category.name_en=='' && (
                <p className='text-xs text-red-500 mt-1'>Category name required</p>
              )}
            </div>
          </div>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.category.new.name-fr')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_fr"
                id="name_fr"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Nom de Catégorie"
                value={category.name_fr}
                onChange={handleChange}
              />
              {submitted && category.name_fr=='' && (
                <p className='text-xs text-red-500 mt-1'>Category name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.category.new.name-ar')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_ar"
                id="name_ar"
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="اسم الفئة"
                value={category.name_ar}
                onChange={handleChange}
              />
              {submitted && category.name_ar=='' && (
                <p className='text-xs text-red-500 mt-1'>Category name required</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-full mb-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.category.new.image')}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                src={category.image ? URL.createObjectURL(category.image) : '/pictures/default.jpg'}
                alt="Preview"
                className='w-32 rounded-lg'
              />
            </div>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </div>
          {submitted && !category.image && (
            <p className='text-xs text-red-500 mt-1'>Please choose an image</p>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.category.new.english-description')}
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              name="description_en"
              id="description_en"
              placeholder='Fully describe the category.'
              value={category.description_en}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.category.new.french-description')}
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              name="description_fr"
              id="description_fr"
              placeholder='Décrivez la catégorie'
              value={category.description_fr}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.category.new.arabic-description')}
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              name="description_ar"
              id="description_ar"
              placeholder='وصف كامل للفئة'
              value={category.description_ar}
              onChange={handleChange}
              className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-x-4 mb-8">
          <div className="relative flex items-start mb-4">
            <div className={`${lang=='ar'?'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="comments" className="font-medium text-gray-900">
              {t('admin.category.new.show-menu')}
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="menu_show"
                name="menu_show"
                type="checkbox"
                checked={category.menu_show}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
          <div className='md:mb-0 mb-4'>
            <label htmlFor="parent" className="block text-sm mb-2 font-medium leading-6 text-gray-900">
            Type
            </label>
            <Select 
              name='type' 
              options={typeOptions} 
              isMulti={false} 
              value={selectedType} 
              onChange={handleTypeChange}
            />
          </div>
        </div>
        
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.category.new.create-cat')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateCategory;

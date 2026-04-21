import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const CreateAttribute = ({auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [submitted, setSubmitted] = useState(false);
  const [options, setOptions] = useState([]);
  const [attribute, setAttribute] = useState({
    name_en: '',
    name_ar: '',
    type: 'string',
    multi_vals: false,
    filtrable: false,
    options: []
  });

  const handleAddOption = () => {
    setOptions([...options, { en: '', ar: '' }]);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    event.target.name=='option_en' 
      ? newOptions[index].en = event.target.value
      : newOptions[index].ar = event.target.value;
    setOptions(newOptions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttribute({
      ...attribute,
      [name]: e.target.type === 'checkbox' 
          ? e.target.checked 
          : value,
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    attribute.options=options;
    router.post('/admin/catalog/attributes', attribute);
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.attribute.new-attribute')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.attribute.create-by')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='md:columns-2 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.attribute.name-en')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_en"
                id="name_en"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Color, Igredients..."
                value={attribute.name_en}
                onChange={handleChange}
              />
              {submitted && attribute.name_en=='' && (
                <p className='text-xs text-red-500 mt-1'>Attribute name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.attribute.name-ar')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_ar"
                id="name_ar"
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="اللون, المكونات..."
                value={attribute.name_ar}
                onChange={handleChange}
              />
              {submitted && attribute.name_ar=='' && (
                <p className='text-xs text-red-500 mt-1'>Attribute name required</p>
              )}
            </div>
          </div>
        </div>
        {/* <div className='mb-4'>
            <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
              Type
            </label>
            <select
              id="type"
              name="type"
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Yes/No</option>
            </select>
        </div> */}
        <div className='mb-4 w-2/3'>
            <div className="flex gap-x-4 mb-2">
              <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.attribute.options')}
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="block w-max rounded-full bg-primary p-1 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
              >
                <PlusIcon className='w-5 h-5'/>
              </button>
            </div>
            {options.map((field, index) => (
              <div className="flex gap-x-4 mb-2" key={index}>
                <input
                  type="text"
                  name="option_en"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                  placeholder={`Option ${index+1}`}
                  value={field.value}
                  onChange={(event) => handleOptionChange(index, event)}
                />
                <input
                  type="text"
                  name="option_ar"
                  dir='rtl'
                  className="block text-right w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                  placeholder={`خيار عدد ${index+1}`}
                  value={field.value}
                  onChange={(event) => handleOptionChange(index, event)}
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  <XMarkIcon className='h-5 w-5 text-gray-900'/>
                </button>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-x-8">
          <div className="relative flex items-start mb-4">
            <div className={`${lang=='ar'? 'ml-3' : 'mr-3'} text-sm leading-6`}>
                <label htmlFor="comments" className="font-medium text-gray-900">
                {t('admin.attribute.filtrable')}
                </label>
            </div>
            <div className="flex h-6 items-center">
                <input
                id="filtrable"
                name="filtrable"
                type="checkbox"
                checked={attribute.filtrable}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
                />
            </div>
          </div>
          {/* <div className="relative flex items-start mb-4">
            <div className="mr-3 text-sm leading-6">
                <label htmlFor="comments" className="font-medium text-gray-900">
                    Multiple Values
                </label>
            </div>
            <div className="flex h-6 items-center">
                <input
                id="multi_vals"
                name="multi_vals"
                type="checkbox"
                checked={attribute.multi_vals}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
                />
            </div>
          </div> */}
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.attribute.create-att')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateAttribute;

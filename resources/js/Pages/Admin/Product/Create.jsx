import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Select from 'react-select';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CreateProduct = ({categories, auth}) => {

  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const catOptions = categories.map((category, index) => {
    return { label: lang=='ar'?category.name.ar:category.name.en, value: category.id, key: index };
  });

  const unitOptions = [
    { label: 'Piece', value: 'piece' },
    { label: 'Kg', value: 'kg' },
    { label: 'Liter', value: 'liter' },
    { label: 'Pack', value: 'pack' },
  ];
  const [selectedUnit, setSelectedUnit] = useState(unitOptions[0]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [product, setProduct] = useState({
    name_en: '',
    name_ar: '',
    name_fr: '',
    description_en: '',
    description_ar: '',
    description_fr: '',
    price: 0.00,
    unit: 'piece',
    main_image: null,
    is_new: false,
    is_featured: false,
    categories: [],
    pictures: [],
    is_discount: false,
    discount_price: null,
    discount_percentage: null,
    discount_start: null,
    discount_end: null,
    ingredients_en: '',
    ingredients_ar: '',
    ingredients_fr: '',
    instructions_en: '',
    instructions_ar: '',
    instructions_fr: '',
    weight: 0.00
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if(name === 'discount_percentage') {
      setProduct({
        ...product,
        discount_percentage: value,
        discount_price: ((value / 100) * product.price).toFixed(2),
      });
      return;
    } else if(name === 'discount_price') {
      setProduct({
        ...product,
        discount_price: value,
        discount_percentage: ((value / product.price) * 100).toFixed(2),
      });
      return;
    } else {
      setProduct({
        ...product,
        [name]: files 
          ? files[0] 
          : e.target.type === 'checkbox' 
            ? e.target.checked 
            : value,
      });
    }
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

  const handlePicsChange = (e) => {
    const files = Array.from(e.target.files);

    setProduct(prev => {
      const lastOrder =
        prev.pictures.length > 0
          ? Math.max(...prev.pictures.map(p => p.order))
          : 0;

      const newImages = files.map((file, index) => ({
        path: URL.createObjectURL(file),
        order: lastOrder + index + 1,
        file
      }));

      return {
        ...prev,
        pictures: [...prev.pictures, ...newImages]
      };
    });

    e.target.value = null;
  };

  const removePicture = (indexToRemove) => {
    setProduct(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, index) => index !== indexToRemove)
    }));
  };

  const changeImageOrder = (index, newOrder) => {
    setProduct(prev => {
      const pics = [...prev.pictures];
      pics[index] = { ...pics[index], order: Number(newOrder) };

      return {
        ...prev,
        pictures: pics.sort((a, b) => a.order - b.order)
      };
    });
  };


  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleUnitChange = (selectedOption) => {
    setSelectedUnit(selectedOption);
  };

  const handleSubmit = (e) => {
    console.log(product)
    e.preventDefault();
    setSubmitted(true);
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('is_new', product.is_new ? 1 : 0); 
    formData.append('is_featured', product.is_featured ? 1 : 0);
    formData.append('name_en', product.name_en);
    formData.append('name_ar', product.name_ar);
    formData.append('name_fr', product.name_fr);
    formData.append('description_en', product.description_en);
    formData.append('description_ar', product.description_ar);
    formData.append('description_fr', product.description_fr);
    formData.append('price', product.price);
    formData.append('unit', selectedUnit.value);
    formData.append('weight', product.weight);
    formData.append('ingredients_en', product.ingredients_en);
    formData.append('ingredients_ar', product.ingredients_ar);
    formData.append('ingredients_fr', product.ingredients_fr);
    formData.append('instructions_en', product.instructions_en);
    formData.append('instructions_ar', product.instructions_ar);
    formData.append('instructions_fr', product.instructions_fr);
    formData.append('is_discount', product.is_discount ? 1 : 0);
    if(product.is_discount) {
      formData.append('discount_price', product.discount_price);
      formData.append('discount_percentage', product.discount_percentage);
      formData.append('discount_start', product.discount_start);
      formData.append('discount_end', product.discount_end);
    }
    selectedCategories?.forEach((category) => {
      formData.append('categories[]', category.value);
    });

    if (product.main_image) {
      formData.append('main_image', product.main_image);
    }

    if (product.pictures) {
      product.pictures.forEach((pic, i) => {
        formData.append(`pictures[${i}]`, pic.file);
        formData.append(`pictures_order[${i}]`, pic.order);
      });
    }
    
    router.post('/admin/catalog/products', formData, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.product.new.new-prod')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.product.new.create-new-by')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.product.new.main-image')} *
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                src={product.image ? URL.createObjectURL(product.image) : '/pictures/default.jpg'}
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
                name="main_image"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
            {submitted && !product.main_image && (
              <p className='text-xs text-red-500 mt-1'>Please choose an image</p>
            )}
            {/* <input
              type="file"
              name="image"
              onChange={handleFileChange}
            /> */}
          </div>
        </div>
        <div className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 mb-4'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.name-en')} *
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_en"
                id="name_en"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Product name"
                value={product.name_en}
                onChange={handleChange}
              />
              {submitted && product.name_en=='' && (
                <p className='text-xs text-red-500 mt-1'>Product name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.name-ar')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_ar"
                id="name_ar"
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="اسم المنتج"
                value={product.name_ar}
                onChange={handleChange}
              />
              {submitted && product.name_ar=='' && (
                <p className='text-xs text-red-500 mt-1'>Product name required</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.name-fr')}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name_fr"
                id="name_fr"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Nome du produit"
                value={product.name_fr}
                onChange={handleChange}
              />
              {submitted && product.name_fr=='' && (
                <p className='text-xs text-red-500 mt-1'>Product name required</p>
              )}
            </div>
          </div>
        </div>
        <div className='md:grid md:grid-cols-4 md:gap-x-4 mb-4'>
          <div className='md:mb-0 mb-4 flex flex-col'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.price')} ({t('product.tnd')}) *
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="price"
                id="price"
                step={0.01}
                min={0.00}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
              />
              {submitted && product.name_ar=='' && (
                <p className='text-xs text-red-500 mt-1'>Product name required</p>
              )}
            </div>
          </div>
          <div className='md:mb-0 mb-4'>
              <label htmlFor="parent" className="block text-sm mb-2 font-medium leading-6 text-gray-900">
              {t('admin.product.new.unit')} *
              </label>
              <Select 
                name='unit' 
                options={unitOptions} 
                isMulti={false} 
                value={selectedUnit} 
                placeholder={t('admin.product.new.select-category')}
                onChange={handleUnitChange}
              />
              {submitted && selectedCategories.length==0 && (
                <p className='text-xs text-red-500 mt-1'>{t('admin.product.new.error-category')}</p>
              )}
            </div>
          <div className='md:col-span-2 md:mb-0 mb-4'>
          {categories && (
            <div>
              <label htmlFor="parent" className="block text-sm mb-2 font-medium leading-6 text-gray-900">
              {t('admin.product.new.categories')} *
              </label>
              <Select 
                name='categories' 
                options={catOptions} 
                isMulti={true} 
                value={selectedCategories} 
                placeholder={t('admin.product.new.select-category')}
                onChange={handleCategoryChange}
              />
              {submitted && selectedCategories.length==0 && (
                <p className='text-xs text-red-500 mt-1'>{t('admin.product.new.error-category')}</p>
              )}
            </div>
          )}
          </div>
        </div>
        <div className='md:grid md:grid-cols-4 md:gap-4 mb-4 items-center'>
          <div className='md:mb-0 mb-4'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.weight')}
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="weight"
                id="weight"
                min={0.00}
                step={0.01}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="Weight"
                value={product.weight}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="relative flex items-start md:mx-auto">
            <div className={`${lang=='ar'? 'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="comments" className="font-medium text-gray-900">
              Best Seller
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="featured"
                name="is_featured"
                type="checkbox"
                checked={product.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
          <div className="relative flex items-start md:mx-auto">
            <div className="mr-3 text-sm leading-6">
              <label htmlFor="is_discount" className="font-medium text-gray-900">
                In Discount
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="is_discount"
                name="is_discount"
                type="checkbox"
                checked={product.is_discount}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
        </div>
        <div className='md:grid md:grid-cols-4 md:gap-4 mb-4'>
          {product.is_discount && (
          <>
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Discount Percentage
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="number"
                placeholder="0.00"
                step={0.01}
                min={0.00}
                id="discount_percentage"
                name="discount_percentage"
                value={product.discount_percentage}
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
          <div className='mb-4 md:mb-0'>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Discount Price
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="number"
                placeholder="0.00"
                step={0.01}
                min={0.00}
                id="discount_price"
                name="discount_price"
                value={product.discount_price}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  TND
                </span>
              </div>
            </div>
          </div>
          <div className='mb-4 md:mb-0'>
              <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
                Discount Start
              </label>
              <input
                type="date"
                id="discount_start"
                name="discount_start"
                value={product.discount_start}
                onChange={handleChange}
                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
                Discount End
              </label>
              <input
                type="date"
                id="discount_end"
                name="discount_end"
                value={product.discount_end}
                onChange={handleChange}
                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </>
        )}
        </div>
        <div className="grid md:grid-cols-2 gap-x-4 lg:grid-cols-3 mb-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.english-description')}
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_en"
                id="description_en"
                placeholder='Fully describe the product.'
                value={product.description_en}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.arabic-description')}
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_ar"
                id="description_ar"
                placeholder='وصف كامل للمنتج'
                value={product.description_ar}
                onChange={handleChange}
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            French Description
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description_fr"
                id="description_fr"
                placeholder='Decrivez le produit'
                value={product.description_fr}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        
        <div className='flex items-start gap-x-4 mb-4'>
          {/* <div className="relative flex items-start">
            <div className={`${lang=='ar'? 'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="comments" className="font-medium text-gray-900">
              {t('admin.product.new.new')}
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="is_new"
                name="is_new"
                type="checkbox"
                checked={product.is_new}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div> */}
          
        </div>
        
        <div className="my-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.product.new.product-pics')}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            {product.pictures.map((image, index) => (
              <div key={index}>
                <div className="relative">
                  <img
                    src={image.path}
                    className="w-32 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removePicture(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="number"
                  min="1"
                  value={image.order}
                  onChange={(e) => changeImageOrder(index, e.target.value)}
                  className="mt-1 w-16 rounded border px-2"
                />
              </div>
            ))}
            <div className="relative">
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {t('admin.product.new.choose-image')}
              </button>
              <input
                type="file"
                name="picture"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handlePicsChange}
                multiple // Allow multiple file selection
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-4 lg:grid-cols-3 my-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Ingredients English
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="ingredients_en"
                id="ingredients_en"
                placeholder='Product ingredients'
                value={product.ingredients_en}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Ingredients Arabic
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="ingredients_ar"
                id="ingredients_ar"
                placeholder='وصفة المنتج'
                value={product.ingredients_ar}
                onChange={handleChange}
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Ingredients French
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="ingredients_fr"
                id="ingredients_fr"
                placeholder='Decrivez vos ingredients'
                value={product.ingredients_fr}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-4 lg:grid-cols-3 my-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Instructions English
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="instructions_en"
                id="instructions_en"
                placeholder='Product use instructions'
                value={product.instructions_en}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Instructions Arabic
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="instructions_ar"
                id="instructions_ar"
                placeholder='تعاليم استخدام المنتج'
                value={product.instructions_ar}
                onChange={handleChange}
                dir='rtl'
                className="block w-full text-right rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
            Instructions French
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="instructions_fr"
                id="instructions_fr"
                placeholder="Instructions d'utilisation"
                value={product.instructions_fr}
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
            {t('admin.product.new.create-product')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateProduct;

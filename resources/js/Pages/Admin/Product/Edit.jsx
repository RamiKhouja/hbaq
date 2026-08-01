import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Select from 'react-select';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ProductPricesForm, { emptyProductPrice } from '@/Components/ProductPricesForm';

const EditProduct = ({prod, categories, brands, prodCats, auth}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const catOptions = categories.map((category, index) => {
    return { label: lang=='ar'?category.name.ar:category.name.en, value: category.id, key: index };
  });

  const [selectedCategories, setSelectedCategories] = useState(
    prodCats.map(cat => ({ label: lang=='ar'?cat.name.ar:cat.name.en, value: cat.id }))
  );

  const [submitted, setSubmitted] = useState(false);
  const dateValue = (value) => value ? String(value).slice(0, 10) : '';

  const unitOptions = [
    { label: 'Pièce', value: 'piece' },
    { label: 'Kg', value: 'kg' },
    { label: 'Litre', value: 'liter' },
    { label: 'Pack', value: 'pack' },
  ];

  const [selectedUnit, setSelectedUnit] = useState(
    unitOptions.find(u => u.value === prod.unit)
  );

  const [product, setProduct] = useState({
    name_en: prod.name.en,
    name_ar: prod.name.ar,
    name_fr: prod.name.fr,

    description_en: prod.description?.en || '',
    description_ar: prod.description?.ar || '',
    description_fr: prod.description?.fr || '',

    url: prod.url,
    unit: prod.unit,
    stock: prod.stock ?? 0,

    is_featured: prod.is_featured,
    is_season: prod.is_season,

    main_image: null,
    pictures: prod.pictures || [],

    categories: prodCats.map(cat => cat.id),
  });

  const [productPrices, setProductPrices] = useState(
    prod.prices?.length
      ? prod.prices.map(price => ({
          id: price.id,
          price: price.price ?? '',
          min_qty: price.min_qty ?? 0,
          max_qty: price.max_qty ?? 1,
          discount_price: price.discount_price ?? '',
          discount_percentage: price.discount_percentage ?? '',
          start_date: dateValue(price.start_date),
          end_date: dateValue(price.end_date),
        }))
      : [emptyProductPrice()]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct({
      ...product,
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

    e.target.value = null; // allow re-select same file
  };

  const removePicture = (indexToRemove) => {
    // setProduct(prev => ({
    //   ...prev,
    //   pictures: prev.pictures
    //     .filter((_, index) => index !== indexToRemove)
    //     .map((pic, index) => ({
    //       ...pic,
    //       order: index + 1 
    //     }))
    // }));
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
    e.preventDefault();
    const formData = new FormData();
    formData.append('is_new', product.is_new ? 1 : 0); 
    formData.append('is_featured', product.is_featured ? 1 : 0);
    formData.append('is_season', product.is_season ? 1 : 0);
    formData.append('name_en', product.name_en);
    formData.append('name_ar', product.name_ar);
    formData.append('name_fr', product.name_fr);
    formData.append('url', product.url);
    formData.append('description_en', product.description_en);
    formData.append('description_ar', product.description_ar);
    formData.append('description_fr', product.description_fr);
    formData.append('unit', selectedUnit?.value || product.unit);
    formData.append('stock', product.stock);

    product.pictures.forEach((pic, i) => {
      if (pic.file) {
        formData.append(`pictures[${i}]`, pic.file);
        formData.append(`pictures_order[${i}]`, pic.order);
      }
    });

    product.pictures.forEach(pic => {
      if (pic.id) {
        formData.append('existing_pictures[]', pic.id);
      }
    });

    product.pictures.forEach(pic => {
      if (pic.id) {
        formData.append(`existing_pictures_order[${pic.id}]`, pic.order);
      }
    });

    selectedCategories?.forEach((category) => {
      formData.append('categories[]', category.value);
    });

    productPrices.forEach((priceOption, index) => {
      Object.entries(priceOption).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(`product_prices[${index}][${key}]`, value);
        }
      });
    });

    if (product.main_image) {
      formData.append('main_image', product.main_image);
    }
    
    router.post(`/admin/catalog/products/update/${prod.id}`, formData, {
      forceFormData: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.product.new.edit-product')}</h1>
        <p className="mt-2 text-sm text-gray-700">
        {t('admin.product.new.update-by-filling')}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-span-full mb-4">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          {t('admin.product.new.main-image')}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                src={product.image ? URL.createObjectURL(product.image) : prod.main_image ? ('/'+prod.main_image) : '/pictures/default.jpg'}
                alt="Aperçu"
                className='w-32 rounded-lg'
              />
            </div>
            <input
              type="file"
              name="main_image"
              onChange={handleFileChange}
            />
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
                placeholder="Nom du produit"
                value={product.name_en}
                onChange={handleChange}
              />
              {submitted && product.name_en=='' && (
                <p className='text-xs text-red-500 mt-1'>Le nom du produit est obligatoire</p>
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
                <p className='text-xs text-red-500 mt-1'>Le nom du produit est obligatoire</p>
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
                <p className='text-xs text-red-500 mt-1'>Le nom du produit est obligatoire</p>
              )}
            </div>
          </div>
        </div>
        <div className='md:grid md:grid-cols-3 md:gap-x-4 mb-4'>
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
          <div className='md:mb-0 mb-4'>
            <label htmlFor="stock" className="block text-sm mb-2 font-medium leading-6 text-gray-900">
              Stock
            </label>
            <div className="relative">
              <input
                type="number"
                name="stock"
                id="stock"
                min="0"
                step="0.01"
                value={product.stock}
                onChange={handleChange}
                className="block h-[38px] w-full rounded-md border-0 py-1.5 pl-3 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                {selectedUnit?.label || product.unit}
              </span>
            </div>
          </div>
          <div className='md:mb-0 mb-4'>
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
        <ProductPricesForm
          prices={productPrices}
          setPrices={setProductPrices}
          submitted={submitted}
        />
        <div className='md:grid md:grid-cols-4 md:gap-4 mb-4 items-center'>
          <div className='mb-4 md:mb-0'>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            {t('admin.product.new.url')} *
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="url"
                id="url"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                placeholder="URL du produit"
                value={product.url}
                onChange={handleChange}
              />
              {submitted && product.url=='' && (
                <p className='text-xs text-red-500 mt-1'>Le nom du produit est obligatoire</p>
              )}
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
            <div className={`${lang=='ar'? 'ml-3':'mr-3'} text-sm leading-6`}>
              <label htmlFor="is_season" className="font-medium text-gray-900">
              Product of the season
              </label>
            </div>
            <div className="flex h-6 items-center">
              <input
                id="is_season"
                name="is_season"
                type="checkbox"
                checked={product.is_season}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600"
              />
            </div>
          </div>
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
                placeholder='Décrivez complètement le produit.'
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
                    src={image.path.startsWith('blob:')
                      ? image.path
                      : `/${image.path}`}
                    className="w-32 rounded-lg"
                  />
                  <button 
                    onClick={() => removePicture(index)} type='button'
                    className="absolute top-2 right-2 p-1 rounded-full bg-white text-brown-800 hover:bg-brown-800 hover:text-white shadow-lg cursor-pointer">
                    <XMarkIcon className='w-4 h-4' />
                  </button>
                </div>
                <div className="mt-4 flex gap-x-2 items-center justify-center">
                  <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Ordre</label>
                  <input
                    type="number"
                    min="1"
                    value={image.order}
                    onChange={(e) => changeImageOrder(index, e.target.value)}
                    className="w-12 rounded-md border-0 px-2 py-0.5 ring-1 ring-gray-300 outline-none"
                  />
                </div>
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
        
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.product.new.update-product')}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;

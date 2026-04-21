import {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

function ShopFilter({brands, categories, setOpen, attributes}) {
    const {t, i18n} = useTranslation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isNew, setIsNew] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isDiscount, setIsDiscount] = useState(false);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();

    const [showAllBrands, setShowAllBrands] = useState(false);
    const renderedBrands = showAllBrands ? brands : brands.slice(0, 10);

    const [showAllOptions, setShowAllOptions] = useState(false);
    // const renderedOptions = showAllOptions ? brands : brands.slice(0, 10);

    useEffect(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        if (params.brands) {
            setSelectedBrands(prev => [
            ...prev,
            ...params.brands.split(',').map(b => parseInt(b, 10))
            ]);
        }
        if (params.categories) {
            setSelectedCategories(prev => [
            ...prev,
            ...params.categories.split(',').map(c => parseInt(c, 10))
            ]);
        }
        if (params.options) {
          setSelectedOptions(prev => [
          ...prev,
          ...params.options.split(',').map(o => parseInt(o, 10))
          ]);
      }
        params.discount && params.discount=='true' && setIsDiscount(params.discount);
        params.new && params.new=='true' && setIsNew(params.new);
        params.featured && params.featured=='true' && setIsFeatured(params.featured);
        params.min && setMinPrice(parseFloat(params.min,2));
        params.max && setMaxPrice(parseFloat(params.max,2));
    
    },[]);
    
    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
            return prevSelected.filter((id) => id !== categoryId);
            } else {
            return [...prevSelected, categoryId];
            }
        });
    };
    
    const handleBrandToggle = (brandId) => {
        setSelectedBrands((prevSelected) => {
          if (prevSelected.includes(brandId)) {
            return prevSelected.filter((id) => id !== brandId);
          } else {
            return [...prevSelected, brandId];
          }
        });
    };

    const handleOptionToggle = (optionId) => {
      setSelectedOptions((prevSelected) => {
        if (prevSelected.includes(optionId)) {
          return prevSelected.filter((id) => id !== optionId);
        } else {
          return [...prevSelected, optionId];
        }
      });
  };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        selectedCategories && selectedCategories.length>0 && queryParams.append('categories', selectedCategories.join(','));
        selectedBrands && selectedBrands.length>0 && queryParams.append('brands', selectedBrands.join(','));
        selectedOptions && selectedOptions.length>0 && queryParams.append('options', selectedOptions.join(','));
        isNew && queryParams.append('new', isNew);
        isFeatured && queryParams.append('featured', isFeatured);
        isDiscount && queryParams.append('discount', isDiscount);
        minPrice && queryParams.append('min', minPrice);
        maxPrice && queryParams.append('max', maxPrice);
        window.location.href = `/shop?${queryParams.toString()}`;
    };

  return (
    <div>
        <div className={`h-full lg:rounded-md lg:shadow-md lg:ring-1 lg:ring-gray-100 bg-white lg:col-span-1 p-4 ${i18n.language=='ar'?'order-2':'order-1'}`} dir={i18n.language=='ar'?'rtl':'ltr'}>
            <div className="flex justify-between items-center lg:hidden mb-8">
                <div className="flex gap-x-4 items-center">
                    <AdjustmentsHorizontalIcon className='h-6 w-6 text-gray-800' />
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-800">{t('shop.filter-by')}</h2>
                </div>
                <button
                    type="button"
                    className="text-gray-800 hover:text-gray-900"
                    onClick={() => setOpen(false)}
                >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div className="hidden lg:flex justify-center gap-x-4 items-center mb-8">
                <AdjustmentsHorizontalIcon className='h-6 w-6 text-gray-800' />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-800">{t('shop.filter-by')}</h2>
            </div>
            <form onSubmit={handleSubmit}>
            <div className='mb-8'>
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                {t('shop.price')}
              </label>
              <div className="flex gap-x-2 mt-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number" step={0.01}
                    name="price"
                    value={minPrice}
                    onChange={(e)=>setMinPrice(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-xs" id="price-currency">
                      {t('shop.min')}
                    </span>
                  </div>
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number" step={0.01}
                    name="price"
                    value={maxPrice}
                    onChange={(e)=>setMaxPrice(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-xs" id="price-currency">
                      {t('shop.max')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='mb-8'>
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {t('shop.categories')}
              </label>
              {categories.map((category) => (
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id={`category-${category.id}`}
                      aria-describedby="comments-description"
                      name="categories"
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="mx-3 text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      {i18n.language=='ar'?category.name.ar : category.name.en}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className='mb-8'>
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {t('shop.brands')}
              </label>
              {renderedBrands.map((brand) => (
                <div className="relative flex items-start" key={brand.id}>
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      aria-describedby="comments-description"
                      name="brands"
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="mx-3 text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      {brand.name}
                    </label>
                  </div>
                </div>
              ))}
              <button type='button'
               className="mx-6 mt-4 rounded-md bg-white px-2 py-1 cursor-pointer text-xs text-primary font-medium shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 flex gap-x-2"
               onClick={()=>setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands ? (
                  <div className='flex gap-x-2 items-center'>
                    <MinusIcon className='w-4 h-4'/>
                    <p>{t('shop.show-less')}</p>
                  </div>
                ) : (
                  <div className='flex gap-x-2 items-center'>
                    <PlusIcon className='w-4 h-4'/>
                    <p>{t('shop.show-more')}</p>
                  </div>
                )}
              </button>
            </div>
            <div className='mb-8'>
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {t('shop.attributes')}
              </label>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="new"
                      aria-describedby="comments-description"
                      name="new"
                      type="checkbox"
                      checked={isNew}
                      onChange={()=>setIsNew(!isNew)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="mx-3 text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      {t('shop.is_new')}
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="featured"
                      aria-describedby="comments-description"
                      name="featured"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={()=>setIsFeatured(!isFeatured)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="mx-3 text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      {t('shop.is_featured')}
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="discount"
                      aria-describedby="comments-description"
                      name="discount"
                      type="checkbox"
                      checked={isDiscount}
                      onChange={()=>setIsDiscount(!isDiscount)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="mx-3 text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      {t('shop.in_sale')}
                    </label>
                  </div>
                </div>
            </div>
            {/* Attributes map */}
            {attributes && attributes.map((attribute)=> {
            if (attribute.filtrable) return(
              <div className='mb-8'>
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                { i18n.language=='ar' ? attribute.name.ar : attribute.name.en}
                </label>
                {
                  showAllOptions ? (
                    attribute.options?.map((option) => (
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="comments"
                            aria-describedby="comments-description"
                            name="brands"
                            type="checkbox"
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => handleOptionToggle(option.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="mx-3 text-sm leading-6">
                          <label htmlFor="comments" className="font-medium text-gray-900">
                            { i18n.language=='ar' ? option.value.ar : option.value.en}
                          </label>
                        </div>
                      </div>
                    ))
                  ) : (
                    attribute.options?.slice(0, 10).map((option) => (
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="comments"
                            aria-describedby="comments-description"
                            name="brands"
                            type="checkbox"
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => handleOptionToggle(option.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="mx-3 text-sm leading-6">
                          <label htmlFor="comments" className="font-medium text-gray-900">
                          { i18n.language=='ar' ? option.value.ar : option.value.en}
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                <button type='button'
                  className="mx-6 mt-4 rounded-md bg-white px-2 py-1 cursor-pointer text-xs text-primary font-medium shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 flex gap-x-2"
                  onClick={()=>setShowAllOptions(!showAllOptions)}
                  >
                    {showAllOptions ? (
                      <div className='flex gap-x-2 items-center'>
                        <MinusIcon className='w-4 h-4'/>
                        <p>{t('shop.show-less')}</p>
                      </div>
                    ) : (
                      <div className='flex gap-x-2 items-center'>
                        <PlusIcon className='w-4 h-4'/>
                        <p>{t('shop.show-more')}</p>
                      </div>
                    )}
                  </button>
              </div>
            )})}
            <div className="flex justify-between gap-x-4">
              <Link 
                type='button' 
                href='/shop'
                className='w-full rounded-full py-1.5 bg-white ring-1 ring-primary text-primary font-semibold hover:bg-brown-800 hover:text-white text-center'
              >{t('shop.reset')}</Link>
              <button 
                type='submit'
                className='w-full rounded-full py-1.5 ring-1 ring-primary bg-primary text-white font-semibold hover:bg-brown-800'
              >{t('shop.filter')}</button>
            </div>
            </form>
          </div>
    </div>
  )
}

export default ShopFilter
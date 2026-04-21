import { Tab } from '@headlessui/react'
import parse from 'html-react-parser';
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next'
import { Link } from '@inertiajs/react'
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, clearAlert, showAlert } from '@/redux/cartSlice';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { ArrowUpLeftIcon, ArrowUpRightIcon, ChevronDownIcon, ChevronUpIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import OwlProducts from '@/Components/OwlProducts';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Product({auth, categories, product, related, eventCategories}) {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const lang = i18n.language;
  const cartAlert = useSelector(state => state.cart.alert);
  console.log(product)

  const addItem = (product) => {
    dispatch(addItemToCart({ product, quantity }));
    dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
  };

  useEffect(() => {
    if (cartAlert) {
      const timer = setTimeout(() => dispatch(clearAlert()), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartAlert]);

  const renderDescription = () => {
    const lang = i18n.language;
    const description = product.description?.[lang];
    return description ? parse(description) : null;
  };

  const renderIngredients = () => {
    const lang = i18n.language;
    const ingredients = product.ingredients?.[lang];
    return ingredients ? parse(ingredients) : null;
  };

  const renderInstructions = () => {
    const lang = i18n.language;
    const instructions = product.instructions?.[lang];
    return instructions ? parse(instructions) : null;
  };

  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories}>
      {cartAlert &&
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-50 rounded-2xl text-green-800 px-4 py-3 shadow-lg " role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
            <div className="flex">
              <div><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                {/* <p className="font-bold">{t('cart.success')}</p> */}
                <p className="font-semibold text-sm lang-ar:text-xl">{t(cartAlert.message)}</p>
              </div>
            </div>
          </div>
        </div>
        }
    <div dir={i18n.language=='ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          {product?.pictures && product?.pictures.length>0  ? (
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {product?.pictures.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{product?.name.en}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img src={'/'+image.path} alt="" className="h-full w-full object-cover object-center" />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-brown-500' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {product?.pictures.map((image) => (
                <Tab.Panel key={image.id}>
                  <div className="relative w-fit">
                    <img
                      src={'/'+image.path}
                      alt={product?.name.en}
                      className="h-80 lg:h-[500px] object-cover object-center rounded-2xl"
                    />
                    <div className='absolute top-4 right-4 flex gap-x-2 items-center'>
                    {product.is_discount === 1 && (
                        <div className="bg-lime-800 rounded-xl px-4 py-1 shadow-lg">
                            <p className={`text-white font-semibold ${lang === 'ar' ? 'text-2xl font-adobe': 'text-xl'}`}>{t('owl-products.sale')} {Math.round(product.discount_percentage)}%</p>
                        </div>
                    )}
                    </div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
          ):(
            <div className="flex justify-center rounded-2xl relative">
              <img src={'/'+product?.main_image} alt="" className="h-80 lg:h-[500px] object-cover object-center rounded-2xl" />
              <div className='absolute top-4 right-4 flex gap-x-2 items-center'>
                {product.is_discount === 1 && (
                    <div className="bg-lime-800 rounded-xl px-4 py-1 shadow-lg">
                        <p className={`text-white font-semibold ${lang === 'ar' ? 'text-2xl font-adobe': 'text-xl'}`}>{t('owl-products.sale')} {Math.round(product.discount_percentage)}%</p>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            
            <h1 className={`${lang=='ar'?'text-4xl lg:text-7xl font-medium' : 'text-3xl lg:text-5xl font-bold'} text-brown-800`}>
              {i18n.language=='ar' ? product?.name.ar : product?.name.en}
            </h1>
            <div className="mt-4 lang-ar:mt-0">
              {product.is_discount
                ? (
                <div>
                  <p className={`${lang=='ar' ? 'text-xl lg:text-4xl font-light' : 'text-base lg:text-2xl mb-4'} font-normal line-through`}> {parseFloat(product.price)} {t('product.tnd')}</p>
                  <h3 className={`${lang=='ar'?'text-4xl lg:text-7xl font-medium' : 'text-3xl lg:text-5xl font-bold'} text-brown-800`}>
                      {parseFloat(product.price_after_discount)} {t('product.tnd')}
                      {product.unit !== 'pack' && (<span className={`${lang=='ar' ? 'text-xl lg:text-4xl' : 'text-base lg:text-2xl'} font-normal`}> ({t(`product.${product.unit}`)})</span>)}
                  </h3>
                </div>
              ) : (
                <p className={`${lang=='ar'?'text-4xl lg:text-7xl font-medium' : 'text-3xl lg:text-5xl font-bold'} text-brown-800`}>
                  {parseFloat(product.price)} <span className='text-xl lg:text-3xl'>{t('product.tnd')}</span>
                  {product.unit !== 'pack' && (<span className={`${lang=='ar' ? 'text-xl lg:text-4xl' : 'text-base lg:text-2xl'} font-normal`}> / {t(`product.${product.unit}`)}</span>)}
                </p>
              )}
            </div>

            <div className={lang=='ar' ? "mt-4" : "mt-8"}>
              <h2 className={`${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg' } font-semibold text-brown-800 mb-4`}>{t('product.category')}</h2>
              <div className="flex items-center gap-x-4">
                {product.categories?.map(category => (
                  <Link 
                    key={category.id} 
                    href={'/menu/'+category.url} 
                    className=" shadow rounded-full px-4 py-0.5 bg-brown-100 hover:text-white hover:bg-brown-800 text-brown-800"
                  >
                    <p className={lang=='ar'?'text-sm lg:text-xl font-medium':'text-sm font-medium lg:text-base'}>{lang=== 'en' ? category.name.en : lang==='ar'? category.name.ar : category.name.fr}</p>
                    
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mt-8 lang-ar:mt-6">
              <h2 className={`${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg' } font-semibold text-brown-800`}>{t('product.details')}</h2>
              <div className="w-full mt-2">
                {product.description ? (
                <p className={`text-brown-900 ${lang=='ar' ? 'text-xl lg:text-2xl' : ''}`}>
                  {renderDescription()}
                </p>
                ): (<></>)}
              </div>
            </div>
            {product.unit!=='kg' && product.weight && product.weight >0
            ? (
              <div className={`${lang=='ar' ? 'text-xl lg:text-2xl' : 'text-base' } text-brown-800 mt-4 flex gap-x-2`}>
                <h2 className=" text-brown-800 font-semibold">{t('product.weight')}:</h2>
                <p className=" text-brown-900 font-medium">{parseFloat(product.weight)} {t('product.kg')}</p>
              </div>
            )
            : (<></>)}
            <div className="mt-8 mb-4">
              {['piece','pack'].includes(product.unit)
                ? (
                  <h2 className={`${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg' } font-semibold text-brown-800`}>
                    {t('product.quantity')} {product.unit !== 'pack' && (<span>( {t(`product.${product.unit}`)} )</span>)}
                  </h2>
                ): (
                  <h2 className={`${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg' } font-semibold text-brown-800`}>
                    {product.unit == 'kg' ? t('product.weight'):t('product.volume')} <span className='font-medium'>( {t(`product.${product.unit}`)} )</span>
                  </h2>
                )
              }
            </div>
            <div className="flex gap-8 items-center">
              <div className={`flex items-center justify-center gap-x-2 ${lang=='ar'?'font-adobe text-xl':''}`} dir={lang==='ar'?'rtl':'ltr'}>
                  {['piece','pack'].includes(product.unit)
                  ? (
                      <div className="flex gap-x-1 items-center">
                        <button
                          onClick={()=>setQuantity(quantity-1)}
                          disabled={quantity<1}
                        >
                            <MinusCircleIcon className='text-primary w-8 h-8 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
                        </button>
                        <p className={`text-brown-800 ${lang=='ar' ? 'text-2xl' : 'text-lg'} not-italic font-medium`}>{quantity}</p>
                        <button
                          onClick={()=>setQuantity(quantity+1)}
                        >
                            <PlusCircleIcon className='text-primary w-8 h-8 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
                        </button>
                      </div>  
                  )
                  : (
                      <input 
                          type="number" 
                          step={0.1}
                          name="quantity" 
                          id="quantity" 
                          className="block w-16 mx-1 rounded-lg border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-primary placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-brown-600"
                          value={quantity}
                          onChange={(e)=>setQuantity(parseFloat(e.target.value))}
                      />
                  )}
              </div>
              <button
                  type="button"
                  dir={lang==='ar'?'rtl':'ltr'}
                  onClick={()=>addItem(product)}
                  className="inline-flex justify-center w-full md:w-fit items-center gap-x-4 rounded-full bg-primary px-8 py-2 font-semibold text-white shadow-sm hover:bg-brown-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                  <ShoppingCartIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  <p className={lang=='ar' ? 'text-lg lg:text-xl':'text-sm'}>{t('owl-products.add-cart')}</p>
              </button>
            </div>

            <div className="mt-12">
              <div className={`${showIngredients ? '' : 'border-b border-b-brown-500/50'}`}>
                <button 
                  type="button" onClick={()=>setShowIngredients(!showIngredients)}
                  className="px-2 py-4 rounded-md flex w-full justify-between items-center mb-4 hover:bg-brown-50/70"
                >
                  <h2 className={`text-brown-800 font-semibold ${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg'}` }>
                    {product.unit==='pack'? t('product.composition') : t('product.ingredients')}
                  </h2>
                  {showIngredients
                  ? (<ChevronUpIcon className='w-6 h-6 text-brown-800' />)
                  : (<ChevronDownIcon className='w-6 h-6 text-brown-800' />)
                  }
                </button>
                {showIngredients && (
                <div className="w-full mb-4">
                  {product.description ? (
                  <p className={`text-brown-900 ${lang=='ar' ? 'text-xl lg:text-2xl' : ''}`}>
                    {renderIngredients()}
                  </p>
                  ): (<></>)}
                </div>
                )}
              </div>

              <div className={`mt-2 ${showInstructions ? '' : 'border-b border-b-brown-500/50'}`}>
                <button 
                  type="button" onClick={()=>setShowInstructions(!showInstructions)}
                  className="px-2 py-4 rounded-md flex w-full justify-between items-center mb-4 hover:bg-brown-50/70"
                >
                  <h2 className={`text-brown-800 font-semibold ${lang=='ar' ? 'text-xl lg:text-3xl font-hudhud' : 'text-lg'}` }>{t('product.consumption-instructions')}</h2>
                  {showInstructions
                  ? (<ChevronUpIcon className='w-6 h-6 text-brown-800' />)
                  : (<ChevronDownIcon className='w-6 h-6 text-brown-800' />)
                  }
                </button>
                {showInstructions && (
                <div className="w-full mb-4">
                  {product.description ? (
                  <p className={`text-brown-900 ${lang=='ar' ? 'text-xl lg:text-2xl' : ''}`}>
                    {renderInstructions()}
                  </p>
                  ): (<></>)}
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {related && related.length>0 ? (
          <div className="mt-16">
            <h2 className={`${lang=='ar'?'text-3xl lg:text-6xl' : 'text-2xl lg:text-3xl font-semibold'} text-brown-800 mb-2 mx-4 lg:mx-6`}>{t('product.you-might-like')}</h2>
            <OwlProducts products={related} type={'related'} />
          </div>
        ) : (<></>) }
      </div>
    </div>
    </ClientLayout>
  )
}

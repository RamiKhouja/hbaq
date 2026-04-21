import { Fragment, useState } from 'react'
import { Disclosure, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon, UserIcon, ShoppingCartIcon, XMarkIcon, HeartIcon, GlobeAltIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next';
import Dropdown from '@/Components/Dropdown'
import Footer from '@/Components/Footer';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Cart from '@/Components/Cart';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ServiceModal from '@/Components/ServiceModal';
import SearchBar from '@/Components/SearchBar';
import ProductItem from '@/Components/ProductItem';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ClientLayout({ children, showMain, user, categories, eventCategories, noLimits }) {

  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const cart = useSelector((state) => state.cart.items);
  const likedItems = useSelector((state) => state.liked.items);

  const changeLanguage = (lang) => {
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  }

  const isPath = (path) => {
    const regex = new RegExp(`^${path}`);
    return regex.test(window.location.pathname);
  }

  const [cartOpen, setCartOpen] = useState(false)
  const [openSearch, setOpenSearch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [logoImg, setILogoImg] = useState('/pictures/logo.png');
  const [logoVisibility, setLogoVisibility] = useState(window.location.pathname==='/' ? 'lg:hidden': 'lg:block');
  const [bannerVisibility, setBannerVisibility] = useState(window.location.pathname==='/' ? 'lg:block': 'lg:hidden');
  const [searchVisible, setSearchVisible] = useState(window.location.pathname==='/');
  const [topMain, setTopMain] = useState(window.location.pathname==='/' ? 'lg:top-[380px]':'lg:top-[272px]');
  const [subHeaderTop, setSubHeaderTop] = useState(window.location.pathname==='/' ? 'lg:mt-48':'');
  const [hasShadow, setHasShadow] = useState(window.location.pathname==='/' ? 'shadow lg:shadow-none lg:top-12':'shadow top-0');

  useEffect(() => {
    const handleScroll = () => {
      const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches;
      if(isLargeScreen && (window.location.pathname==='/')) {
        if (window.scrollY > 200) {
          setLogoVisibility('lg:block');
          setBannerVisibility('lg:hidden');
          setSearchVisible(false);
          setTopMain('lg:top-[272px]');
          setSubHeaderTop('');
          setHasShadow('shadow top-0');
        } else {
          setLogoVisibility('lg:hidden');
          setBannerVisibility('lg:block');
          setSearchVisible(true);
          setTopMain('lg:top-[380px]');
          setSubHeaderTop('lg:mt-48');
          setHasShadow('shadow lg:shadow-none lg:top-12');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
      <div className={`min-h-full ${lang==='ar' ? 'font-adobe' : 'font-nanum italic font-medium'}`}>
        <div className={`w-full hidden ${bannerVisibility} bg-brown-800 text-center py-2 z-50 fixed`}>
          <p className='text-white text-2xl font-medium font-adobe'>{t("orders-accepted-12-hours")}</p>
        </div>
        <Disclosure as="nav" className={`bg-white fixed lg:hidden z-40 w-full ${hasShadow} ${lang==='ar' ? 'font-layla-thuluth' :''}`}>
          {({ open }) => (
            <>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
                <div className="flex h-[72px] lg:h-20 items-center justify-between">
                  <div className={`lg:hidden z-10`}>
                    <Link href={'/'}>
                      <div className="flex-shrink-0">
                        <img
                          className="h-12"
                          src={logoImg}
                          alt="Twin Peaks"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="-mr-2 flex lg:hidden">
                    <SearchBar visibility={false} type="mobile" />
                    <Dropdown>
                      <Dropdown.Trigger>
                        <button
                            type="button"
                            className="mt-2 text-primary hover:text-brown-800  focus:outline-none relative ml-2"
                        >
                          <span className="absolute -inset-1.5" />
                          {likedItems && likedItems.length>0 && (
                            <div className="absolute bg-primary ring-1 ring-white rounded-full -top-0.5 -right-0.5 w-2 h-2  flex justify-center items-center">
                            </div>
                          )}
                          <HeartIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </Dropdown.Trigger>
                      {likedItems && likedItems.length > 0 && (
                      <Dropdown.Content type={"liked"}>
                        {likedItems?.map(item => (
                          <div 
                            key={item.product.id}
                            className={
                              ` ${i18n.language==='ar' ? 'text-right' : 'text-left'} block w-full px-4 py-2 leading-5 text-brown-800 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out`
                            }
                          >
                            <ProductItem product={item.product} />
                          </div>
                        ))}
                      </Dropdown.Content>
                      )}
                    </Dropdown>
                    <button
                      type="button"
                      onClick={()=>setCartOpen(true)}
                      className="relative rounded-full text-primary mx-4 p-1 hover:text-brown-600 focus:outline-none"
                    >
                      <span className="sr-only">View cart</span>
                      {cart && cart.length>0 && (
                          <div className="absolute bg-primary ring-2 ring-white rounded-full -top-1 -right-1.5 w-5 h-5 flex justify-center items-center">
                            <span className='text-white text-xs font-semibold'>{cart.length}</span>
                          </div>
                      )}
                      <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-primary hover:text-brown-600 focus:outline-none">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className={`space-y-3 px-4 pb-3 pt-2 sm:px-3 ${lang==='ar'?'text-2xl':'text-sm'}`} dir={lang==='ar' ? 'rtl' : 'ltr'}>
                  <Link href={'/'} className={'text-primary block px-3 pb-3 font-medium border-b border-b-brown-500'}>
                    {t('navigation.home')}
                  </Link>
                  <Link href={'/menu'} className={'text-primary block px-3 pb-3 font-medium border-b border-b-brown-500'}>
                    {t('navigation.shop')}
                  </Link>
                  <Link href={'/about'} className={'text-primary block px-3 pb-3 font-medium border-b border-b-brown-500'}>
                    {t('navigation.about')}
                  </Link>
                  <Link href={'/services'} className={'text-primary block rounded-md px-3 font-medium'}>
                    {t('navigation.services')}
                  </Link>
                </div>
                <div className="border-t border-brown-400 pb-3 pt-4" dir={lang==='ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="mx-3">
                      <div className="text-base font-medium text-primary">{user?.firstname} {user?.lastname}</div>
                    </div>
                    <div className={`${lang === 'ar' ? 'mr-auto' : 'ml-auto'} flex-shrink-0 flex items-center`}>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button
                            type="button"
                            className="relative flex items-center text-primary hover:text-brown-800 focus:outline-none"
                          >
                            <GlobeAltIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                            <p className={`${lang=='ar' ? 'text-xl mb-1.5' : 'text-base'} font-medium`}>
                              {lang==='ar' ? ('عربية') : lang==='en' ? ('English') : ('Français')}
                            </p>
                            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </Dropdown.Trigger>
                          <Dropdown.Content>
                            <Dropdown.Link onClick={()=>changeLanguage('en')} as="button" >
                              English
                            </Dropdown.Link>
                            <Dropdown.Link onClick={()=>changeLanguage('fr')} as="button">
                              Français
                            </Dropdown.Link>
                            <Dropdown.Link onClick={()=>changeLanguage('ar')} as="button">
                              عربي
                            </Dropdown.Link>
                        </Dropdown.Content>
                      </Dropdown>
                    </div>
                  </div>
                  {user
                  ? (
                  <div className="mt-3 space-y-1 px-2 text-base">
                    <Dropdown.Link 
                      href={route('profile.edit')}
                      className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                      {t('navigation.profile')}
                    </Dropdown.Link>
                    <Dropdown.Link 
                      href={route('orders.history')}
                      className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                      {t('navigation.my-orders')}
                    </Dropdown.Link>
                    <Dropdown.Link 
                      href={route('logout')} method="post" as="button"
                      className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                        {t('navigation.signout')}
                    </Dropdown.Link>
                    
                  </div>
                  ):(
                  <div className="mt-3 space-y-1 px-2 text-base">
                    <Dropdown.Link 
                      href={route('register')}
                      className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                      {t('navigation.register')}
                    </Dropdown.Link>
                    <Dropdown.Link 
                      href={route('login')}
                      className="block rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                      {t('navigation.login')}
                    </Dropdown.Link>
                  </div>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div className={`bg-white hidden lg:block lg:fixed z-40 w-full ${hasShadow} ${lang==='ar' ? 'font-layla-thuluth' :''}`}>
        <div className="relative w-full">
          <div className='mx-auto px-4 sm:px-6 lg:px-8 relative'>
            <div className="flex h-[72px] lg:h-20 items-center justify-between">
              <div className="flex items-center">
                <div className="hidden lg:block">
                  <div className="mx-10 flex items-baseline gap-x-4">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <button
                          type="button"
                          className="relative flex items-center text-primary hover:text-brown-800 focus:outline-none"
                        >
                          <GlobeAltIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                          <p className={`${lang=='ar' ? 'text-xl mb-1.5' : 'text-base'} font-medium`}>
                            {lang==='ar' ? ('عربية') : lang==='en' ? ('English') : ('Français')}
                          </p>
                          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </Dropdown.Trigger>
                        <Dropdown.Content width='36'>
                          <Dropdown.Link  className='hover:bg-brown-100/50 font-medium font-layla-thuluth text-xl' onClick={()=>changeLanguage('ar')} as="button">
                            عربية
                          </Dropdown.Link>
                          <Dropdown.Link className='hover:bg-brown-100/50 font-medium font-nanum' onClick={()=>changeLanguage('en')} as="button" >
                            English
                          </Dropdown.Link>
                          <Dropdown.Link className='hover:bg-brown-100/50 font-medium font-nanum' onClick={()=>changeLanguage('fr')} as="button">
                            Français
                          </Dropdown.Link>
                      </Dropdown.Content>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div className={`hidden ${logoVisibility} `}>
                <div className="flex items-center justify-center gap-x-6" dir={lang==='ar' ? 'rtl' : 'ltr'}>
                  <div className='group'>
                    <button className={` nav-link-top-${lang} flex items-center gap-x-1 focus:outline-none`}>
                      <p className={`${window.location.pathname === '/' ? 'current-link' : ''}`}>
                          {t('navigation.categories')}
                      </p>
                      <ChevronDownIcon aria-hidden="true" className="size-5 lang-ar:mt-2" />
                    </button>
                    <div className="absolute left-0 top-full w-full bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="mx-auto grid max-w-7xl grid-cols-5 gap-x-16 px-6 py-10 lg:px-8 ">
                        {categories?.map(category => (
                          <Link href={`/menu/${category.url}`} key={category.id} className='group'>
                          <div className='text-center'>
                              <img src={`/${category.image}`} className='w-full mx-auto group-hover:shadow-xl aspect-square rounded-2xl object-cover' alt="" />
                              <p className='mt-4 lg:mt-6 text-xl lang-ar:text-3xl text-primary cursor-pointer font-semibold lang-ar:font-medium group-hover:text-primary'>
                              {i18n.language === 'en' ? category?.name?.en : i18n.language === 'fr' ? category?.name?.fr : category?.name?.ar}
                              </p>
                          </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href={'/'} className={`nav-link-top-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
                      {t('navigation.mesmia-salon')}
                  </Link>
                  <Link href={'/'}>
                    <div className="mx-8">
                      <img
                        className='h-12'
                        src={logoImg}
                        alt="Mesmia"
                      />
                    </div>
                  </Link>
                  <div className='group'>
                    <button className={`nav-link-top-${lang} flex items-center gap-x-1 focus:outline-none`}>
                      <p className={`${window.location.pathname === '/' ? 'current-link' : ''}`}>
                          {t('navigation.special-occasion')}
                      </p>
                      <ChevronDownIcon aria-hidden="true" className="size-5  lang-ar:mt-2" />
                    </button>
                    <div className="absolute left-0 top-full w-full bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="mx-auto grid max-w-7xl grid-cols-5 gap-x-16 px-6 py-10 lg:px-8 ">
                        {eventCategories?.map(category => (
                          <Link href={`/occasion/${category.url}`} key={category.id} className='group'>
                          <div className='text-center'>
                              <img src={`/${category.image}`} className='w-full mx-auto group-hover:shadow-xl aspect-square rounded-2xl object-cover' alt="" />
                              <p className='mt-4 lg:mt-6 text-xl lang-ar:text-3xl text-primary cursor-pointer font-semibold lang-ar:font-medium group-hover:text-primary'>
                              {i18n.language === 'en' ? category?.name?.en : i18n.language === 'fr' ? category?.name?.fr : category?.name?.ar}
                              </p>
                          </div>
                          </Link>
                        ))}
                        <div className="col-span-2 flex flex-col justify-center">
                          <div className="text-center">
                            <p className="text-2xl max-w-72 mx-auto lang-ar:text-4xl lang-ar:font-layla-thuluth text-brown-800 font-semibold mb-4">
                              {t('navigation.special-occasion-title')}
                            </p>
                            <p className="text-base lang-ar:text-xl lang-ar:font-layla-thuluth text-brown-800 font-normal">
                              {t('navigation.special-occasion-description')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href={'/'} className={`nav-link-top-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
                      {t('navigation.discounts')}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center md:ml-6 gap-x-6">
                  <button
                    type="button"
                    onClick={()=>setOpenSearch(!openSearch)}
                    className="hidden md:block lg:hidden relative rounded-full bg-primary py-1 px-1.5 text-brown-200 hover:text-white focus:outline-none focus:ring-offset-primary"
                  >
                    <span className="absolute -inset-1.5" />
                    <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  

                  <SearchBar visibility={searchVisible} />
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button
                          type="button"
                          className="mt-1 text-primary hover:text-brown-800  focus:outline-none"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <UserIcon className='h-5 w-5 2xl:h-6 2xl:w-6' />
                      </button>
                    </Dropdown.Trigger>
                    {user
                    ? (
                      <Dropdown.Content type={"profile"}>
                        <p className='text-base text-gray-800 font-semibold px-4 pt-2 pb-3'>
                          {user?.firstname} {user?.lastname}
                        </p>
                        {/* <Dropdown.Link href={route('profile.edit')}>
                          {t('navigation.profile')}
                        </Dropdown.Link> */}
                        <Dropdown.Link href={route('orders.history')}>
                          {t('navigation.my-orders')}
                        </Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                          {t('navigation.signout')}
                        </Dropdown.Link>
                    </Dropdown.Content>
                    )
                    : (
                      <Dropdown.Content>
                        <Dropdown.Link href={route('login')}>
                          {t('navigation.login')}
                        </Dropdown.Link>
                        <Dropdown.Link href={route('register')}>
                          {t('navigation.register')}
                        </Dropdown.Link>
                    </Dropdown.Content>
                    )}
                    
                  </Dropdown>
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button
                          type="button"
                          className="mt-1 text-primary hover:text-brown-800  focus:outline-none relative"
                      >
                        <span className="absolute -inset-1.5" />
                        {likedItems && likedItems.length>0 && (
                          <div className="absolute bg-primary ring-1 ring-white rounded-full -top-0.5 -right-0.5 w-2 h-2  flex justify-center items-center">
                          </div>
                        )}
                        <HeartIcon className="h-5 w-5 2xl:h-6 2xl:w-6" aria-hidden="true" />
                      </button>
                    </Dropdown.Trigger>
                    {likedItems && likedItems.length > 0 && (
                    <Dropdown.Content type={"liked"}>
                      {likedItems?.map(item => (
                        <div 
                          key={item.product.id}
                          className={
                            ` ${i18n.language==='ar' ? 'text-right' : 'text-left'} block w-full px-4 py-2 leading-5 text-brown-800 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out`
                          }
                        >
                          <ProductItem product={item.product} />
                        </div>
                      ))}
                    </Dropdown.Content>
                    )}
                  </Dropdown>
                  {/* <button
                    type="button"
                    // onClick={()=>setCartOpen(true)}
                    className={`relative text-primary hover:text-brown-800  focus:outline-none`}
                  >
                    <HeartIcon className="h-5 w-5 2xl:h-6 2xl:w-6" aria-hidden="true" />
                  </button> */}
                  <button
                    type="button"
                    onClick={()=>setCartOpen(true)}
                    className={`relative text-primary hover:text-brown-600  focus:outline-none`}
                  >
                    {cart && cart.length>0 && (
                      <div className="absolute bg-primary ring-2 ring-white rounded-full -top-2 -right-2 w-4 h-4 2xl:w-5 2xl:h-5  flex justify-center items-center">
                        <span className='text-white text-base font-adobe font-semibold'>{cart.length}</span>
                      </div>
                    )}
                    <ShoppingCartIcon className="h-5 w-5 2xl:h-6 2xl:w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className={`bg-white py-8 hidden lg:absolute lg:top-28 w-full ${bannerVisibility} ${lang==='ar' ? 'font-layla-thuluth' :''}`}>
          <div className="flex pb-12 justify-center">
            <img src={'/pictures/main-logo.png'} alt="Mesmia" className='h-32 z-40'/>
          </div>
          <div className="mx-auto flex items-center justify-center gap-x-12 text-4xl" dir={lang==='ar' ? 'rtl' : 'ltr'}>
            <Link href={'/'} className={`nav-link-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
              {t('navigation.categories')}
            </Link>
            <Link href={'/'} className={`nav-link-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
                {t('navigation.special-occasion')}
            </Link>
            <Link href={'/'} className={`nav-link-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
                {t('navigation.discounts')}
            </Link>
            <Link href={'/'} className={`nav-link-${lang} ${window.location.pathname === '/' ? 'current-link' : ''}`}>
                {t('navigation.mesmia-salon')}
            </Link>
          </div>
        </div>
        <Cart open={cartOpen} setOpen={setCartOpen} cart={cart} />
        <main className={`absolute top-14 ${window.location.pathname=='/' ? topMain : ''} w-full`}>
          <ServiceModal open={modalOpen} setOpen={setModalOpen} user={user} />
          <div className={`mx-auto py-4 ${!showMain && !noLimits && 'sm:px-6 lg:px-8 max-w-7xl'}`}>
            {children}
          </div>
          <Footer/>
        </main>
      </div>
  )
}

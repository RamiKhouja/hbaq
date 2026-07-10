import { Fragment, useState } from 'react'
import { Search, ShoppingCart, User, Leaf } from 'lucide-react';
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

  // const isPath = (path) => {
  //   const regex = new RegExp(`^${path}`);
  //   return regex.test(window.location.pathname);
  // }

  const [cartOpen, setCartOpen] = useState(false)
  const [openSearch, setOpenSearch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [logoImg] = useState('/pictures/hbaq-logo.png');
  const [searchVisible] = useState(window.location.pathname==='/');
  
  return (
      <div className={`min-h-full ${lang==='ar' ? 'font-naskh' : 'font-noto'}`}>
        <header className="hidden z-40 w-full top-0 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
            <div className="min-w-0 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm sm:h-11 sm:w-11">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">Hbaq | حبق</p>
                <p className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">Organic Grocery Store</p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
              <a href="#" className="transition hover:text-green-700">Home</a>
              <a href="#categories" className="transition hover:text-green-700">Categories</a>
              <a href="#products" className="transition hover:text-green-700">Shop</a>
              <a href="#wholesale" className="transition hover:text-green-700">Wholesale</a>
              <a href="#about" className="transition hover:text-green-700">About</a>
              <a href="#contact" className="transition hover:text-green-700">Contact</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:border-green-600 hover:text-green-700 sm:p-3">
                <Search className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:border-green-600 hover:text-green-700 sm:p-3">
                <User className="h-4 w-4" />
              </button>
              <button className="relative rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:border-green-600 hover:text-green-700 sm:p-3">
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">2</span>
              </button>
            </div>

            <nav className="-mx-1 flex w-full gap-2 overflow-x-auto px-1 pb-1 text-sm font-medium text-slate-600 lg:hidden">
              <a href="#" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">Home</a>
              <a href="#categories" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">Categories</a>
              <a href="#products" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">Shop</a>
              <a href="#wholesale" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">Wholesale</a>
              <a href="#about" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">About</a>
              <a href="#contact" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-green-600 hover:text-green-700">Contact</a>
            </nav>
          </div>
        </header>
        <Disclosure as="nav" className={`bg-white fixed lg:hidden z-40 w-full`}>
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
                          alt="Hbaq"
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
                      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
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
                      <User className="h-6 w-6 text-primary" aria-hidden="true" />
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
        <div className={`bg-white hidden lg:block lg:fixed z-40 w-full`}>
        <div className="relative w-full">
          <div className='mx-auto px-4 sm:px-6 lg:px-8 relative'>
            <div className="flex h-[72px] lg:h-20 items-center justify-between">
              <Link href={'/'} className="flex shrink-0 items-center">
                <img
                  className="h-12 w-auto"
                  src={logoImg}
                  alt="Hbaq"
                />
              </Link>
              <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex" dir={lang==='ar' ? 'rtl' : 'ltr'}>
                <a href="#" className="transition hover:text-green-700">Home</a>
                <a href="#categories" className="transition hover:text-green-700">Categories</a>
                <Link href="/shop" className="transition hover:text-green-700">Shop</Link>
                <Link href="/gift-packs" className="transition hover:text-green-700">Gift Packs</Link>
                <a href="#wholesale" className="transition hover:text-green-700">Wholesale</a>
                <a href="#about" className="transition hover:text-green-700">About</a>
                <a href="#contact" className="transition hover:text-green-700">Contact</a>
              </nav>
              <div className="hidden lg:block">
                <div className="flex items-center md:ml-6 gap-x-6">
                  <button
                    type="button"
                    onClick={()=>setOpenSearch(!openSearch)}
                    className="hidden md:block lg:hidden relative rounded-full bg-primary py-1 px-1.5 text-brown-200 hover:text-white focus:outline-none focus:ring-offset-primary"
                  >
                    <span className="absolute -inset-1.5" />
                    <Search className="h-6 w-6" aria-hidden="true" />
                  </button>
                  

                  <SearchBar visibility={searchVisible} />
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button
                        type="button"
                        className="relative mt-1 text-primary hover:text-brown-800 focus:outline-none"
                      >
                        <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
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
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button
                          type="button"
                          className="mt-1 text-primary hover:text-brown-800  focus:outline-none"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <User className='h-5 w-5 2xl:h-6 2xl:w-6' />
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
                    <ShoppingCart className="h-5 w-5 2xl:h-6 2xl:w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <Cart open={cartOpen} setOpen={setCartOpen} cart={cart} />
        <main className={`absolute top-14 w-full`}>
          <ServiceModal open={modalOpen} setOpen={setModalOpen} user={user} />
          <div className={`mx-auto py-4 ${!showMain && !noLimits && 'sm:px-6 lg:px-8 max-w-full'}`}>
            {children}
          </div>
          <Footer/>
        </main>
      </div>
  )
}

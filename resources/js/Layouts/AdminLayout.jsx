import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon, BellIcon, UsersIcon, UserGroupIcon, XMarkIcon, TagIcon,
  Square3Stack3DIcon, EnvelopeIcon, ShoppingBagIcon, MegaphoneIcon,
  CalendarDaysIcon, PencilSquareIcon, ChatBubbleOvalLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from '@inertiajs/react'
import Dropdown from '@/Components/Dropdown'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '@/redux/orderSlice'
import axios from 'axios'
import { fetchUnreadContacts, markAllAsRead } from '@/redux/messageSlice'
import { fetchUnreadRequests } from '@/redux/requestSlice'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminLayout({ children, user }) {
  const [isMuted, setIsMuted] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isPath = (path) => {
    const regex = new RegExp(`^${path}`);
    return regex.test(window.location.pathname);
  }

  const orders = useSelector((state) => state.orders.list);
  const previousOrderCountRef = useRef(orders.length);
  const audioRef = useRef(null);

  const unreadMessages = useSelector((state) => state.contacts.unread);
  const unreadRequests = useSelector((state) => state.requests.unread);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUnreadContacts());
    dispatch(fetchUnreadRequests());
    dispatch(fetchOrders({ id: user.id, role: user.role })); 
    const interval = setInterval(() => {
      dispatch(fetchOrders({ id: user.id, role: user.role }));
      dispatch(fetchUnreadContacts());
      dispatch(fetchUnreadRequests());
    }, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, [dispatch]);

  const changeLanguage = () => {
    if(i18n.language==='en') {
      localStorage.setItem('lang', 'ar');
      i18n.changeLanguage('ar');
    }else{
      localStorage.setItem('lang', 'en');
      i18n.changeLanguage('en');
    }
  }

  // useEffect(() => {
  //   if (previousOrderCountRef.current < orders.length) {
  //     setIsMuted(false);
  //     audioRef.current?.play().catch(err => {
  //       console.warn("Sound failed (maybe user hasn't interacted yet):", err);
  //     });
  //     const muteInterval = setInterval(() => {
  //       setIsMuted(true);
  //     }, 3000);
  //     return () => clearInterval(muteInterval);
  //   }
  //   previousOrderCountRef.current = orders.length;
  // }, [orders]);

  const { t, i18n } = useTranslation();

  const hasRole = (roles) => {
    return roles.includes(user.role);
  };

  const [navigation, setNavigation] = useState([]);
  useEffect(() => {
    setNavigation([
      { id: 1, name: t('admin.navigation.team'), visible: hasRole(['admin']), href: '/admin/team/users', icon: UsersIcon, current: false||isPath('/admin/team/*'), open: false||isPath('/admin/team/*')},
      { id: 2, name: t('admin.navigation.categories'), visible: hasRole(['admin', 'staff']), href: '/admin/catalog/categories', icon: Square3Stack3DIcon, current: false||isPath('/admin/catalog/categories/*') },
      { id: 3, name: t('admin.navigation.products'), visible: hasRole(['admin', 'staff']), href: '/admin/catalog/products', icon: TagIcon, current: false||isPath('/admin/catalog/products/*')},
      { id: 4, name: t('admin.navigation.customers'), visible: hasRole(['admin']), href: '/admin/clients/customers', icon: UserGroupIcon, current: false||isPath('/admin/clients/customers/*') },
      { id: 5, name: t('admin.navigation.orders'), visible: hasRole(['admin', 'staff', 'delivery']), href: '/admin/sales/orders', icon: ShoppingBagIcon, current: false||isPath('/admin/sales/orders/*') },
      // { id: 6, name: t('admin.navigation.services'), visible: hasRole(['admin']), href: '/admin/services', icon: MegaphoneIcon, current: false||isPath('/admin/services/*') },
      // { id: 7, name: t('admin.navigation.requests'), visible: hasRole(['admin']), href: '/admin/requests', icon: CalendarDaysIcon, current: false||isPath('/admin/requests/*') },
      { id: 8, name: t('admin.navigation.messages'), visible: hasRole(['admin']), href: '/admin/contacts', icon: EnvelopeIcon, current: false||isPath('/admin/contacts/*') },
      { id: 9, name: t('admin.navigation.about'), visible: hasRole(['admin']), href: '/admin/about', icon: PencilSquareIcon, current: false||isPath('/admin/about/*') },
      // { id: 10, name: t('admin.navigation.ceo'), visible: hasRole(['admin']), href: '/admin/ceo/create', icon: UserCircleIcon, current: false||isPath('/admin/ceo/*') },
      // { id: 11, name: t('admin.navigation.testimonials'), visible: hasRole(['admin']), href: '/admin/testimonials', icon: ChatBubbleOvalLeftEllipsisIcon, current: false||isPath('/admin/testimonials/*') },
    ]);
  }, [i18n.language]);

  const handleItemClick = (id) => {
    const updatedNavigation = navigation.map(item => {
      if (item.id === id) {
        if(item.open)
          return { ...item, open: false };
        else
          return { ...item, open: true };
      } else {
        return { ...item, open: false };
      }
    });
    setNavigation(updatedNavigation);
  };

  return (
    <>
      <div dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-brown-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-brown-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/pictures/logo-white.png"
                        alt="Twin Peaks"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                              if(item.visible) {
                                if(item.children)
                                return (
                                  <li key={item.id}>
                                    <button type="button" className={classNames(item.current ? 'bg-primary text-white' : 'text-white hover:text-white hover:bg-brown-800','group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full justify-between')}  
                                      onClick={() => handleItemClick(item.id)}>
                                        <div className="flex gap-x-3">
                                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                          {item.name}
                                        </div>
                                        <ChevronDownIcon className='h-6 w-6'/>
                                    </button>
                                    <ul id="dropdown-example" className={`${!item.open && ('hidden')} py-2 pl-8 mt-1 space-y-2 bg-primary rounded-lg`}>
                                      {item.children.map((child) => (
                                        <li key={child.id}>
                                          <Link
                                            href={child.href}
                                            className={classNames(
                                              child.current
                                                ? 'bg-primary text-white'
                                                : 'text-white hover:text-white hover:bg-brown-800',
                                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            )}
                                          >
                                            <child.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                            {child.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                </li>
                                )
                                else return (
                                  <li key={item.id}>
                                    <Link
                                      href={item.href}
                                      className={classNames(
                                        item.current
                                          ? 'bg-primary text-white'
                                          : 'text-white hover:text-white hover:bg-brown-800',
                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                      )}
                                    >
                                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                      {item.name}
                                      {item.id == 5 && orders && orders.length>0 && (
                                        <div className="p-1 rounded-full justify-end bg-red-700 text-white">
                                          <p className="text-sm font-medium">{orders.length}</p>
                                        </div>
                                      )}
                                      {item.id == 8 && unreadMessages && unreadMessages.length>0 && (
                                        <div className="p-1 rounded-full justify-end bg-red-700 text-white">
                                          <p className="text-sm font-medium">{unreadMessages.length}</p>
                                        </div>
                                      )}
                                    </Link>
                                  </li>
                                )
                              }
                            })}
                            
                          </ul>
                        </li>
                        
                        <li className="mt-auto">
                        <div
                          className="flex gap-x-3 items-center text-sm  text-gray-300"
                        >
                          <img src='/pictures/global/innovega.png' className='h-5 -mt-1 opacity-80' alt='Innovega Logo' />
                          Powered by Innovega
                        </div>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-brown-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center w-full">
              <img
                className="h-8 mx-auto w-auto"
                src="/pictures/logo-white.png"
                alt="Mesmia Logo"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                    if(item.visible)
                      if(item.children)
                      return (
                        <li key={item.id}>
                          <button type="button" className={classNames(item.current ? 'bg-primary text-white' : 'text-brown-400 hover:text-white hover:bg-brown-800','group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full justify-between')}  
                            onClick={() => handleItemClick(item.id)}>
                              <div className="flex gap-x-3">
                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                {item.name}
                                {/* {item.id==4 && isPending && (
                                  <BellAlertIcon className="text-red-600 w-4 h-4"></BellAlertIcon>
                                )} */}
                              </div>
                              <ChevronDownIcon className='h-6 w-6'/>
                          </button>
                          <ul id="dropdown-example" className={`${!item.open && ('hidden')} py-2 px-8 mt-1 space-y-2 bg-primary rounded-lg`}>
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={classNames(
                                    child.current
                                      ? 'bg-primary text-white'
                                      : 'text-brown-400 hover:text-white hover:bg-brown-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <child.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                      </li>
                      )
                      else return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-primary text-white'
                                : 'text-white hover:text-white hover:bg-brown-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                            {item.id == 5 && orders && orders.length>0 && (
                              <div className="w-full flex flex-row-reverse">
                                <div className="p-1 text-center rounded-full w-7 h-7 bg-red-700 text-white flex flex-col justify-center">
                                  <p className="text-sm font-medium">{orders.length}</p>
                                </div>
                              </div>
                            )}
                            {item.id == 7 && unreadRequests && unreadRequests.length>0 && (
                              <div className="w-full flex flex-row-reverse">
                                <div className="p-1 text-center rounded-full w-7 h-7 bg-red-700 text-white flex flex-col justify-center">
                                  <p className="text-sm font-medium">{unreadRequests.length}</p>
                                </div>
                              </div>
                            )}
                            {item.id == 8 && unreadMessages && unreadMessages.length>0 && (
                              <div className="w-full flex flex-row-reverse">
                                <div className="p-1 text-center rounded-full w-7 h-7 bg-red-700 text-white flex flex-col justify-center">
                                  <p className="text-sm font-medium">{unreadMessages.length}</p>
                                </div>
                              </div>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                    
                  </ul>
                </li>
                <li className="mt-auto">
                  <div
                    className="flex gap-x-3 items-center text-sm  text-gray-300"
                  >
                    <img src='/pictures/global/innovega.png' className='h-5 -mt-1 opacity-80' alt='Innovega Logo' />
                    <p>Powered by <a href='http://innovega.tn' target='_blank' className='hover:text-white'>Innovega</a></p>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={i18n.language==='ar' ? 'lg:pr-72' : 'lg:pl-72'}>
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-brown-900/10 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              {/* <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  {t('admin.navigation.search')}
                </label>
                <MagnifyingGlassIcon
                  className={`pointer-events-none absolute inset-y-0 h-full w-5 text-white ${i18n.language=='ar'?'right-0':'left-0'}`}
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className={`block h-full w-full border-0 py-0 text-gray-900 placeholder:text-white focus:ring-0 sm:text-sm ${i18n.language=='ar'?'pl-0 pr-8':'pl-8 pr-0'}`}
                  placeholder={t('admin.navigation.search')}
                  type="search"
                  name="search"
                />
              </form> */}
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  onClick={()=>changeLanguage()}
                  className="-m-2.5 p-2.5 text-gray-600 hover:text-gray-500"
                >
                  <p>{i18n.language==='ar' ? ('English') : ('عربي')}</p>
                </button>
                <button type="button" className="-m-2.5 p-2.5 text-gray-600 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-brown-900/10" aria-hidden="true" />
                  <Dropdown>
                    <Dropdown.Trigger>
                        <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                            >
                                {user?.firstname}

                                <svg
                                    className="ml-2 -mr-0.5 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route('admin.profile.edit')}>{t('admin.navigation.profile')}</Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            {t('admin.navigation.logout')}
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* <audio ref={audioRef} src="/bell.mp3" autoPlay muted preload="auto" /> */}
                {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

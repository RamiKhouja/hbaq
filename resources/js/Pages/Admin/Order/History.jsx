import { useState, useEffect } from 'react'
import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowTopRightOnSquareIcon, BanknotesIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ShowOrder from './Show';
import { BuildingStorefrontIcon, CreditCardIcon, EyeIcon, TruckIcon } from '@heroicons/react/24/solid';
import ShowHistory from './ShowHistory';

export default function History({orders, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [showOrder, setShowOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderUser, setSelectedOrderUser] = useState(null);

//   function deleteBrand( id ) {
//     router.delete(`/admin/catalog/brands/${id}`);
//   }
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { flash } = usePage().props
  useEffect(() => {
    if (flash.success) {
      setIsAlertVisible(true);
      const timeoutId = setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [flash.success]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['orders'] }); // only reload `orders` prop
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{},[orders])

  const handleShowOrder = (order, user) => {
    setSelectedOrder(order);
    setSelectedOrderUser(user);
    setShowOrder(!showOrder);
  }

  const statusColors = {
    pending: "bg-blue-100 text-blue-600",
    paid: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
    canceled: "bg-red-100 text-red-600",
  };

  const phaseColors = {
    pending: "bg-blue-100 text-blue-600",
    serving: "bg-orange-100 text-orange-600",
    delivery: "bg-green-100 text-green-600",
    closed: "bg-gray-100 text-gray-600",
  };
  
  const renderStatus = (status) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-600"; // Default color
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const renderPhase = (phase) => {
    const colorClass = phaseColors[phase] || "bg-gray-100 text-gray-600"; // Default color
    const formattedPhase = phase.charAt(0).toUpperCase() + phase.slice(1); // Capitalize
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        {formattedPhase}
      </span>
    );
  };

  const convertTime = (time) => {
    const tunisTime = new Date(time).toLocaleTimeString('en-TN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Tunis'
    });
    return tunisTime;
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Orders" />
      <div className="px-4 sm:px-6 lg:px-8">
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Order History</h1>
            <p className="mt-2 text-sm text-gray-700">
            List of all orders
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex gap-x-4">
            <Link
              type="button"
              href='/admin/sales/orders'
              className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
            >
              Recent Orders
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'? 'text-right' : 'text-left'}>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">
                    N°
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Phase
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Client
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Total
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Payment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Pick up
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    Time
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders && orders.data.map( (item, index) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{index+1}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{renderPhase(item.phase)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.user 
                          ? (item.user.firstname + ' ' + item.user.lastname)
                          : item.profile
                            ? (item.profile.firstname + ' ' + item.profile.lastname)
                          : ''
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm   text-gray-700">{item.subTotal} dt</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 flex gap-x-2 items-center">
                        {item.payment_method=='credit-card'
                          ? (<CreditCardIcon className='w-4 h-4 text-brown-800' />)
                          : (<BanknotesIcon className='w-4 h-4 text-brown-800' />)
                        }
                        {renderStatus(item.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {item.shipping_method=='delivery' 
                          ? (
                            <div className="flex gap-x-2 items-center text-brown-600">
                              <TruckIcon className='w-4 h-4' />
                              <p>Delivery</p>
                            </div>
                          ) 
                          : (
                            <div className="flex gap-x-2 items-center text-primary">
                              <BuildingStorefrontIcon className='w-4 h-4' />
                              <p>Store</p>
                            </div>
                          )
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700" title={item.created_at.substring(0,10)}>{convertTime(item.created_at)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center">
                        <button
                          type="button"
                          onClick={() => handleShowOrder(item, item.user??item.profile)}
                          className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-sm font-semibold border border-brown-800 text-brown-800 shadow-sm hover:text-white hover:bg-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-800"
                        >
                          <ArrowTopRightOnSquareIcon className='w-4 h-4'/>
                          Show
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
          {orders.links.map((link, index) => (
            <Link
              key={index}
              className={`mr-2 rounded-full ring-1 ring-primary hover:bg-brown-800 hover:text-white ${link.active ? 'bg-primary text-white p-1.5 w-9 text-center' : 'bg-white text-primary px-3 py-1'}`}
              href={link.url}
            >
              {link.label == "&laquo; Previous" ? t('shop.prev') : (link.label=="Next &raquo;" ? t('shop.next') : link.label)}
            </Link>
          ))}
        </div>
      </div>
      <ShowHistory 
        open={showOrder} 
        setOpen={setShowOrder} 
        order={selectedOrder} 
        user={selectedOrderUser}
      />
    </AdminLayout>
  )
}

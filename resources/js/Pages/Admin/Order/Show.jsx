import { 
  Dialog, DialogBackdrop, DialogPanel, DialogTitle
 } from '@headlessui/react'
import { BanknotesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function ShowOrder({open, setOpen, order, user, deliverymen}) {

  const purchases = order ? JSON.parse(order?.purchases) : null;
  const statusColors = {
    pending: "bg-blue-100 text-blue-600",
    preparing: "bg-orange-100 text-orange-600",
    delivering: "bg-purple-100 text-purple-600",
    done: "bg-green-100 text-green-600",
    cancel: "bg-red-100 text-red-600",
    close: "bg-gray-100 text-gray-600",
  };

  const renderStatus = (status) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-600"; // Default color
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize
    return (
      <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs lg:text-sm font-medium ${colorClass}`}>
        {formattedStatus}
      </span>
    );
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const res = await axios.put(`/api/orders/change/${orderId}`, { status: action });
      if (res.data.success) {
        router.visit('/admin/sales/orders', { data: { success: res.data.message } })
      } else {
        router.visit('/admin/sales/orders', { data: { error: res.data.message } });
      }
    } catch (error) {
      router.visit('/admin/sales/orders', { data: { error: error } });
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-screen-sm transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-semibold text-gray-900">Order Details</DialogTitle>
                    {order && order?.shipping_method==='delivery' && (
                      <div className="flex items-center gap-x-2">
                        <img src="/pictures/global/delivery.png" className='w-8 h-8' alt="" />
                        <p className="font-medium text-brown-800 text-lg">Delivery</p>
                      </div>
                    )}
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {order && user && (
                  <div className="mb-4 flex justify-between items-stretch pb-4 border-b border-b-gray-400 mr-4">
                    <div className="flex flex-col justify-between min-h-full flex-1"> {/* First */}
                      <div className='flex gap-x-2 lg:gap-x-4 items-center mb-2'>
                        <p className="text-gray-700 text-sm">Order #{order?.id.toString().padStart(5, '0')}</p>
                        {renderStatus(order.status)}
                      </div>
                      <div className='text-gray-900 text-sm'>
                        <div className="flex items-center gap-x-2">
                          <p>{order.cutlery ? 'Meal voucher (Ticket restaurant)' : 'Pay at delivery'}</p>
                          <BanknotesIcon className='w-5 h-5'/>
                        </div>
                      </div>
                      <p className="text-gray-900">
                        {user?.firstname + ' ' + user?.lastname}
                      </p>
                    </div>
                    <div className="text-gray-900 flex flex-col justify-between gap-y-1 h-full flex-1"> {/* Second */}
                      <div className='flex gap-x-4 items-center justify-end'>
                        <p>Subtotal</p>
                        <p className='text-base font-semibold'>{order.subTotal} DT</p>
                      </div>
                      <div className='flex gap-x-4 items-center justify-end'>
                        <p>Delivery</p>
                        <p className='text-base font-semibold'>{order.delivery??0} DT</p>
                      </div>
                      <div className='flex gap-x-4 items-center justify-end text-lg'>
                        <p>Total</p>
                        <p className='font-semibold'>{order.total} DT</p>
                      </div>
                    </div>
                  </div>
                  )}
                  <div className="mb-4">
                    <ul role="list" className="divide-y divide-gray-200">
                      {purchases?.map((purchase) => purchase.product && (
                        <li key={purchase.product.id} className="pr-6 py-6">
                          <div className="flex items-center sm:items-start">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                              <img
                                src={'/'+purchase.product.main_image}
                                alt={purchase.product.name.en}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className={`ml-6 flex-1 text-sm`}>
                              <div className="font-medium text-gray-900 sm:grid sm:grid-cols-3">
                                <h5 className='lg:text-lg col-span-2'>{purchase.product.name.en}</h5>
                                <p className={`mt-2 sm:mt-0 lg:text-lg text-right`}>Qty : {purchase.quantity}</p>
                              </div>
                              <p className="text-gray-500 mt-1">{purchase.product.price} DT</p>
                              {purchase.product.type === 'custom_pack' && (
                                <div className="mt-3 rounded-lg bg-gray-50 p-3 text-gray-700">
                                  <p><strong>Package:</strong> {purchase.product.package?.name?.en}</p>
                                  <p className="mt-1"><strong>Contents:</strong> {purchase.product.custom_products?.map((product) => `${product.quantity} × ${product.name?.en}`).join(', ')}</p>
                                  {purchase.product.custom_message && <p className="mt-1"><strong>Pack message:</strong> “{purchase.product.custom_message}”</p>}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 text-gray-900 p-4 border border-dashed rounded-lg border-gray-900 grid lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg">Customer Details</p>
                      <p>{user?.firstname} {user?.lastname}</p>
                      <p className="text-gray-700">{user?.email}</p>
                      <p>{user?.phone}</p>
                    </div>
                    <div>
                      <p>&nbsp;</p>
                      <p>{user?.address}</p>
                      <p>{user?.state}, {user?.zip}</p>
                    </div>
                  </div>
                  <div className="my-8 flex flex-row-reverse">
                    <div className='flex flex-wrap gap-4'>
                      {order?.available_actions?.includes('preparing') && (
                        <button
                          className="rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
                          onClick={() => handleOrderAction(order.id, 'preparing')}
                        >
                          Start Preparing
                        </button>
                      )}
                      {order?.available_actions?.includes('delivering') && (
                        <button
                          className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
                          onClick={() => handleOrderAction(order.id, 'delivering')}
                        >
                          Start Delivery
                        </button>
                      )}
                      {order?.available_actions?.includes('done') && (
                        <button
                          className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          onClick={() => handleOrderAction(order.id, 'done')}
                        >
                          Mark as Done
                        </button>
                      )}
                      {order?.available_actions?.includes('close') && (
                        <button
                          className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                          onClick={() => handleOrderAction(order.id, 'close')}
                        >
                          Close Order
                        </button>
                      )}
                      {order?.available_actions?.includes('cancel') && (
                        <button 
                          className='rounded-lg bg-white border-brown-800 border px-3 py-1.5 text-sm font-semibold text-brown-800 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-800'
                          onClick={() => handleOrderAction(order.id, 'cancel')}
                        >
                          Cancel Order
                        </button>
                      )}
                      
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

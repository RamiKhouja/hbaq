import { 
  Dialog, DialogBackdrop, DialogPanel, DialogTitle
 } from '@headlessui/react'
import { BanknotesIcon, DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShowOrder({open, setOpen, order, user, deliverymen, onBill}) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [actionError, setActionError] = useState('');
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    setCurrentOrder(order);
    setActionError('');
  }, [order]);

  const purchases = currentOrder ? JSON.parse(currentOrder?.purchases) : null;
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
    return (
      <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs lg:text-sm font-medium ${colorClass}`}>
        {t(`order.${status}`)}
      </span>
    );
  };

  const handleOrderAction = async (orderId, action) => {
    if (loadingAction) return;

    setLoadingAction(action);
    setActionError('');

    try {
      const res = await axios.put(`/api/orders/change/${orderId}`, { status: action });
      if (res.data.success) {
        setCurrentOrder((existing) => ({ ...existing, ...res.data.order }));
        router.reload({ only: ['orders'], preserveState: true, preserveScroll: true });
      } else {
        setActionError(res.data.message || t('admin.order-show.action-error'));
      }
    } catch (error) {
      setActionError(t('admin.order-show.action-error'));
    } finally {
      setLoadingAction(null);
    }
  };

  const actionContent = (action, label) => loadingAction === action ? (
    <>
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span>{label}</span>
    </>
  ) : label;

  const actionButtonClass = (className) => `inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`;

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
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="pointer-events-auto w-screen max-w-screen-sm transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-semibold text-gray-900">{t('admin.order-show.title')}</DialogTitle>
                    {currentOrder && currentOrder?.shipping_method==='delivery' && (
                      <div className="flex items-center gap-x-2">
                        <img src="/pictures/global/delivery.png" className='w-8 h-8' alt="" />
                        <p className="font-medium text-brown-800 text-lg">{t('admin.order-show.delivery')}</p>
                      </div>
                    )}
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">{t('admin.order-show.close-panel')}</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {currentOrder && user && (
                  <div className="mb-4 flex justify-between items-stretch pb-4 border-b border-b-gray-400 mr-4">
                    <div className="flex flex-col justify-between min-h-full flex-1"> {/* First */}
                      <div className='flex gap-x-2 lg:gap-x-4 items-center mb-2'>
                        <p className="text-gray-700 text-sm">{t('admin.order-show.order')} #{currentOrder?.id.toString().padStart(5, '0')}</p>
                        {renderStatus(currentOrder.status)}
                      </div>
                      <div className='text-gray-900 text-sm'>
                        <div className="flex items-center gap-x-2">
                          <p>{currentOrder.cutlery ? t('admin.order-show.meal-voucher') : t('admin.order-show.cash-delivery')}</p>
                          <BanknotesIcon className='w-5 h-5'/>
                        </div>
                      </div>
                      <p className="text-gray-900">
                        {user?.firstname + ' ' + user?.lastname}
                      </p>
                    </div>
                    <div className="text-gray-900 flex flex-col justify-between gap-y-1 h-full flex-1"> {/* Second */}
                      <div className='flex gap-x-4 items-center justify-end'>
                        <p>{t('admin.order-show.subtotal')}</p>
                        <p className='text-base font-semibold'>{currentOrder.subTotal} {t('order.dt')}</p>
                      </div>
                      <div className='flex gap-x-4 items-center justify-end'>
                        <p>{t('admin.order-show.delivery')}</p>
                        <p className='text-base font-semibold'>{currentOrder.delivery??0} {t('order.dt')}</p>
                      </div>
                      <div className='flex gap-x-4 items-center justify-end text-lg'>
                        <p>{t('admin.order-show.total')}</p>
                        <p className='font-semibold'>{currentOrder.total} {t('order.dt')}</p>
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
                                alt={purchase.product.name?.[lang] || purchase.product.name?.fr || purchase.product.name?.en}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className={`ml-6 flex-1 text-sm`}>
                              <div className="font-medium text-gray-900 sm:grid sm:grid-cols-3">
                                <h5 className='lg:text-lg col-span-2'>{purchase.product.name?.[lang] || purchase.product.name?.fr || purchase.product.name?.en}</h5>
                                <p className={`mt-2 sm:mt-0 lg:text-lg ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{t('admin.order-show.quantity')} : {purchase.quantity}</p>
                              </div>
                              <p className="text-gray-500 mt-1">{purchase.product.price} {t('order.dt')}</p>
                              {purchase.product.type === 'custom_pack' && (
                                <div className="mt-3 rounded-lg bg-gray-50 p-3 text-gray-700">
                                  <p><strong>{t('admin.order-show.package')} :</strong> {purchase.product.package?.name?.[lang] || purchase.product.package?.name?.fr || purchase.product.package?.name?.en}</p>
                                  <p className="mt-1"><strong>{t('admin.order-show.contents')} :</strong> {purchase.product.custom_products?.map((product) => `${product.quantity} × ${product.name?.[lang] || product.name?.fr || product.name?.en}`).join(', ')}</p>
                                  {purchase.product.custom_message && <p className="mt-1"><strong>{t('admin.order-show.pack-message')} :</strong> “{purchase.product.custom_message}”</p>}
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
                      <p className="text-lg">{t('admin.order-show.customer-details')}</p>
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
                      {currentOrder?.available_actions?.includes('preparing') && (
                        <button
                          type="button"
                          disabled={Boolean(loadingAction)}
                          className={actionButtonClass("rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:hover:bg-orange-600")}
                          onClick={() => handleOrderAction(currentOrder.id, 'preparing')}
                        >
                          {actionContent('preparing', t('admin.order-show.start-preparing'))}
                        </button>
                      )}
                      {currentOrder?.available_actions?.includes('delivering') && (
                        <button
                          type="button"
                          disabled={Boolean(loadingAction)}
                          className={actionButtonClass("rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:hover:bg-purple-600")}
                          onClick={() => handleOrderAction(currentOrder.id, 'delivering')}
                        >
                          {actionContent('delivering', t('admin.order-show.start-delivery'))}
                        </button>
                      )}
                      {currentOrder?.available_actions?.includes('done') && (
                        <button
                          type="button"
                          disabled={Boolean(loadingAction)}
                          className={actionButtonClass("rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:hover:bg-green-700")}
                          onClick={() => handleOrderAction(currentOrder.id, 'done')}
                        >
                          {actionContent('done', t('admin.order-show.mark-done'))}
                        </button>
                      )}
                      {currentOrder?.available_actions?.includes('close') && (
                        <button
                          type="button"
                          disabled={Boolean(loadingAction)}
                          className={actionButtonClass("rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:hover:bg-gray-700")}
                          onClick={() => handleOrderAction(currentOrder.id, 'close')}
                        >
                          {actionContent('close', t('admin.order-show.close-order'))}
                        </button>
                      )}
                      {currentOrder?.available_actions?.includes('cancel') && (
                        <button 
                          type="button"
                          disabled={Boolean(loadingAction)}
                          className={actionButtonClass('rounded-lg bg-white border-brown-800 border px-3 py-1.5 text-sm font-semibold text-brown-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-800')}
                          onClick={() => handleOrderAction(currentOrder.id, 'cancel')}
                        >
                          {actionContent('cancel', t('admin.order-show.cancel-order'))}
                        </button>
                      )}
                      {['delivering', 'done'].includes(currentOrder?.status) && (
                        <button
                          type="button"
                          disabled={Boolean(loadingAction)}
                          onClick={() => onBill?.(currentOrder)}
                          className={actionButtonClass('rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary hover:text-white')}
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          {t('admin.order-index.bill')}
                        </button>
                      )}
                      
                    </div>
                  </div>
                  {actionError && <p className="mb-4 text-sm text-red-600">{actionError}</p>}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

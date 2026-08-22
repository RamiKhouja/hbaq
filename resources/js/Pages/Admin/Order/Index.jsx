import { useState, useEffect } from 'react'
import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowTopRightOnSquareIcon, BanknotesIcon, DocumentArrowDownIcon, TicketIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ShowOrder from './Show';
import { BuildingStorefrontIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import axios from 'axios';

export default function Index({orders, deliverymen, auth, filters = {}, nextBillNumber = 1}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [showOrder, setShowOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderUser, setSelectedOrderUser] = useState(null);
  const selectedStatus = filters.status || '';
  const [search, setSearch] = useState(filters.search || '');
  const [billOrder, setBillOrder] = useState(null);
  const [billNumber, setBillNumber] = useState('');
  const [suggestedBillNumber, setSuggestedBillNumber] = useState(nextBillNumber);
  const [assignedBillNumbers, setAssignedBillNumbers] = useState({});
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [billError, setBillError] = useState('');

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

  useEffect(() => {
    setSuggestedBillNumber(nextBillNumber);
  }, [nextBillNumber]);

  const handleShowOrder = (order, user) => {
    setSelectedOrder(order);
    setSelectedOrderUser(user);
    setShowOrder(!showOrder);
  }

  const handleStatusFilter = (event) => {
    const status = event.target.value;

    router.get('/admin/sales/orders', {
      ...(status ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }

  const handleSearch = (event) => {
    event.preventDefault();

    router.get('/admin/sales/orders', {
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }

  const clearSearch = () => {
    setSearch('');
    router.get('/admin/sales/orders', selectedStatus ? { status: selectedStatus } : {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }

  const openBillDialog = (order) => {
    setBillOrder(order);
    setBillNumber(String(assignedBillNumbers[order.id] || order.bill_number || suggestedBillNumber));
    setBillError('');
  }

  const incrementBillNumber = (value) => {
    const match = String(value).match(/^(.*?)(\d+)$/);
    if (!match) return `${value}1`;

    const [, prefix, digits] = match;
    return `${prefix}${String(Number(digits) + 1).padStart(digits.length, '0')}`;
  }

  const handleBillSubmit = async (event, includeApproval = false) => {
    event.preventDefault();
    if (!billOrder || isGeneratingBill) return;

    setIsGeneratingBill(true);
    setBillError('');

    try {
      const response = await axios.post(
        `/admin/sales/orders/${billOrder.id}/bill`,
        { bill_number: billNumber, include_approval: includeApproval },
        { responseType: 'blob' }
      );
      const safeBillNumber = String(billNumber).replace(/[^A-Za-z0-9_-]+/g, '-');
      const pdfFile = new File([response.data], `${safeBillNumber}.pdf`, {
        type: 'application/pdf',
      });
      const pdfUrl = URL.createObjectURL(pdfFile);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = pdfFile.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      setAssignedBillNumbers((current) => ({ ...current, [billOrder.id]: billNumber }));
      setSuggestedBillNumber(incrementBillNumber(billNumber));
      setBillOrder(null);
      router.reload({ only: ['orders', 'nextBillNumber'] });
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      setBillError(t('admin.order-index.bill-error'));
    } finally {
      setIsGeneratingBill(false);
    }
  }

  const statusColors = {
    pending: "bg-blue-100 text-blue-600",
    preparing: "bg-orange-100 text-orange-600",
    delivering: "bg-purple-100 text-purple-600",
    done: "bg-green-100 text-green-700",
    cancel: "bg-red-100 text-red-600",
    close: "bg-gray-100 text-gray-600",
  };
  
  const renderStatus = (status) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-600"; // Default color
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        {t(`order.${status}`)}
      </span>
    );
  };

  const convertTime = (time) => {
    const tunisTime = new Date(time).toLocaleTimeString(lang === 'ar' ? 'ar-TN' : 'fr-TN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Tunis'
    });
    return tunisTime;
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title={t('admin.order-index.title')} />
      <div className="px-4 sm:px-6 lg:px-8">
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">{t('admin.order-index.success')}</p>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <div className="sm:flex sm:items-end sm:justify-between gap-4">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.order-index.title')}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {t('admin.order-index.subtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end">
            <form onSubmit={handleSearch} className="w-full sm:w-80">
              <label htmlFor="order-search" className="block text-sm font-medium text-gray-700">
                {t('admin.order-index.search-label')}
              </label>
              <div className="relative mt-2 flex">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="order-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('admin.order-index.search-placeholder')}
                  className="block w-full rounded-l-md border-gray-300 py-2 pl-10 text-sm shadow-sm focus:border-primary focus:ring-primary"
                />
                {filters.search && (
                  <button type="button" onClick={clearSearch} className="border-y border-gray-300 bg-white px-2 text-gray-500 hover:text-gray-800" aria-label={t('admin.order-index.clear-search')}>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
                <button type="submit" className="rounded-r-md bg-primary px-4 text-sm font-semibold text-white hover:bg-brown-700">
                  {t('admin.order-index.search-button')}
                </button>
              </div>
            </form>
            <div className="w-full sm:w-56">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                {t('admin.order-index.filter-label')}
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={handleStatusFilter}
                className="mt-2 block w-full rounded-md border-gray-300 bg-white py-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">{t('admin.order-index.all-statuses')}</option>
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>{t(`order.${status}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'? 'text-right' : 'text-left'}>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">
                    {t('admin.order-index.order-id')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.status')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.client')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.total')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.payment')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.fulfillment')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.order-index.time')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span >{t('admin.order-index.actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders && orders.data.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">#{item.id.toString().padStart(5, '0')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{renderStatus(item.status)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.user 
                          ? (item.user.firstname + ' ' + item.user.lastname)
                          : item.profile
                            ? (item.profile.firstname + ' ' + item.profile.lastname)
                          : ''
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.subTotal} {t('order.dt')}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 flex gap-x-2 items-center">
                        {item.payment_method=='credit-card'
                          ? (<CreditCardIcon className='w-4 h-4 text-brown-800' />)
                          : item.cutlery
                            ? (<TicketIcon className='w-4 h-4 text-brown-800' />)
                            : (<BanknotesIcon className='w-4 h-4 text-brown-800' />)
                        }
                        {item.cutlery ? t('admin.order-index.meal-voucher') : t('admin.order-index.cash-delivery')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {item.shipping_method=='delivery' 
                          ? (
                            <div className="flex gap-x-2 items-center text-brown-600">
                              <TruckIcon className='w-4 h-4' />
                              <p>{t('admin.order-index.delivery')}</p>
                            </div>
                          ) 
                          : (
                            <div className="flex gap-x-2 items-center text-primary">
                              <BuildingStorefrontIcon className='w-4 h-4' />
                              <p>{t('admin.order-index.store')}</p>
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
                          {t('admin.order-index.show')}
                        </button>
                        {['delivering', 'done'].includes(item.status) && (
                          <button
                            type="button"
                            onClick={() => openBillDialog(item)}
                            className="inline-flex items-center gap-x-1.5 rounded-full border border-primary px-2 py-1 text-sm font-semibold text-primary shadow-sm hover:bg-primary hover:text-white"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            {t('admin.order-index.bill')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders?.data?.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-3 py-10 text-center text-sm text-gray-500">
                        {t('admin.order-index.no-orders')}
                      </td>
                    </tr>
                  )}
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
      <ShowOrder 
        open={showOrder} 
        setOpen={setShowOrder} 
        order={selectedOrder} 
        user={selectedOrderUser}
        deliverymen={deliverymen}
        onBill={openBillDialog}
      />
      <Dialog open={Boolean(billOrder)} onClose={() => setBillOrder(null)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel dir={lang === 'ar' ? 'rtl' : 'ltr'} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {t('admin.order-index.bill-dialog-title')}
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">{t('admin.order-index.bill-dialog-description')}</p>
            {billOrder && (
              <form
                onSubmit={handleBillSubmit}
                className="mt-5"
              >
                <label htmlFor="bill-number" className="block text-sm font-medium text-gray-700">
                  {t('admin.order-index.bill-number')}
                </label>
                <input
                  id="bill-number"
                  name="bill_number"
                  type="text"
                  maxLength="50"
                  required
                  value={billNumber}
                  onChange={(event) => setBillNumber(event.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
                {billError && <p className="mt-2 text-sm text-red-600">{billError}</p>}
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button type="button" disabled={isGeneratingBill} onClick={() => setBillOrder(null)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                    {t('admin.order-index.bill-cancel')}
                  </button>
                  <button type="submit" disabled={isGeneratingBill} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brown-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {isGeneratingBill ? t('admin.order-index.bill-generating') : t('admin.order-index.bill-generate')}
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingBill}
                    onClick={(event) => handleBillSubmit(event, true)}
                    className="rounded-md bg-brown-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brown-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isGeneratingBill ? t('admin.order-index.bill-generating') : t('admin.order-index.bill-generate-signed')}
                  </button>
                </div>
              </form>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </AdminLayout>
  )
}

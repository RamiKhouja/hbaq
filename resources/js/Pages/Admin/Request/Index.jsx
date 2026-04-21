import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { useLayoutEffect, useRef, useState, useEffect, Fragment } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { fetchUnreadRequests, markAllAsRead } from '@/redux/requestSlice';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index({requests, auth}) {

  const dispatch = useDispatch();

  function deleteRequest( id ) {
    router.delete(`/admin/requests/${id}`);
  }

  useEffect(() => {
      dispatch(markAllAsRead());
      dispatch(fetchUnreadRequests());
    }, []);

  const [selectedRequest, setSelectedRequest] = useState();
  const [open, setOpen] = useState(false);

  const {t, i18n} = useTranslation();

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
  }

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

  const handleShow = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  }

  const renderStatus=(status)=> {
    switch (status) {
      case 'pending':
        return(
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Pending
        </span>
        )
        break;
      case 'payed':
        return(
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
          Payed
        </span>
        )
        break;
      case 'canceled':
        return(
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
          Canceled
        </span>
        )
        break;
      case 'advance':
        return(
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          Advance
        </span>
        )
        break;
      default:
        break;
    }
  }

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Requests" />
      {flash.success && isAlertVisible &&
      <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <div>
            <p className="font-bold">Success!</p>
            <p className="text-sm">{flash.success}</p>
          </div>
        </div>
      </div>}
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Service Requests</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t('admin.service.list.list-of-services')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex gap-x-4">
          
          <Link
            type="button"
            href='/admin/services/create'
            className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            {t('admin.service.list.add-service')}
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className={i18n.language=='ar'?'text-right':'text-left'}>
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Email
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Phone
                    </th> 
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Services
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Status
                    </th> 
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      Nb Persons
                    </th>
                    {/* <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                      Total
                    </th> */}
                    {/* <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Method
                    </th>  */}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {requests?.data?.map((request) => (
                    <tr key={request.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.first_name} {request.last_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.services?.map(service => (
                          <p key={service.id}>{service.name.en}</p>
                        ))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {renderStatus(request.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.nb_persons}
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {parseFloat(request.total)} TND
                      </td> */}
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {request.payment_method}
                      </td> */}
                      <td className="py-4 px-4 text-right text-sm font-medium flex gap-x-2 items-center">
                        {/* <button 
                          title='Request Details' className="text-gray-800 hover:text-brown-900"
                          onClick={()=>handleShow(request)}
                        >
                          <EyeIcon className='w-5 h-5'/>
                        </button> */}
                        <Link title="Edit Request" href={`/admin/requests/edit/${request.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button title="Delete Request" type="button" onClick={() => deleteRequest(request.id)} className="text-red-800 hover:text-brown-900">
                          <TrashIcon className='w-5 h-5'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
        {requests.links.map((link, index) => (
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    
                    <div className="mt-2">
                      <p className="text-base text-gray-700">
                      {selectedRequest?.message}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </AdminLayout>
  )
}




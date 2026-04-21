import React, { useState, Fragment } from 'react'
import { router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTranslation } from 'react-i18next';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUnreadContacts, markAllAsRead } from '@/redux/messageSlice';

function del( id ) {
  router.delete(`/admin/contacts/${id}`);
}


export default function Index({contacts, auth}) {

  const dispatch = useDispatch();

  const {t, i18n} = useTranslation();
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
  }

  useEffect(() => {
    dispatch(markAllAsRead());
    dispatch(fetchUnreadContacts());
  }, []);

  const handleShow = (message) => {
    setMessage(message);
    setOpen(true);
  }

  return (
    <AdminLayout user={auth?.user}>
      
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-sm text-gray-500">
            List of messages
          </p>
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
                      Phone
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Email
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Subject
                    </th> 
                    <th scope="col" className="py-3.5 pr-3 text-sm font-semibold text-gray-900">
                      Message
                    </th> 
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contacts?.map((contact) => (
                    <tr key={contact.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {contact.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {contact.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {contact.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {contact.subject}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {truncateString(contact.message, 5)}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-medium flex gap-x-2 items-center">
                      <button 
                          title='Request Details' className="text-gray-800 hover:text-brown-900"
                          onClick={()=>handleShow(contact.message)}
                        >
                          <EyeIcon className='w-5 h-5'/>
                        </button>
                        <button title="delete message" type="button" onClick={() => del(contact.id)} className="text-red-800 hover:text-brown-900">
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
                      {message}
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

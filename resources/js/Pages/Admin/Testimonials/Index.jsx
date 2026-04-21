import { useState, useEffect, Fragment } from 'react'
import { router, Head, Link, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { EyeIcon } from '@heroicons/react/24/solid';
import { Dialog, Switch, Transition } from '@headlessui/react';
import axios from 'axios';

export default function Index({feedbacks, auth}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [testimonials, setTestimonials] = useState([]);

  useEffect(()=>{
    setTestimonials(feedbacks.data);
  },[feedbacks]);

  function deleteTestimonial( id ) {
    router.delete(`/admin/testimonials/${id}`);
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

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    } else {
      return inputString;
    }
  }
  const handleShow = (message) => {
    setMessage(message);
    setOpen(true);
  }

  const handleToggle = async (testimonialId) => {
    try {
      await axios.post(`/admin/testimonials/${testimonialId}/toggle-approval`);
      setTestimonials((prevTestimonials) =>
        prevTestimonials.map((testimonial) =>
          testimonial.id === testimonialId
            ? { ...testimonial, is_approved: !testimonial.is_approved }
            : testimonial
        )
      );
    } catch (error) {
      console.error('Error toggling approval status:', error);
      alert('There was an error updating the approval status.');
    }
  };


  return (
    <AdminLayout user={auth?.user}>
      <Head title="Brands" />
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
            <h1 className="text-base font-semibold leading-6 text-gray-900">{t('admin.brand.list.brands')}</h1>
            <p className="mt-2 text-sm text-gray-700">
            {t('admin.brand.list.list-of-brands')}
            </p>
          </div>
          
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className={lang=='ar'? 'text-right' : 'text-left'}>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">
                    {t('admin.brand.list.picture')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.brand.list.name')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.brand.list.phone')}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                    {t('admin.brand.list.message')}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testimonials && testimonials.map( (item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.picture && (
                          <img src={'/'+item.picture} alt={item.name} className='h-10'/>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{item.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{truncateString(item.message, 7)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex gap-x-2 items-center">
                        <Switch
                          checked={item.is_approved}
                          onChange={() => handleToggle(item.id)}
                          className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brown-600 focus:ring-offset-2 ${
                            item.is_approved ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span className="sr-only">Toggle approval</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              item.is_approved ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </Switch>
                        <button 
                          title='Request Details' className="text-gray-800 hover:text-brown-900"
                          onClick={()=>handleShow(item.message)}
                        >
                          <EyeIcon className='w-5 h-5'/>
                        </button>
                        <button type="button" onClick={() => deleteTestimonial(item.id)} className="text-red-800 hover:text-brown-900">
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
        <div className={`mt-8 flex justify-end`} dir={i18n.language=='ar'?'rtl':'ltr'}>
          {feedbacks.links.map((link, index) => (
            <Link
              key={index}
              className={`mr-2 px-3 py-1 rounded-full ring-1 ring-primary hover:bg-brown-800 hover:text-white ${link.active ? 'bg-primary text-white' : 'bg-white text-primary'}`}
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

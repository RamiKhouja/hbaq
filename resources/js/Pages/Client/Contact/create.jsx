import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { useTranslation } from 'react-i18next';

const CreateContact = () => {
  const { t, i18n } = useTranslation();

    const [contact, setContact] = useState({
      email: '',
      subject: '',
      message: '',
      
    });

    const [isAlertVisible, setIsAlertVisible] = useState(false);
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setContact({
        ...contact,
        [name]: files 
          ? files[0] 
          : e.target.type === 'checkbox' 
            ? e.target.checked 
            : value,
      });
    };
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Use FormData to handle file uploads
      const formData = new FormData();
      formData.append('email', contact.email);
      formData.append('subject', contact.subject);
      formData.append('message', contact.message);
     
      router.post('/contact', formData, {
        forceFormData: true,
      });
    };
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

    return (
      <ClientLayout>
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">{t('contact.success')}</p>
              <p className="text-sm">{t('contact.'+flash.success)}</p>
            </div>
          </div>
        </div>}
        <div className="sm:flex-auto mb-4" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">{t('contact.contact')}</h1>
          <p className="mt-2 text-base text-gray-700">
            {t('contact.send-message')}
          </p>
        </div>
        <form onSubmit={handleSubmit} dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
         
          <div className='md:columns-2 mb-4'>
            <div className='mb-4 md:mb-0'>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                {t('contact.email')}
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder='example@domain.com'
                  value={contact.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                {t('contact.subject')}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="subject"
                  id="name_ar"
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder={t('contact.message-subject')}
                  value={contact.subject}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className='md:columns-1 mb-4'>
            <div className='mb-4 md:mb-0'>
              <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                {t('contact.message')}
              </label>
              
                <textarea
                  rows={4}
                  name="message"
                  id="message"
                  placeholder={t('contact.message-here')}
                  value={contact.message}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              
            </div>
           
          </div>
          
        
          
          <div className="flex flex-row-reverse">
            <button
              type="submit"
              className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-800"
            >
              {t('contact.send')}
            </button>
          </div>
        </form>
      </ClientLayout>
    );
  };
  
  export default CreateContact;
  
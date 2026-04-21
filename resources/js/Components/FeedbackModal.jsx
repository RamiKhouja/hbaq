import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

function FeedbackModal({open, setOpen}) {
  const {t, i18n} = useTranslation();
  const lang=i18n.language;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [feedback, setFeedback] = useState({
    name: '',
    picture: null,
    phone: '',
    message: ''
  });

  useEffect(()=> {
    if(isSubmitted) {
      const timeoutId = setTimeout(() => {
        setOpen(false);
        setFeedback({
          name: '',
          picture: null,
          phone: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  },[isSubmitted])

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If the input is a file input, store the file in the state
    setFeedback((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    handleChange(e);

    // Show preview if an image is selected
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('image-preview').src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(feedback).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios.post('/api/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(()=>setIsSubmitted(true));
  };

  return (
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm lg:max-w-2xl sm:p-6">
                {isSubmitted 
                ? (
                  <div className='p-4 text-center flex flex-col items-center justify-center'>
                    <CheckCircleIcon className='text-primary w-28 h-28 mb-4' />
                    <p className='text-3xl text-primary font-medium'>
                      Thank you for your Feedback!
                    </p>
                  </div>
                )
                :(
                <form onSubmit={handleSubmit}>
                <div className="p-8">
                  <div className="col-span-full mb-4">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                    {t('feedback.image')}
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      <div>
                        <img
                          id="image-preview"
                          src={feedback.picture ? URL.createObjectURL(feedback.picture) : '/pictures/default.jpg'}
                          alt="Preview"
                          className='w-32 rounded-full'
                        />
                      </div>
                      <input
                        type="file"
                        name="picture"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="mt-8 grid gap-8 grid-cols-2">
                    <div>
                      <label htmlFor="first-name" className="block text-sm/6 font-semibold text-brown-800">
                        Name
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder='Foulen Ben Foulen'
                          value={feedback.name}
                          onChange={handleChange}
                          autoComplete="given-name"
                          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm/6 font-semibold text-brown-800">
                        Phone
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder='+216 20 123 456'
                          value={feedback.phone}
                          onChange={handleChange}
                          autoComplete="tel"
                          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <label htmlFor="message" className="block text-sm/6 font-semibold text-brown-800">
                      Message
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        placeholder="What's on your mind?"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                        value={feedback.message}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-md bg-primary px-3.5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary hover:text-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
                </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default FeedbackModal
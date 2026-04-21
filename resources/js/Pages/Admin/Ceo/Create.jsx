import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const CreateCeo = ({ auth, abt }) => {
  const { flash } = usePage().props;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [ceo, setCeo] = useState({
    title_en: abt?.title ? JSON.parse(abt.title)?.en || '' : '',
    title_fr: abt?.title ? JSON.parse(abt.title)?.fr || '' : '',
    title_ar: abt?.title ? JSON.parse(abt.title)?.ar || '' : '',
    name_en: abt?.name ? JSON.parse(abt.name)?.en || '' : '',
    name_fr: abt?.name ? JSON.parse(abt.name)?.fr || '' : '',
    name_ar: abt?.name ? JSON.parse(abt.name)?.ar || '' : '',
    paragraph_1_en: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.en || '' : '',
    paragraph_1_fr: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.fr || '' : '',
    paragraph_1_ar: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.ar || '' : '',
    paragraph_2_en: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.en || '' : '',
    paragraph_2_fr: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.fr || '' : '',
    paragraph_2_ar: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.ar || '' : '',
    image: null,
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCeo({
      ...ceo,
      [name]: files ? files[0] : value,
    });
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
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('title_en', ceo.title_en);
    formData.append('title_ar', ceo.title_ar);
    formData.append('title_fr', ceo.title_fr);
    formData.append('name_en', ceo.name_en);
    formData.append('name_ar', ceo.name_ar);
    formData.append('name_fr', ceo.name_fr);
    formData.append('paragraph_1_en', ceo.paragraph_1_en);
    formData.append('paragraph_1_ar', ceo.paragraph_1_ar);
    formData.append('paragraph_1_fr', ceo.paragraph_1_fr);
    formData.append('paragraph_2_en', ceo.paragraph_2_en);
    formData.append('paragraph_2_ar', ceo.paragraph_2_ar);
    formData.append('paragraph_2_fr', ceo.paragraph_2_fr);

    if (ceo.image) {
      formData.append('image', ceo.image);
    }
    
    router.post('/admin/ceo', formData, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout user={auth?.user}>
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
      <div className="sm:flex-auto mb-8">
        <h1 className="text-base font-semibold leading-6 text-gray-900">Fill in your ceo page</h1>
        <p className="mt-2 text-sm text-gray-700">
        These informations will appear in the ceo section of the home page.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <p className="text-xl font-semibold">
            Ceo Title *
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`title_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Title ({lang.toUpperCase()})
              </label>
              <input 
                type="text" 
                name={`title_${lang}`} 
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                value={lang === 'en' ? ceo.title_en : lang === 'fr' ? ceo.title_fr : ceo.title_ar } 
                onChange={handleChange} 
              />
            </div>
          ))}
        </div>

        <div className="my-4">
          <p className="text-xl font-semibold">
            Ceo Name *
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`name_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name ({lang.toUpperCase()})
              </label>
              <input 
                type="text" 
                name={`name_${lang}`} 
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                value={lang === 'en' ? ceo.name_en : lang === 'fr' ? ceo.name_fr : ceo.name_ar } 
                onChange={handleChange} 
              />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
          Main Image (Home page) *
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <div>
              <img
                id="image-preview"
                // src={ceo.image ? URL.createObjectURL(ceo.image) : '/pictures/default.jpg'}
                src={ceo.image ? URL.createObjectURL(ceo.image) : abt.image ? ('/'+abt.image) : '/pictures/default.jpg'}
                alt="Preview"
                className='w-32 rounded-lg'
              />
            </div>
            <div className="relative">
               <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={handleFileChange}
              >
                Choose CEO Image
              </button>
              <input
                type="file"
                name="image"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xl font-semibold">
          First Paragraph *
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`paragraph_1_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                First Paragraph ({lang.toUpperCase()})
              </label>
              <textarea
                rows={4}
                name={`paragraph_1_${lang}`} 
                placeholder={`Write a ceo paragraph in ${lang.toUpperCase()}`}
                value={lang === 'en' ? ceo.paragraph_1_en : lang === 'fr' ? ceo.paragraph_1_fr : ceo.paragraph_1_ar }
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-xl font-semibold">
          Second Paragraph
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`paragraph_2_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Second Paragraph ({lang.toUpperCase()})
              </label>
              <textarea
                rows={4}
                name={`paragraph_2_${lang}`} 
                placeholder={`Write a ceo paragraph in ${lang.toUpperCase()}`}
                value={lang === 'en' ? ceo.paragraph_2_en : lang === 'fr' ? ceo.paragraph_2_fr : ceo.paragraph_2_ar }
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
            Submit
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default CreateCeo;

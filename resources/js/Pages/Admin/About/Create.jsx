import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

const CreateAbout = ({ auth, abt }) => {
  const { t } = useTranslation();
  const [about, setAbout] = useState({
    title_en: abt?.title ? JSON.parse(abt.title)?.en || '' : '',
    title_fr: abt?.title ? JSON.parse(abt.title)?.fr || '' : '',
    title_ar: abt?.title ? JSON.parse(abt.title)?.ar || '' : '',
    short_description_en: abt?.short_description ? JSON.parse(abt.short_description)?.en || '' : '',
    short_description_fr: abt?.short_description ? JSON.parse(abt.short_description)?.fr || '' : '',
    short_description_ar: abt?.short_description ? JSON.parse(abt.short_description)?.ar || '' : '',
    paragraph_1_en: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.en || '' : '',
    paragraph_1_fr: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.fr || '' : '',
    paragraph_1_ar: abt?.paragraph_1 ? JSON.parse(abt.paragraph_1)?.ar || '' : '',
    title_2_en: abt?.title_2 ? JSON.parse(abt.title_2)?.en || '' : '',
    title_2_fr: abt?.title_2 ? JSON.parse(abt.title_2)?.fr || '' : '',
    title_2_ar: abt?.title_2 ? JSON.parse(abt.title_2)?.ar || '' : '',
    paragraph_2_en: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.en || '' : '',
    paragraph_2_fr: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.fr || '' : '',
    paragraph_2_ar: abt?.paragraph_2 ? JSON.parse(abt.paragraph_2)?.ar || '' : '',
    image: null,
    picture_1: null,
    picture_2: null,
    picture_3: null,
    picture_4: null,
    picture_5: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAbout({
      ...about,
      [name]: files ? files[0] : value,
    });
  };

  const handleImageChange = (e) => {
      handleChange(e);
      if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
          document.getElementById('main-image-preview').src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleFileChange = (e, num) => {
    handleChange(e);

    // Show preview if an image is selected
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        //document.getElementById(`image-preview-${num}`).src = event.target.result;
        const imgPreview = document.getElementById(`image-preview-${num}`);
        if (imgPreview) {
            imgPreview.src = event.target.result;
        } else {
            console.error(`Element with ID "image-preview-${num}" not found.`);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('title_en', about.title_en);
    formData.append('title_ar', about.title_ar);
    formData.append('title_fr', about.title_fr);
    formData.append('short_description_en', about.short_description_en);
    formData.append('short_description_ar', about.short_description_ar);
    formData.append('short_description_fr', about.short_description_fr);
    formData.append('paragraph_1_en', about.paragraph_1_en);
    formData.append('paragraph_1_ar', about.paragraph_1_ar);
    formData.append('paragraph_1_fr', about.paragraph_1_fr);
    formData.append('title_2_en', about.title_2_en);
    formData.append('title_2_ar', about.title_2_ar);
    formData.append('title_2_fr', about.title_2_fr);
    formData.append('paragraph_2_en', about.paragraph_2_en);
    formData.append('paragraph_2_ar', about.paragraph_2_ar);
    formData.append('paragraph_2_fr', about.paragraph_2_fr);

    if (about.image) {
      formData.append('image', about.image);
    }
    if (about.picture_1) {
      formData.append('picture_1', about.picture_1);
    }
    if (about.picture_2) {
      formData.append('picture_2', about.picture_2);
    }
    if (about.picture_3) {
      formData.append('picture_3', about.picture_3);
    }
    if (about.picture_4) {
      formData.append('picture_4', about.picture_4);
    }
    if (about.picture_5) {
      formData.append('picture_5', about.picture_5);
    }

    console.log(about);
    
    router.post('/admin/about', formData, {
      forceFormData: true,
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-8">
        <h1 className="text-base font-semibold leading-6 text-gray-900">Fill in your about page</h1>
        <p className="mt-2 text-sm text-gray-700">
        These informations will appear in the about page as well as in the home page.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <p className="text-xl font-semibold">
            About Title *
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
                value={lang === 'en' ? about.title_en : lang === 'fr' ? about.title_fr : about.title_ar } 
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
                id="main-image-preview"
                src={about.image ? URL.createObjectURL(about.image) : abt.image ? ('/'+abt.image) : '/pictures/default.jpg'}
                alt="Preview"
                className='w-32 rounded-lg'
              />
            </div>
            <div className="relative">
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={(e) => handleImageChange(e)}
              >
                Choose About Image
              </button>
              <input
                type="file"
                name="image"
                id="file-input"
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => handleImageChange(e)}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xl font-semibold">
            Short Description *
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`short_description_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Short Description ({lang.toUpperCase()})
              </label>
              <textarea
                rows={4}
                name={`short_description_${lang}`} 
                placeholder={`Write a short description in ${lang.toUpperCase()}`}
                value={lang === 'en' ? about.short_description_en : lang === 'fr' ? about.short_description_fr : about.short_description_ar }
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          ))}
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
                placeholder={`Write an about paragraph in ${lang.toUpperCase()}`}
                value={lang === 'en' ? about.paragraph_1_en : lang === 'fr' ? about.paragraph_1_fr : about.paragraph_1_ar }
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          ))}
        </div>

        <div className="my-4">
          <p className="text-xl font-semibold">
            Second Paragraph Title
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {['en', 'fr', 'ar'].map((lang) => (
            <div key={`title_2_${lang}`}> 
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Title ({lang.toUpperCase()})
              </label>  
              <input 
                type="text" 
                name={`title_2_${lang}`} 
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
                value={lang === 'en' ? about.title_2_en : lang === 'fr' ? about.title_2_fr : about.title_2_ar } 
                onChange={handleChange} 
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
                placeholder={`Write an about paragraph in ${lang.toUpperCase()}`}
                value={lang === 'en' ? about.paragraph_2_en : lang === 'fr' ? about.paragraph_2_fr : about.paragraph_2_ar }
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-xl font-semibold">
          Pictures
          </p>
        </div>  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <div key={`picture_${num}`}>
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Picture {num}
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div>
                  <img
                    id={`image-preview-${num}`}
                    src={
                      about[`picture_${num}`]
                        ? URL.createObjectURL(about[`picture_${num}`])
                        : abt?.[`picture_${num}`]
                          ? '/' + abt[`picture_${num}`]
                          : '/pictures/default.jpg'
                    }

                    alt="Preview"
                    className='w-32 rounded-lg'
                  />
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => document.getElementById(`file-input-${num}`).click()}
                  >
                    Choose Picture {num}
                  </button>
                  <input
                    type="file"
                    name={`picture_${num}`}
                    id={`file-input-${num}`}
                    className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => handleFileChange(e, num)}
                  />
                </div>
              </div>
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

export default CreateAbout;

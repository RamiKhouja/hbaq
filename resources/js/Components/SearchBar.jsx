import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import Modal from './Modal';

function SearchBar({visibility, type}) {
    const {t, i18n} = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [openSearchModal, setOpenSearchModal] = useState(false);

    const handleSearch = async (searchTerm) => {
        try {
        const response = await axios.get(`/search?query=${searchTerm}`);
        setSearchResults(response.data);
        } catch (error) {
        console.error(error);
        } finally {
        }
    };
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        event.target.value && event.target.value!='' && handleSearch(event.target.value);
    };

    useEffect(()=>{
    },[searchResults])

  return (
    <div className="relative">
        {visibility
        ? (
        <div className=" relative rounded-md">
            <div className={`pointer-events-none absolute inset-y-0 ${i18n.language=='ar'?'right-0 pr-3':'left-0 pl-3'} flex items-center`}>
                <MagnifyingGlassIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleInputChange}
                className={`block w-full rounded-md border-1 border-primary py-0 ${i18n.language=='ar'?'pr-10 text-right':'pl-10'} bg-transparent text-brown-800 placeholder:text-brown-600 sm:text-sm sm:leading-6 focus:outline-none`}
                placeholder={t('navigation.search')}
            />
        </div>
        ): (
        <div className=" relative rounded-md">
            <button className='focus:outline-none' 
                onClick={() => setOpenSearchModal(true)}>
                <MagnifyingGlassIcon className={`${type==='mobile' ? 'h-6 w-6 mt-2 mx-1': 'h-5 w-5 mt-1'} text-primary`} aria-hidden="true" />
            </button>
            
        </div>
        )}
        {searchTerm && visibility && (
            <div className="absolute left-0 top-10 bg-white rounded shadow p-4 w-full md:w-96">
                {searchResults && searchResults.length>0 ? (
                searchResults.map((product) => (
                    <Link key={product?.id} href={`/product/${product?.url}`}>
                    <div className="flex gap-x-4 items-center mb-2 pb-2 border-b border-b-gray-300 hover:bg-gray-200">
                    <img src={`/${product?.main_image}`} className='h-10'/>
                    <div className='py-1'>
                        <p className='text-base text-gray-900 font-medium'>
                        {i18n.language=='ar' ? product?.name?.ar : product?.name?.en}
                        </p>
                        <p className='text-sm text-gray-600 font-light'>{product?.brand?.name}</p>
                    </div>
                    </div>
                    </Link>
                ))
                ):(
                <p>{t('no-results')}</p>
                )}
            </div>
        )}
        <Modal show={openSearchModal} onClose={() => setOpenSearchModal(false)}>
            <div className="p-4">
                <input
                    type="text"
                    name="modal-search"
                    id="modal-search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border-1 border-primary py-2 ${i18n.language=='ar'?'pr-10 text-right':'pl-10'} bg-transparent text-brown-800 placeholder:text-brown-600 sm:text-sm sm:leading-6 focus:outline-none`}
                    placeholder={t('navigation.search')}
                />
                <div className="mt-4">
                    {searchResults && searchResults.length>0 ? (
                    searchResults.map((product) => (
                        <Link key={product?.id} href={`/product/${product?.url}`}>
                        <div className="flex gap-x-4 items-center mb-2 pb-2 border-b border-b-gray-300 hover:bg-gray-200">
                        <img src={`/${product?.main_image}`} className='h-10'/>
                        <div className='py-1'>
                            <p className='text-base text-gray-900 font-medium'>
                            {i18n.language=='ar' ? product?.name?.ar : product?.name?.en}
                            </p>
                            <p className='text-sm text-gray-600 font-light'>{product?.brand?.name}</p>
                        </div>
                        </div>
                        </Link>
                    ))
                    ):(
                    <p>{t('no-results')}</p>
                    )}
                </div>
            </div>
        </Modal>
    </div>
  )
}

export default SearchBar
import {useState, useEffect} from 'react'
import { router, usePage } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next';
import Categories from '@/Components/Categories';
import OwlProducts from '@/Components/OwlProducts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Contact from '@/Components/Contact';
import Gifts from '@/Components/Gifts';
import Courses from '@/Components/Courses';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from '@/redux/cartSlice';
import AboutSection from '@/Components/About';

function Home({auth, categories, featured, eventCategories, about}) {
  const { t, i18n } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { flash } = usePage().props
  const typeParam = new URLSearchParams(window.location.search).get("type");
  const [showAlert, setShowAlert] = useState(false)
  const dispatch = useDispatch();
  const cartAlert = useSelector(state => state.cart.alert);

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
      if (cartAlert) {
        const timer = setTimeout(() => dispatch(clearAlert()), 3000);
        return () => clearTimeout(timer);
      }
    }, [cartAlert]);

    useEffect(() => {
      if (typeParam && typeParam==="order") {
        setShowAlert(true);
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return () => {
          clearTimeout(timeoutId);
        };
      }
    }, [flash.success]);

    const options = {
      responsive: {
        0: {
          items: 1,
        },
        400: {
          items: 1,
        },
        600: {
          items: 1,
        },
        700: {
          items: 1,
        },
        800: {
          items: 1,
        },
        1000: {
          items: 1,
        }
      },
      nav: false,
      dots: false
    }
    
  return (
    <ClientLayout showMain={true} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3 absolute top-4 z-50 " role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">{t('cart.success')}</p>
              <p className="text-sm">{t('cart.'+flash.success)}</p>
            </div>
          </div>
        </div>}

        {cartAlert &&
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-50 rounded-2xl text-green-800 px-4 py-3 shadow-lg " role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
            <div className="flex">
              <div><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                {/* <p className="font-bold">{t('cart.success')}</p> */}
                <p className="font-semibold text-sm lang-ar:text-xl">{t(cartAlert.message)}</p>
              </div>
            </div>
          </div>
        </div>
        }

        {showAlert && (
          <div className="w-full flex justify-center">
            <div className="w-4/5 bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3 absolute top-4 z-50 " role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
              <div className="flex">
                <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                  <p className="font-bold">Order Success</p>
                  <p className="text-sm">Order placed successfully</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          spaceBetween={0}
          className="section"
          breakpoints={{
            0: { slidesPerView: 1 },
            400: { slidesPerView: 1 },
            600: { slidesPerView: 1 },
            700: { slidesPerView: 1 },
            800: { slidesPerView: 1 },
            1000: { slidesPerView: 1 },
          }}
        >
          <SwiperSlide>
            <div className="review">
              <img
                src="/pictures/global/carousel/carousel-1.jpg"
                alt="Fragrant"
                className="w-full object-cover h-56 md:h-80 lg:h-[400px]"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="review">
              <img
                src="/pictures/global/carousel/carousel-2.jpg"
                alt="Fragrant"
                className="w-full object-cover h-56 md:h-80 lg:h-[400px]"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="review">
              <img
                src="/pictures/global/carousel/carousel-3.jpg"
                alt="Fragrant"
                className="w-full object-cover h-56 md:h-80 lg:h-[400px]"
              />
            </div>
          </SwiperSlide>
        </Swiper>
        {/* <div className="flex justify-center w-full mt-8">
          <img src="/pictures/global/smile.png" className='w-10' alt="" />
        </div> */}
        <div className='sm:px-6 lg:px-8 max-w-7xl xl:max-w-none my-4 lg:my-16 mx-auto'>
      
          <div>
            <Categories categories={categories}/>
            {/* <Banner user={auth?.user} /> */}
            <div className="flex justify-center my-12">
              <img src="/pictures/global/split-design.png" className='w-64 lg:w-96' alt="" />
          </div>
          <AboutSection about={about}/>
            <OwlProducts products={featured} type={'featured'}/>
            <div className="flex justify-center my-12">
              <img src="/pictures/global/split-design.png" className='w-64 lg:w-96' alt="" />
            </div>
            <Gifts />
            <div className="flex justify-center my-12">
              <img src="/pictures/global/split-design.png" className='w-64 lg:w-96' alt="" />
            </div>
            <Courses />
            <div className="flex justify-center my-12">
              <img src="/pictures/global/split-design.png" className='w-64 lg:w-96' alt="" />
            </div>
            {/* <AboutCeo user={auth?.user} ceo={ceo}/> */}
            {/* <TabProducts prodCats={prodCats}/> */}
            {/* <Testimonials testimonials={testimonials}/> */}
            
          </div>
          {/* <ServicesSection services={services} user={auth?.user} /> */}
          {/* <img src="/pictures/global/beans.png" className='h-8 mx-auto' alt="" /> */}
          <Contact />
        </div>
    </ClientLayout>
  )
}

export default Home
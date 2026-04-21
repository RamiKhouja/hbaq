import {PhoneIcon, EnvelopeIcon, MapPinIcon} from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t, i18n } = useTranslation();
    return (
        <div className="footer" dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
            <div className='wrapper'>
                <div className='absolute -top-[19px]'>
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="175" height="51" viewBox="0 0 175 51" fill="none">
                            <rect x="13" width="162" height="51" fill="#d9e026"/>
                            <path d="M0 19L13 0V19H0Z" fill="#c3c922"/>
                        </svg>
                        <p className={`title ${i18n.language=='ar'?'text-lg right-7':'left-7 font-trajan-pro'}`}>{t('footer.get-touch')}</p>
                    </div>
                </div>
                <div className="body">
                    <div className="col-span-1 lg:col-span-2 mb-8 md:mb-0">
                        <p className={`section-title ${i18n.language=='ar'?'text-lg':'font-trajan-pro'}`}>{t('footer.newsletter')}</p>
                        <p className="description">
                            {t('footer.description')}
                        </p>
                        <input type="text" placeholder={t('footer.email-addr')} />
                    </div>
                    <div className="links col-span-1 mb-8 md:mb-0">
                        <p className={`section-title ${i18n.language=='ar'?'text-lg':'font-trajan-pro'}`}>{t('footer.links')}</p>
                        <ul>
                            <li><a href="#">{t('footer.services')}</a></li>
                            <li><a href="#">{t('footer.categories')}</a></li>
                            <li><a href="#">{t('footer.contact-us')}</a></li>
                            <li><a href="#">{t('footer.buy')}</a></li>
                        </ul>
                    </div>
                    <div className="socials col-span-1 md:col-span-2">
                        <p className={`section-title ${i18n.language=='ar'?'text-lg':'font-trajan-pro'}`}>{t('footer.contact')}</p>
                        <ul>
                            <li>
                                <div className={`icon ${i18n.language == 'ar' && ('ml-3')}`}>
                                    <MapPinIcon className="w-full h-full text-white"/>
                                </div>
                                <p><b>{t('footer.address')} </b></p>
                                <p><i>{t('footer.company')}</i></p>
                            </li>
                            <li>
                                <div className={`icon ${i18n.language == 'ar' && ('ml-3')}`}>
                                    <PhoneIcon className="w-full h-full text-white"/>
                                </div>
                                <p><b>{t('footer.phone')} </b></p>
                                <p><i>(123) 122-212</i></p>
                            </li>
                            <li>
                                <div className={`icon ${i18n.language == 'ar' && ('ml-3')}`}>
                                    <EnvelopeIcon className="w-full h-full text-white"/>
                                </div>
                                <p><b>{t('footer.email')} </b></p>
                                <p><i>seoof@gmail.com</i></p>
                            </li>
                            
                        </ul>
                    </div>

                </div>
            </div>
            <div className="foot">
                <img src='/pictures/logo.png' className="w-36"  alt=""/>
            </div>
        </div>
    )
}
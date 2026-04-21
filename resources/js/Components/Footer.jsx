import {PhoneIcon, EnvelopeIcon, MapPinIcon} from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const social = [
        {
          name: 'Facebook',
          href: 'https://www.instagram.com/mesmia.emna/',
          icon: (props) => (
            <svg fill="currentColor" {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
            </svg>
          ),
        },
        {
          name: 'Instagram',
          href: 'https://www.instagram.com/mesmia.emna',
          icon: (props) => (
            <svg fill="currentColor" {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
            </svg>
          ),
        }
    ]

    const { t, i18n } = useTranslation();
    return (
        <div className="bg-brown-800" dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-7xl px-6 pb-8  lg:px-8" >
                <div className="pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex gap-x-6 md:order-2">
                        {social.map((item) => (
                        <a key={item.name} href={item.href} target='_blank' className="text-white hover:text-brown-100">
                            <span className="sr-only">{item.name}</span>
                            <item.icon aria-hidden="true" className="size-6" />
                        </a>
                        ))}
                    </div>
                    <p className="mt-8 text-lg text-white md:order-1 md:mt-0">
                        &copy; {new Date().getFullYear()} {t('footer.mesmia')}. {t('footer.all-rights')}.
                    </p>
                </div>
            </div>
        </div>
    )
}
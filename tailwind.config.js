import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                'amiri' : ['Amiri', 'sans-serif'],
                'nanum' : ['Nanum Myeongjo', 'sans-serif'],
                'adobe': ['Adobe Arabic', 'sans-serif'],
                'layla-thuluth': ['Layla Thuluth', 'sans-serif'],
                'hudhud': ['Hudhud Arabic', 'sans-serif'],
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#351E10',
                white: '#FFFFF0',
                brown: {
                    50: '#FFE7D4',
                    100: '#EDCAB8',
                    200: '#D14F9D',
                    300: '#B59483',
                    400: '#9A7B6A',
                    500: '#7F6251',
                    600: '#664A3A',
                    700: '#351E10',
                    800: '#120D0A',
                    900: '#090605'
                },
                primdark: '#2C1508',
                secondary: '#D9E026',
                secondark: '#BFC11C',
            }
        },
    },

    plugins: [
        forms,
        plugin(function ({ addVariant }) {
            addVariant('lang-ar', '.lang-ar &');
        })
    ],
};

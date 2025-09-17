import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
              tajawal: ['Tajawal', 'sans-serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
            },
            screens: {
              xs: '480px',
              'max-xs': {'max': '479px'},
              'max-sm': {'max': '639px'},
              'max-md': {'max': '767px'},
              'max-lg': {'max': '1023px'},
              'max-xl': {'max': '1279px'},
            },
        },
    },

    plugins: [forms],
};

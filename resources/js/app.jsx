
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './i18n';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import { useEffect } from 'react';
import { initializeCart } from './redux/cartSlice';
import { useTranslation } from 'react-i18next';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const AppWrapper = ({ children }) => {
  
    const { i18n } = useTranslation();

    useEffect(() => {
        const html = document.documentElement;

        // remove previous language classes
        html.classList.remove('lang-en', 'lang-ar', 'lang-fr');

        // add current language class
        html.classList.add(`lang-${i18n.language}`);
    }, [i18n.language]);
  
    return children;
};

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : `${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <AppWrapper>
                    <App {...props} />
                </AppWrapper>
            </Provider>
        );
    },
    progress: false,
});

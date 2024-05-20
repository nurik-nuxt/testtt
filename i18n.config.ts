import ru from './locales/ru.json';
import kz from './locales/kz.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: {
        ru,
        kz,
        en,
        ar,
        de,
        es,
        fr,
        hi
    },
}));

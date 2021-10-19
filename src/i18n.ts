import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

// import locale from 'element-ui/lib/locale';
// import zhTw from 'element-ui/lib/locale/lang/zh-tw';

// console.info(zhTw);

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
    const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: LocaleMessages = {};
    locales.keys().forEach((key) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key);
        }
    });
    // Object.keys(zhTw).forEach((key: string) => {
    //     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    //     if (matched && matched.length > 1) {
    //         const locale = matched[1];
    //         messages[locale] = locales(key);
    //     }
    // });

    return messages;
}

const i18n = new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages(),
    silentTranslationWarn: process.env.VUE_APP_I18N_SILENT_TRANSLATION_WARN === 'true',
});

export const prefixTransaction = (prefix: string) => {
    return (key: string, values?: any) => i18n.t(`${prefix}.${key}`, values).toString();
};

export default i18n;

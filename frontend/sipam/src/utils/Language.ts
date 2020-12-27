
import { IVueI18n } from 'vue-i18n';
import LocaleDe from '@/locales/de.json';
import LocaleEn from '@/locales/en.json';

export default {
  localeKey: 'sipam_i18nLocale',
  i18n: { } as IVueI18n,

  init(i18n: IVueI18n) {
    this.i18n = i18n;
    this.i18n.setLocaleMessage('en', LocaleEn);
    this.i18n.setLocaleMessage('de', LocaleDe);

    const locale = localStorage.getItem(this.localeKey) || 'en';
    this.changeLocale(locale);
  },

  changeLocale(locale: string) {
    this.i18n.locale = locale;
    localStorage.setItem(this.localeKey, locale);
  },
};

export default defineI18nConfig(() => {
  return {
    availableLocales: ['ru', 'en'],
    datetimeFormats: {
      ru: {
        long: {
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      },
    },
    defaultLocale: 'ru',
    fallbackLocale: 'en',
    legacy: false,
    locale: 'ru',
    pluralRules: {
      en: (n: number) => {
        return (n === 1
          ? 0
          : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
              ? 1
              : 2))
      },
      ru: (n: number) => {
        return (n % 10 === 1 && n % 100 !== 11
          ? 0
          : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
              ? 1
              : 2))
      },
    },
    sync: true,
  }
})

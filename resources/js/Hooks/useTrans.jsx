// No useEffect needed - instant access!
export function useTrans() {
  const translations = window.translations || {}
  const locale = window.locale || 'en'
  const availableLocales = window.availableLocales || ['en', 'ar']

  function t(key, replacements = {}) {
    let value = translations[key] || key
    Object.entries(replacements).forEach(([k, v]) => {
      value = value.replace(`:${k}`, v)
    })
    return value
  }

  // For locale switching, you'd reload the page or use API
  const changeLocale = (newLocale) => {
    window.location.href = `?locale=${newLocale}`
  }

  return { t, locale, availableLocales, changeLocale }
}

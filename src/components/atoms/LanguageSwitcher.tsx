import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const lng = i18n.resolvedLanguage?.startsWith('pl') ? 'pl' : 'en'

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t('language.groupLabel')}
    >
      <button
        type="button"
        className={`lang-switcher__btn ${lng === 'en' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => void i18n.changeLanguage('en')}
        aria-pressed={lng === 'en'}
        aria-label={t('language.switchToEn')}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-switcher__btn ${lng === 'pl' ? 'lang-switcher__btn--active' : ''}`}
        onClick={() => void i18n.changeLanguage('pl')}
        aria-pressed={lng === 'pl'}
        aria-label={t('language.switchToPl')}
      >
        PL
      </button>
    </div>
  )
}

/* Must match THEME_STORAGE_KEY in src/services/themeLocalStorage.ts */
;(function () {
  try {
    var v = localStorage.getItem('filetree-explorer:theme')
    document.documentElement.classList.add(
      v === 'dark' ? 'theme-dark' : 'theme-light',
    )
  } catch (e) {
    document.documentElement.classList.add('theme-light')
  }
})()

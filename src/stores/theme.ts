import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'invest-hub-theme'

const stored = ((): Theme => {
  if (typeof localStorage === 'undefined') return 'dark'
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' ? 'light' : 'dark'
})()

const themeRef = ref<Theme>(stored)

const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement
  if (!root) return
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.setAttribute('data-theme', theme)
}

export const initializeTheme = () => {
  applyThemeClass(themeRef.value)
}

watch(
  themeRef,
  (value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value)
    }
    applyThemeClass(value)
  },
  { immediate: false }
)

export const useTheme = () => {
  const setTheme = (value: Theme) => {
    themeRef.value = value
  }

  const toggleTheme = () => {
    themeRef.value = themeRef.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme: themeRef,
    setTheme,
    toggleTheme
  }
}

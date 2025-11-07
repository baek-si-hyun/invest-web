import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeTheme } from './stores/theme'
import './style.css'

initializeTheme()

const app = createApp(App)

app.use(router)
app.mount('#app')

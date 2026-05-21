import { createApp } from 'vue'
import router from './router/index'
import { initializeAuth } from './composables/useAuth'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// Initialize auth from localStorage
initializeAuth()

app.use(router)
app.mount('#app')

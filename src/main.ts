import { createApp } from 'vue'

import router from './router'
import store from './store'

import App from './App.vue'

import 'normalize.css/normalize.css'

createApp(App).use(store).use(router).mount('#mainApp')

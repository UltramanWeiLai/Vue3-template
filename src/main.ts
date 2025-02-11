import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'

import router from '@/router'
import App from '@/App.vue'

import Container from '@/components/Container/index.vue'
import Box from '@/components/Box/index.vue'
import ActionButton from '@/components/ActionButton/index.vue'

import 'normalize.css/normalize.css'
import 'ant-design-vue/dist/reset.css'
import '@/styles/index.scss'

const pinia = createPinia()
const app = createApp(App)

app.component('Container', Container)
app.component('Box', Box)
app.component('ActionButton', ActionButton)

app.use(pinia)
app.use(router)
app.use(Antd)
app.mount('#mainApp')

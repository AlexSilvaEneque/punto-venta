import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'
import { VueFire, VueFireAuth } from 'vuefire'

import App from './App.vue'
import router from './router'
import { firebaseApp } from './config/firebase'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig(config))
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth()
    ]
})

app.mount('#app')

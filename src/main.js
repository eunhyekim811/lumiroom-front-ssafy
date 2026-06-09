import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Tailwind CSS가 포함된 글로벌 스타일 파일 임포트
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')


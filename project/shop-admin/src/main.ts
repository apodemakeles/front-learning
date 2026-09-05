import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'

// 应用入口：创建 Vue 应用实例，挂到 index.html 里 id="app" 的元素上
// 类比 SpringApplication.run(App.class, args)——整个前端的 main 方法
createApp(App).mount('#app')

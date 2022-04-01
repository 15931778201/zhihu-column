import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import Upload from './components/Upload/UploadComp.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  debugger
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '57951175B9EC3618' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    // config.data.append('icode', '718722BB33DF9267')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '57951175B9EC3618' }
  }
  store.commit('setError', { status: false })
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(e)
})
const app = createApp(App)
// eslint-disable-next-line vue/multi-word-component-names
app.component('upload', Upload)
app.use(router).use(store).mount('#app')


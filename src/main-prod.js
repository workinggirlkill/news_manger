import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/golab.css'
// 导入登录样式
import "./assets/css/login.css"
// 导入NProgress, 包对应的JS和CSS进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// 导入字体图标库
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
// 全局注册富文框编辑器
Vue.use(VueQuillEditor /* { default global options } */)
Vue.config.productionTip = false
// 将http的头一定要写上
// 这是打包服务端，可以换成自己接口
axios.defaults.baseURL ="http://localhost:8001/jirong/"
Vue.prototype.$http = axios
// 与后端交互,这里还是没做好,有点不明白
// 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
// 在request 拦截器中, 展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  // 这里是请求头啊,咋没有值
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  if (window.localStorage.getItem('token')) {
    config.headers.Authorization = window.localStorage.getItem('token');
  }
  // 必须在最后return config
  return config
})
// response 拦截器中,  隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 全局时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 位数不够 0来凑
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 全局注册富文框编辑器
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

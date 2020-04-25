// 浏览器兼容性
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'

import ElementUI from 'element-ui'
import Pagination from '@/components/ElementUI/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'

import lodash from 'lodash'
import i18n from './lang' // 国际化

import '@/styles/index.scss'

import App from './App.vue'
import store from './store'
import router from './router'

Vue.use(ElementUI, {
  size: 'mini', // large / medium / small / mini
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Pagination)
Vue.config.productionTip = false

Vue.prototype.$_ = lodash

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

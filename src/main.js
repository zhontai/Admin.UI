// 浏览器兼容性
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/styles/index.scss'

import '@/mixin'
import '@/directive'

import lodash from 'lodash'
import i18n from './lang' // 国际化

import store from './store'
import router from './router'
import App from './App.vue'

import Pagination from '@/components/ElementUI/Pagination'
import MyPagination from '@/components/my-pagination'

Vue.use(ElementUI, {
  size: 'mini', // large / medium / small / mini
  i18n: (key, value) => i18n.t(key, value)
})

// 覆盖分页组件
Vue.use(Pagination)

// 全局组件注册
Vue.component('MyPagination', MyPagination)

Vue.config.productionTip = false
Vue.prototype.$_ = lodash

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

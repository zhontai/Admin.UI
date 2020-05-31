import Vue from 'vue'
import checkPermission from '@/utils/permission'

const myMixin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        checkPermission
      }
    })
  }
}

Vue.use(myMixin)

export default myMixin

import Vue from 'vue'
import checkPermission from '@/utils/permission'

/**
 * 使用说明
 * v-permission="'api:admin:api:add'" 或 v-permission="['api:admin:api:add']"
 * v-permission="{ permission: 'api:admin:api:add', disabled: true }"
 */
Vue.directive('permission', {
  bind(el, binding) {
    let permission
    let disabled
    if (Object.prototype.toString.call(binding.value) === '[object Object]') {
      permission = binding.value.permission
      disabled = binding.value.disabled
    } else {
      permission = binding.value
    }
    const hasPermission = checkPermission(permission)
    const element = el
    if (!hasPermission) {
      if (disabled) {
        element.disabled = true
        element.style.opacity = 0.4
        element.style.cursor = 'not-allowed'
      } else {
        element.style.display = 'none'
      }
    }
  }
})

export default Vue.directive('permission')

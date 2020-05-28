/**
 * 使用说明
 * import checkPermission from '@/utils/permission'
 * v-if="checkPermission('api:admin:api:add')" 或 v-if="checkPermission(['api:admin:api:add'])"
 * methods: {
      checkPermission
  }
 */
import store from '@/store'
/**
 * 检查权限
 * @param {String | Array} value
 */
export default function checkPermission(value) {
  const permissions = store.getters && store.getters.permissions
  if (!(permissions instanceof Array)) {
    return false
  }
  let hasPermission = false
  if (value instanceof Array && value.length > 0) {
    hasPermission = permissions.some(permission => {
      return value.includes(permission)
    })
  } else {
    hasPermission = permissions.includes(value)
  }

  return hasPermission
}

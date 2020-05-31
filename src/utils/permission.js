/**
 * 使用说明
  由于使用了全局混入检查权限方法，可以直接使用，无需导入
  v-if="checkPermission('权限点')" 或 v-if="checkPermission(['权限点'])"
  如未使用全局混入检查权限方法，需导入使用
  import checkPermission from '@/utils/permission'
  methods: {
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

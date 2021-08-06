import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/employee/`

// 员工管理
export const getEmployee = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getEmployeeListPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}
export const editEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const updateBasicEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'updateBasic', params, config)
}
export const addEmployee = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
export const removeEmployee = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemoveEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}

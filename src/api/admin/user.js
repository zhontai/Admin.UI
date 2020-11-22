import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/user/`

// 用户管理
export const getUser = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}
export const getUserListPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}
export const removeUser = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const editUser = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const updateBasicUser = (params, config = {}) => {
  return request.put(apiPrefix + 'updateBasic', params, config)
}
export const addUser = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
export const batchRemoveUser = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
export const changePassword = (params, config = {}) => {
  return request.put(apiPrefix + 'ChangePassword', params, config)
}
export const getBasic = (params, config = {}) => {
  return request.get(apiPrefix + 'getbasic', { params: params, ...config })
}

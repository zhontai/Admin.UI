import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/permission/`

// 权限管理
export const getPermissionList = (params, config = {}) => {
  return request.get(apiPrefix + 'getlist', { params: params, ...config })
}
export const removePermission = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const getPermissions = (params, config = {}) => {
  return request.get(apiPrefix + 'getpermissionlist', { params: params, ...config })
}
export const getPermissionIds = (params, config = {}) => {
  return request.get(apiPrefix + 'GetRolePermissionList', { params: params, ...config })
}
export const addRolePermission = (params, config = {}) => {
  return request.post(apiPrefix + 'Assign', params, config)
}

export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'addGroup', params, config)
}
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'addMenu', params, config)
}
export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + 'addApi', params, config)
}
export const addDot = (params, config = {}) => {
  return request.post(apiPrefix + 'addDot', params, config)
}

export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'updateGroup', params, config)
}
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'updateMenu', params, config)
}
export const updateApi = (params, config = {}) => {
  return request.put(apiPrefix + 'updateApi', params, config)
}
export const updateDot = (params, config = {}) => {
  return request.put(apiPrefix + 'updateDot', params, config)
}

export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'getGroup', { params: params, ...config })
}
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'getMenu', { params: params, ...config })
}
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + 'getApi', { params: params, ...config })
}
export const getDot = (params, config = {}) => {
  return request.get(apiPrefix + 'getDot', { params: params, ...config })
}

/**
 *  权限服务
 *  @module @/api/admin/permission
 */

import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/permission/`

/**
 * 查询权限
 */
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

/**
 * 查询分组
 */
export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'get-group', { params: params, ...config })
}

/**
 * 查询菜单
 */
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'get-menu', { params: params, ...config })
}

/**
 * 查询接口
 */
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + 'get-api', { params: params, ...config })
}

/**
 * 查询权限点
 */
export const getDot = (params, config = {}) => {
  return request.get(apiPrefix + 'get-dot', { params: params, ...config })
}

/**
 * 查询权限列表
 */
export const getList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-list', { params: params, ...config })
}

/**
 * 查询角色权限-权限列表
 */
export const getPermissionList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-permission-list', { params: params, ...config })
}

/**
 * 查询角色权限列表
 */
export const getRolePermissionList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-role-permission-list', { params: params, ...config })
}

/**
 * 查询租户权限列表
 */
export const getTenantPermissionList = (params, config = {}) => {
  return request.get(apiPrefix + 'get-tenant-permission-list', { params: params, ...config })
}

/**
 * 新增分组
 */
export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'add-group', params, config)
}

/**
 * 新增菜单
 */
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'add-menu', params, config)
}

/**
 * 新增接口
 */
export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + 'add-api', params, config)
}

/**
 * 新增权限点
 */
export const addDot = (params, config = {}) => {
  return request.post(apiPrefix + 'add-dot', params, config)
}

/**
 * 修改分组
 */
export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'update-group', params, config)
}

/**
 * 修改菜单
 */
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'update-menu', params, config)
}

/**
 * 修改接口
 */
export const updateApi = (params, config = {}) => {
  return request.put(apiPrefix + 'update-api', params, config)
}

/**
 * 修改权限点
 */
export const updateDot = (params, config = {}) => {
  return request.put(apiPrefix + 'update-dot', params, config)
}

/**
 * 彻底删除
 */
export const deleteAsync = (params, config = {}) => {
  return request.delete(apiPrefix + 'delete', { params: params, ...config })
}

/**
 * 删除
 */
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'soft-delete', { params: params, ...config })
}

/**
 * 保存角色权限
 */
export const assign = (params, config = {}) => {
  return request.post(apiPrefix + 'assign', params, config)
}

/**
 * 保存租户权限
 */
export const saveTenantPermissions = (params, config = {}) => {
  return request.post(apiPrefix + 'save-tenant-permissions', params, config)
}

export default {
  get,
  getGroup,
  getMenu,
  getApi,
  getDot,
  getList,
  getPermissionList,
  getRolePermissionList,
  getTenantPermissionList,
  addGroup,
  addMenu,
  addApi,
  addDot,
  updateGroup,
  updateMenu,
  updateApi,
  updateDot,
  deleteAsync,
  softDelete,
  assign,
  saveTenantPermissions
}

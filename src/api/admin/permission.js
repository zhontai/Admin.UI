import request from '@/utils/request'

// 权限管理
export const getPermissionList = params => {
  return request.get('/api/admin/permission/getlist', { params: params })
}
export const removePermission = params => {
  return request.delete('/api/admin/permission/softdelete', { params: params })
}
export const getPermissions = params => {
  return request.get('/api/admin/permission/getpermissionlist', { params: params })
}
export const getPermissionIds = params => {
  return request.get('/api/admin/permission/GetRolePermissionList', { params: params })
}
export const addRolePermission = params => {
  return request.post('/api/admin/permission/Assign', params)
}

export const addGroup = params => {
  return request.post('/api/admin/permission/addGroup', params)
}
export const addMenu = params => {
  return request.post('/api/admin/permission/addMenu', params)
}
export const addApi = params => {
  return request.post('/api/admin/permission/addApi', params)
}

export const updateGroup = params => {
  return request.put('/api/admin/permission/updateGroup', params)
}
export const updateMenu = params => {
  return request.put('/api/admin/permission/updateMenu', params)
}
export const updateApi = params => {
  return request.put('/api/admin/permission/updateApi', params)
}

export const getGroup = params => {
  return request.get('/api/admin/permission/getGroup', { params: params })
}
export const getMenu = params => {
  return request.get('/api/admin/permission/getMenu', { params: params })
}
export const getApi = params => {
  return request.get('/api/admin/permission/getApi', { params: params })
}

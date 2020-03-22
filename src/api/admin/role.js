import request from '@/utils/request'

// 角色管理
export const getRole = params => {
  return request.get('/api/admin/role/get', { params: params })
}
export const getRoleListPage = params => {
  params = params || {}
  return request.post('/api/admin/role/getpage', params)
}
export const addRole = params => {
  return request.post('/api/admin/role/add', params)
}
export const editRole = params => {
  return request.put('/api/admin/role/update', params)
}
export const removeRole = params => {
  return request.delete('/api/admin/role/softdelete', { params: params })
}
export const batchRemoveRole = params => {
  return request.put('/api/admin/role/BatchsoftDelete', params)
}

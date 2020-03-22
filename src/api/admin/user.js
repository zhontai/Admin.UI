import request from '@/utils/request'

// 用户管理
export const getUser = params => {
  return request.get('/api/admin/user/get', { params: params })
}
export const getUserListPage = params => {
  return request.post('/api/admin/user/getpage', params)
}
export const removeUser = params => {
  return request.delete('/api/admin/user/softdelete', { params: params })
}
export const editUser = params => {
  return request.put('/api/admin/user/update', params)
}
export const updateBasicUser = params => {
  return request.put('/api/admin/user/updateBasic', params)
}
export const addUser = params => {
  return request.post('/api/admin/user/add', params)
}
export const batchRemoveUser = params => {
  return request.put('/api/admin/user/BatchsoftDelete', params)
}
export const changePassword = params => {
  return request.put('/api/admin/user/ChangePassword', params)
}
export const getBasic = params => {
  return request.get('/api/admin/user/getbasic', { params: params })
}

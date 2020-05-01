import request from '@/utils/request'

// 文档管理
export const getDocuments = params => {
  return request.get('/api/admin/document/getlist', { params: params })
}
export const getDocumentImages = params => {
  return request.get('/api/admin/document/getimagelist', { params: params })
}
export const getGroup = params => {
  return request.get('/api/admin/document/getGroup', { params: params })
}
export const getMenu = params => {
  return request.get('/api/admin/document/getMenu', { params: params })
}
export const getContent = params => {
  return request.get('/api/admin/document/getContent', { params: params })
}
export const addGroup = params => {
  return request.post('/api/admin/document/addGroup', params)
}
export const addMenu = params => {
  return request.post('/api/admin/document/addMenu', params)
}
export const updateGroup = params => {
  return request.put('/api/admin/document/updateGroup', params)
}
export const updateMenu = params => {
  return request.put('/api/admin/document/updateMenu', params)
}
export const updateContent = params => {
  return request.put('/api/admin/document/updateContent', params)
}
export const removeDocument = params => {
  return request.delete('/api/admin/document/softdelete', { params: params })
}

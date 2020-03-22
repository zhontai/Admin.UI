import request from '@/utils/request'

// 数据字典管理
export const getDictionary = params => {
  return request.get('/api/admin/dictionary/get', { params: params })
}
export const getDictionaryListPage = params => {
  return request.post('/api/admin/dictionary/getpage', params)
}
export const removeDictionary = params => {
  return request.delete('/api/admin/dictionary/softdelete', { params: params })
}
export const editDictionary = params => {
  return request.put('/api/admin/dictionary/update', params)
}
export const addDictionary = params => {
  return request.post('/api/admin/dictionary/add', params)
}

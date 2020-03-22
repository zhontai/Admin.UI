import axios from 'axios'
import store from '@/store'
const requestAxios = axios.create({
  baseURL: '', // url = base url + request url
  timeout: 20000 // 请求延时
})

requestAxios.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
requestAxios.interceptors.response.use(
  response => {
    const res = response.data
    res.success = res.code === 1
    return res
  },
  async error => {
    let res = { success: false, code: 0, msg: '' }
    if (error.response) {
      var data = error.response.data
      if (_.isPlainObject(data)) {
        res = { success: false, code: 0, ...error.response.data }
      } else if (_.isString(data)) {
        if (_.isNumber(error.response.status)) {
          res.code = error.response.status
        }
        res.msg = data || error.response.statusText
      }
    }
    return res
  }
)

export default requestAxios

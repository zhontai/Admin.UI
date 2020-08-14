import axios from 'axios'
import store from '@/store'
import { toLogout } from '@/router'
import Vue from 'vue'
import { refresh } from '@/api/admin/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Cache-Control'] = 'no-cache'
axios.defaults.headers['Pragma'] = 'no-cache'
const requestAxios = axios.create({
  baseURL: '', // url = base url + request url
  timeout: 20000 // 请求延时
})

// 拦截请求
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

// 拦截响应
requestAxios.interceptors.response.use(
  response => {
    const { config, data } = response
    data.success = data.code === 1
    if (!data.success && !config.noErrorMsg && data.msg) {
      const duration = config.msgDuration >= 0 ? config.msgDuration : 3000
      Vue.prototype.$message.error({
        message: data.msg,
        duration: duration
      })
    }
    return data
  },
  async error => {
    const res = { success: false, code: 0, msg: '' }

    if (error?.response) {
      if (error.config._request) {
        return res
      }

      const { config, data, status } = error.response
      if (_.isNumber(status)) {
        res.code = status
      }
      if (_.isPlainObject(data)) {
        _.merge(res, data)
      } else if (_.isString(data)) {
        res.msg = data || error.response.statusText
      }

      // 刷新令牌
      const { code } = res
      if (code === 401) {
        const resRefresh = await refresh({ token: store.getters.token })
        if (resRefresh.code === 1) {
          store.commit('user/setToken', resRefresh.data.token)
          error.config._request = true
          return requestAxios.request(error.config)
        } else {
          toLogout()
          return res
        }
      }

      // 错误消息
      if (!config.noErrorMsg && res.msg) {
        const duration = config.msgDuration >= 0 ? config.msgDuration : 3000
        Vue.prototype.$message.error({
          message: res.msg,
          duration: duration
        })
      }
    }
    return res
  }
)

export default requestAxios

// eslint-disable-next-line no-unused-vars
import { getPassWordEncryptKey, getLoginInfo, login } from '@/api/admin/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { encryptByDES } from '@/utils/crypto'
import { resetRouter, addRoutes } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: require('@/assets/images/avatar.png'),
  menus: [],
  permissions: []
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
    setToken(token)
  },
  setName: (state, name) => {
    state.name = name
  },
  setAvatar: (state, avatar) => {
    if (avatar) {
      state.avatar = process.env.VUE_APP_AVATAR_URL + avatar
    } else {
      state.avatar = require('@/assets/images/avatar.png')
    }
  },
  setMenus: (state, menus) => {
    state.menus = menus
  },
  setPermissions: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  async login({ commit }, paras) {
    const resPwd = await getPassWordEncryptKey()
    if (resPwd && resPwd.success) {
      paras.passwordKey = resPwd.data.key
      paras.password = encryptByDES(paras.password, resPwd.data.encyptKey)
    }

    const res = await login(paras)
    if (res && res.success) {
      const token = res.data.token
      commit('setToken', token)
    }

    return res
  },

  async getLoginInfo({ commit }) {
    const res = await getLoginInfo()
    if (!res?.success) {
      return res
    }

    const user = res.data.user
    if (!user) {
      return res
    }

    const name = user.nickName ? user.nickName : user.userName
    commit('setName', name)
    commit('setAvatar', user.avatar)
    commit('setMenus', res.data.menus)
    commit('setPermissions', res.data.permissions)
    addRoutes(res.data.menus)
    // localStorage.setItem('loginInfo', JSON.stringify(res.data))

    return res
  },

  setLocalLoginInfo({ commit, dispatch, state }) {
    let loginInfo = window.localStorage.getItem('loginInfo')
    if (loginInfo) {
      loginInfo = JSON.parse(loginInfo)
      const user = loginInfo.user
      const name = user.nickName ? user.nickName : user.userName
      commit('setName', name)
      commit('setAvatar', user.avatar)
      commit('setMenus', loginInfo.menus)
      addRoutes(loginInfo.menus)
    } else {
      dispatch('logout')
    }
  },

  logout({ commit }) {
    commit('setToken', '')
    removeToken()
    resetRouter()
    sessionStorage.removeItem('tabs')
    // localStorage.removeItem('loginInfo')

    commit('tabsView/delete_all_cached_views', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import Cookies from 'js-cookie'
export default {
  namespaced: true,
  state: {
    token: null,
    tokenExpire: null,
    tabsList: [],
    language: Cookies.get('language') || 'en'
  },
  mutations: {
    saveToken(state, data) {
      data = data || ''
      state.token = data
      window.localStorage.setItem('token', data)
    },
    saveTokenExpire(state, data) {
      data = data || ''
      state.tokenExpire = data
      window.localStorage.setItem('tokenExpire', data)
    },
    saveTabsData(state, data) {
      state.tabsList = data ? JSON.parse(data) : []
      sessionStorage.setItem('tabs', data)
    },
    setLanguage: (state, language) => {
      language = language || ''
      state.language = language
      Cookies.set('language', language)
    }
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('setLanguage', language)
    }
  }
}

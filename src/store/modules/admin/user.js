export default {
  namespaced: true,
  state: {
    orgId: null
  },
  mutations: {
    setOrgId(state, data) {
      state.orgId = data
    }
  }
}

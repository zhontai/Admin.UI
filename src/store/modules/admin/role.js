export default {
  namespaced: true,
  state: {
    roleId: null
  },
  mutations: {
    setRoleId(state, data) {
      state.roleId = data
    }
  }
}

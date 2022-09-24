export default {
  namespaced: true,
  state: {
    dictionaryTypeId: null
  },
  mutations: {
    setDictionaryTypeId(state, data) {
      state.dictionaryTypeId = data
    }
  }
}

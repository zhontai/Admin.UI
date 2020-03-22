export default {
  namespaced: true,
  state: {
    cachedViews: []
  },
  mutations: {
    set_cached_view: (state, views) => {
      state.cachedViews = views || []
    },
    add_cached_view: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache && view.name) {
        state.cachedViews.push(view.name)
      }
    },
    delete_cached_view: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    delete_all_cached_views: state => {
      state.cachedViews = []
    }
  },
  actions: {}
}

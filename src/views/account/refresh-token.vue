<template>
  <div v-loading="loading" style="width:100%;height:100%;" />
</template>
<script>
import { getNewAcessToken } from '@/utils/is4'

export default {
  name: 'RefreshToken',
  data() {
    return {
      loading: false
    }
  },
  async created() {
    this.loading = true
    const acessToken = await getNewAcessToken()
    if (acessToken) {
      this.$store.commit('user/setToken', acessToken)
    }
    this.loading = false
  }
}
</script>

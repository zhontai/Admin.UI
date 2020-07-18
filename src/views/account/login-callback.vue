<template>
  <div v-loading="loading" style="width:100%;height:100%;" />
</template>
<script>
import { getAcessToken } from '@/utils/is4'

export default {
  name: 'LoginCallback',
  data() {
    return {
      loading: false
    }
  },
  async created() {
    this.loading = true
    const acessToken = await getAcessToken()
    if (acessToken) {
      this.$store.commit('user/setToken', acessToken)
      const res = await this.$store.dispatch('user/getLoginInfo')
      if (res?.success) {
        const redirect = this.$route.query?.redirect ? this.$route.query.redirect : '/'
        this.$router.replace(redirect)
      }
    }
    this.loading = false
  }
}
</script>

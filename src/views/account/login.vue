<template>
  <div class="bg">
    <el-scrollbar class="page-component__scroll" style="height:100%;">
      <div style="height:10%;" />
      <el-card shadow="always" class="login-card" :body-style="{ padding: '0px' }">
        <div class="title">Admin</div>
        <div class="desc">admin 后台管理系统</div>
        <el-form ref="form" :model="form" :rules="formRules" size="medium">
          <el-form-item prop="userName">
            <el-input
              ref="userName"
              v-model="form.userName"
              type="text"
              auto-complete="off"
              placeholder="账号"
              @keyup.enter.native="onLogin"
            >
              <template #prefix>
                <i class="el-input__icon el-icon-user" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- <input type="password" style="display:none;width:0;height:0;"> -->
            <el-input
              ref="password"
              v-model="form.password"
              auto-complete="new-password"
              show-password
              placeholder="密码"
              @keyup.enter.native="onLogin"
            >
              <template #prefix>
                <i class="el-input__icon el-icon-lock" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              ref="verifyCode"
              v-model="form.verifyCode"
              type="text"
              clearable
              maxlength="4"
              auto-complete="off"
              placeholder="验证码"
              class="verifyCode"
              style="width:66%;"
              @keyup.enter.native="onLogin"
            >
              <template #prefix>
                <i class="el-input__icon fa fa-shield" />
              </template>
            </el-input>
            <img
              :src="verifyCodeUrl"
              alt
              style="width:33%;cursor: pointer;vertical-align: middle;"
              @click="getLoginVerifyCode"
            >
          </el-form-item>
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              type="primary"
              :loading="loginLoading"
              style="width:100%;"
              @click.native.prevent="onLogin"
            >{{ loginText }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div style="height:5%;" />
    </el-scrollbar>
  </div>
</template>

<script>
import { getVerifyCode } from '@/api/admin/auth'

export default {
  data() {
    return {
      form: {
        userName: 'user',
        password: '111111',
        verifyCode: '',
        verifyCodeKey: '',
        passwordKey: ''
      },
      formRules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      checked: true,
      verifyCodeUrl: '',
      loginLoading: false,
      loginText: '登录'
    }
  },
  created() {
    this.getLoginVerifyCode()
  },
  mounted() {
    this.$refs.verifyCode.focus()
    // window.localStorage.clear()
  },
  methods: {
    loginValidate() {
      let isValid = false
      this.$refs.form.validate(async valid => {
        isValid = valid
      })
      return isValid
    },

    // 登录获取Token
    async onLogin() {
      if (!this.loginValidate()) {
        return
      }

      this.loginLoading = true
      this.loginText = '登录中...'

      const paras = { ...this.form }
      const res = await this.$store.dispatch('user/login', paras)
      if (!res) {
        this.loginLoading = false
        this.loginText = '重新登录'
        return
      }

      if (!res.success) {
        this.loginLoading = false
        this.loginText = '重新登录'

        switch (res.data) {
          case 1:
            this.getLoginVerifyCode()
            this.$refs.verifyCode.focus()
            break
          case 2:
            this.$refs.verifyCode.focus()
            break
          case 3:
            this.getLoginVerifyCode()
            this.$refs.userName.focus()
            break
          case 4:
            this.getLoginVerifyCode()
            this.$refs.password.focus()
            break
        }
        return
      }

      this.getLoginInfo()
    },
    async getLoginInfo() {
      const res = await this.$store.dispatch('user/getLoginInfo')
      this.loginLoading = false

      if (!res?.success) {
        this.loginLoading = false
        this.loginText = '重新登录'
        return
      }

      if (!(res.data?.menus?.length > 0)) {
        this.loginLoading = false
        this.loginText = '重新登录'
        this.$message({
          message: '该账号未分配权限，请联系管理员！',
          type: 'error'
        })
        return
      }

      const redirect = this.$route.query ? this.$route.query.redirect : ''
      this.$router.push({ path: redirect || '/' })
    },

    // 获取验证码
    async getLoginVerifyCode() {
      this.form.verifyCode = ''
      const res = await getVerifyCode({ lastKey: this.form.verifyCodeKey })
      if (res && res.success) {
        this.verifyCodeUrl = 'data:image/png;base64,' + res.data.img
        this.form.verifyCodeKey = res.data.key
      }
    }
  }
}
</script>

<style scoped>
.bg {
  height: 100%;
  background: #3a8ee6;
  background: -webkit-linear-gradient(top left, #3a8ee6 0%, #3a8ee6 100%);
  background: linear-gradient(to bottom right, #3a8ee6 0, #3a8ee6);
  opacity: 0.8;
}
.bg ::v-deep .el-scrollbar__view {
  height: 100%;
}
.verifyCode ::v-deep .el-input__inner {
  letter-spacing: 2px;
}

@media screen and (max-width: 768px) {
  .login-card {
    width: 70%;
  }
}
</style>
<style lang="scss" scoped>
.login-card {
  width: 320px;
  padding: 25px 25px 5px 25px;
  position: relative;
  margin: 0 auto;

  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 33px;
    font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
    vertical-align: middle;
    margin: 0px;
    text-align: center;
  }

  .desc {
    margin-top: 12px;
    margin-bottom: 30px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
  }

  .remember {
    margin: 0px 0px 25px 0px;
  }
}
</style>

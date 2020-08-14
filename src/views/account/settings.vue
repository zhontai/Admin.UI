<template>
  <section v-loading="loading" :class="isPc ? 'pc' : ''">
    <el-tabs :tab-position="tabsPosition" style="padding: 20px;">
      <el-tab-pane label="基本设置" style="padding: 8px 30px;">
        <div class="title">基本设置</div>
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-position="top"
          label-width="80px"
          @submit.native.prevent
        >
          <el-row :gutter="50">
            <el-col :sm="12" :xs="24">
              <el-form-item label="我的昵称" prop="nickName">
                <el-input v-model="editForm.nickName" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="editForm.remark" type="textarea" rows="4" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="头像">
                <el-upload
                  v-loading="avatarLoading"
                  class="avatar-uploader"
                  action="/api/admin/user/avatarupload"
                  :headers="token"
                  :show-file-list="false"
                  :before-upload="()=>{avatarLoading = true}"
                  :on-success="onAvatarSuccess"
                  :on-error="onAvatarError"
                  style="display: inline-block;"
                >
                  <el-image class="el-avatar el-avatar--square" :src="avatar" style="height:90px;width:90px;line-height: 90px;">
                    <template #error>
                      <img :src="avatarDefault">
                    </template>
                  </el-image>
                  <div>
                    <el-button plain style="width:90px;">
                      <i class="el-icon-upload el-icon--left" />上传
                    </el-button>
                  </div>
                </el-upload>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="checkPermission(['api:admin:user:updatebasic'])">
            <el-col :sm="12" :xs="24">
              <el-form-item>
                <my-confirm-button
                  :disabled="disabled"
                  :validate="editFormvalidate"
                  :placement="'top-end'"
                  :loading="editLoading"
                  style="margin-left:0px;"
                  @click="onSubmit"
                >
                  <template #content>
                    <p>确定要更新基本信息吗？</p>
                  </template>
                  更新基本信息
                </my-confirm-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="安全设置" style="padding: 8px 30px;">
        <div class="title">安全设置</div>
        <el-form
          ref="editPwdForm"
          :model="editPwdForm"
          :rules="editPwdFormRules"
          label-position="top"
          label-width="80px"
          @submit.native.prevent
        >
          <el-row>
            <el-col :sm="12" :xs="24">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  v-model="editPwdForm.oldPassword"
                  type="text"
                  show-password
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :xs="24">
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="editPwdForm.newPassword" show-password auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :xs="24">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="editPwdForm.confirmPassword" show-password auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="checkPermission(['api:admin:user:changepassword'])">
            <el-col :sm="12" :xs="24">
              <el-form-item>
                <my-confirm-button
                  :disabled="disabled"
                  :validate="editPwdFormvalidate"
                  :placement="'top-end'"
                  :loading="editPwdLoading"
                  style="margin-left:0px;"
                  @click="onSubmitPwd"
                >
                  <template #content>
                    <p>确定要更新密码吗？</p>
                  </template>
                  更新密码
                </my-confirm-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import MyConfirmButton from '@/components/my-confirm-button'
import { getBasic, changePassword, updateBasicUser } from '@/api/admin/user'
export default {
  name: 'Settins',
  components: {
    MyConfirmButton
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.editPwdForm.confirmPassword !== '') {
          this.$refs.editPwdForm.validateField('confirmPassword')
        }
        callback()
      }
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.editPwdForm.newPassword) {
        callback(new Error('新密码和确认密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      isPc: true,
      tabsPosition: 'left',
      editFormRules: {
        nickName: [{ required: true, message: '请输入我的昵称', trigger: 'blur' }]
      },
      editForm: {
        id: 0,
        nickName: '',
        remark: '',
        avatar: '',
        version: 0
      },

      editPwdFormRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
        confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
      },
      editPwdForm: {
        id: 0,
        password: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        version: 0
      },
      loading: false,
      editLoading: false,
      editPwdLoading: false,
      avatarLoading: false,
      avatarDefault: require('@/assets/images/avatar.png')
    }
  },
  computed: {
    avatar() {
      const path = this.editForm.avatar ? (process.env.VUE_APP_AVATAR_URL + this.editForm.avatar) : this.avatarDefault
      return path
    },
    token() {
      return { 'Authorization': 'Bearer ' + this.$store.getters.token }
    },
    disabled() {
      return !(this.editForm.id > 0)
    }
  },
  created() {
    this.isPc = window.innerWidth >= 768
    this.tabsPosition = this.isPc ? 'left' : 'top'
  },
  async mounted() {
    this.loading = true
    const res = await getBasic()
    this.loading = false
    if (!res?.success) {
      return
    }

    const data = res.data
    this.editForm = { ...data }
    this.editPwdForm.id = data.id
    this.editPwdForm.version = data.version
  },
  methods: {
    // 上传成功
    onAvatarSuccess(res) {
      this.avatarLoading = false
      if (!res?.code === 1) {
        return
      }
      this.editForm.avatar = res.data
    },
    // 上传失败
    onAvatarError(err, file) {
      this.avatarLoading = false
      const res = err.message ? JSON.parse(err.message) : {}
      if (!(res?.code === 1)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }
    },
    editFormvalidate() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    async onSubmit() {
      this.editLoading = true
      const para = { ...this.editForm }
      const res = await updateBasicUser(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }
      ++this.editForm.version
      ++this.editPwdForm.version
      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$store.commit('user/setName', para.nickName)
      this.$store.commit('user/setAvatar', para.avatar)
    },
    editPwdFormvalidate() {
      let isValid = false
      this.$refs.editPwdForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    async onSubmitPwd() {
      this.editPwdLoading = true
      const para = { ...this.editPwdForm }
      const res = await changePassword(para)
      this.editPwdLoading = false

      if (!res?.success) {
        return
      }
      ++this.editForm.version
      ++this.editPwdForm.version
      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })

      this.$refs['editPwdForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.title {
  margin-bottom: 22px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.pc ::v-deep .el-tabs--left .el-tabs__header.is-left {
  margin-right: -1px;
}
.pc ::v-deep .el-tabs__content::before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 100%;
  background-color: #e4e7ed;
  z-index: 0;
  top: 0;
}

.avatar-uploader ::v-deep .el-loading-spinner .circular{
  width:26px;
  height:26px;
}
</style>

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
                <el-avatar shape="square" :src="avatar" :size="90">
                  <img :src="avatarDefault">
                </el-avatar>
                <div>
                  <el-button plain>
                    <i class="el-icon-upload el-icon--right" />上传
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :xs="24">
              <el-form-item>
                <confirm-button
                  :validate="editFormvalidate"
                  :placement="'top-end'"
                  :loading="editLoading"
                  style="margin-left:0px;"
                  @click="onSubmit"
                >
                  <p slot="content">确定要更新基本信息吗？</p>更新基本信息
                </confirm-button>
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
          <el-form-item>
            <confirm-button
              :validate="editPwdFormvalidate"
              :placement="'top-start'"
              :loading="editPwdLoading"
              style="margin-left:0px;"
              @click="onSubmitPwd"
            >
              <p slot="content">确定要更新密码吗？</p>更新密码
            </confirm-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import ConfirmButton from '@/components/ConfirmButton'
import { getBasic, changePassword, updateBasicUser } from '@/api/admin/user'
export default {
  name: 'Settins',
  components: {
    ConfirmButton
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
        callback(new Error('输入确认密码'))
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
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
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
      avatarDefault: require('@/assets/avatar.png')
    }
  },
  computed: {
    avatar() {
      return this.editForm.avatar ? (process.env.VUE_APP_AVATAR_URL + this.editForm.avatar) : this.avatarDefault
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
    if (!res) {
      return
    }
    if (!res.success) {
      if (res.msg) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
      return
    }

    const data = res.data
    this.editForm = { ...data }
    this.editPwdForm.id = data.id
    this.editPwdForm.version = data.version
  },
  methods: {
    editFormvalidate: function() {
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

      if (res.success) {
        ++this.editForm.version
        ++this.editPwdForm.version
        this.$message({
          message: this.$t('admin.updateOk'),
          type: 'success'
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    editPwdFormvalidate: function() {
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

      if (res.success) {
        ++this.editForm.version
        ++this.editPwdForm.version
        this.$message({
          message: this.$t('admin.updateOk'),
          type: 'success'
        })

        this.$refs['editPwdForm'].resetFields()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
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
.pc >>> .el-tabs--left .el-tabs__header.is-left {
  margin-right: -1px;
}
.pc >>> .el-tabs__content::before {
  content: "";
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 100%;
  background-color: #e4e7ed;
  z-index: 0;
  top: 0;
}
</style>

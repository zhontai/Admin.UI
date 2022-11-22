<template>
  <my-container
    left-aside-width="280px"
    :left-aside-resize-options="resizeOptions"
    :show-left-aside="true"
    :resizable="true"
    :show-header="false"
    :show-footer="false"
    :main-style="'padding:0px;'"
  >
    <template #left-aside>
      <my-user-org @change="onOrgChange" />
    </template>
    <my-container v-loading="pageLoading">
      <!--顶部操作-->
      <template #header>
        <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
          <el-form-item>
            <my-search :fields="fields" @click="onSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
          </el-form-item>
          <el-form-item v-if="checkPermission(['api:admin:user:add'])">
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
          <el-form-item v-if="checkPermission(['api:admin:user:batchdelete'])">
            <my-confirm-button
              :disabled="sels.length === 0"
              :type="'delete'"
              :placement="'bottom-end'"
              :loading="deleteLoading"
              :validate="batchDeleteValidate"
              style="margin-left: 0px;"
              @click="onBatchDelete"
            >
              <template #content>
                <p>确定要批量删除吗？</p>
              </template>
              批量删除
            </my-confirm-button>
          </el-form-item>
        </el-form>
      </template>

      <!--列表-->
      <el-table
        v-loading="listLoading"
        :data="users"
        highlight-current-row
        height="'100%'"
        style="width: 100%;height:100%;"
        :row-key="(row)=>row.id"
        @selection-change="onSelsChange"
      >
        <template #empty>
          <el-empty :image-size="100" />
        </template>
        <el-table-column type="selection" reserve-selection width="50" />
        <el-table-column prop="userName" label="用户名" width>
          <template #default="{row}">
            {{ row.userName }} <el-tag v-if="row.isManager" type="success">主管</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width />
        <el-table-column prop="mobile" label="手机号" width />
        <el-table-column prop="email" label="邮箱" width />
        <el-table-column prop="roleNames" label="角色" width>
          <template #default="{row}">
            {{ row.roleNames ? row.roleNames.join(','):'' }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['api:admin:user:update','api:admin:user:delete','api:admin:user:reset-password','api:admin:user:set-manager'])" label="操作" width="180">
          <template #default="{ row }">
            <el-dropdown
              v-if="checkPermission(['api:admin:user:update','api:admin:user:reset-password','api:admin:user:set-manager'])"
              :split-button="checkPermission(['api:admin:user:update'])"
              style="margin-left:10px;"
              @click="onEdit(row)"
              @command="(command)=>onCommand(command,row)"
            >
              <template v-if="checkPermission(['api:admin:user:update'])">
                编辑
              </template>
              <el-button v-else type="primary">
                更多 <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;width:100px;text-align:right;">
                  <el-dropdown-item v-if="checkPermission(['api:admin:user:reset-password'])" command="resetPassword">重置密码</el-dropdown-item>
                  <el-dropdown-item v-if="checkPermission(['api:admin:user:set-manager'])" command="setManager">{{ row.isManager?'取消':'设置' }}主管</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <my-confirm-button
              v-if="checkPermission(['api:admin:user:delete'])"
              type="delete"
              :loading="row._loading"
              :validate="deleteValidate"
              :validate-data="row"
              @click="onDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <template #footer>
        <my-pagination
          ref="pager"
          :total="total"
          :checked-count="sels.length"
          @get-page="getUsers"
        />
      </template>

      <!--高级查询窗口-->
      <my-search-window
        :visible.sync="searchWindowVisible"
        :fields="fields"
        :modal="false"
        width="600px"
        @click="onSearchFilter"
      />

      <!--新增编辑窗口-->
      <my-window
        v-if="checkPermission(['api:admin:user:add'])"
        :title="`${ form.id > 0 ? '编辑' : '新增' }用户`"
        embed
        drawer
        :visible.sync="formVisible"
        @close="closeForm"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="90px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="form.mobile" autocomplete="off" maxlength="11" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="部门" prop="orgs">
                  <my-select
                    v-model="form.orgs"
                    :props="{ label:'name' }"
                    value-key="id"
                    multiple
                    placeholder="请选择部门"
                    style="width:100%;"
                    @click.native="onOpenOrg('form')"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="主属部门" prop="orgId">
                  <el-select v-model="form.orgId" placeholder="请选择主属部门" style="width:100%;">
                    <el-option
                      v-for="item in form.orgs"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="用户名" prop="userName">
                  <el-input
                    v-model="form.userName"
                    autocomplete="off"
                    :readonly="userNameReadonly"
                    @focus="userNameReadonly = false"
                    @blur="userNameReadonly = true"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="!(form.id>0)" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="密码" prop="password">
                  <el-input key="password" v-model="form.password" show-password autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="直属主管" prop="email">
                  <el-input v-model="form.managerUserName" placeholder="请选择直属主管" readonly autocomplete="off" class="input-with-select" @click.native="onOpenSelectManager">
                    <template slot="append">
                      <el-button icon="el-icon-more" @click="onOpenSelectManager" />
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="角色" prop="roles">
                  <my-select
                    v-model="form.roles"
                    :props="{ label:'name' }"
                    value-key="id"
                    multiple
                    placeholder="请选择角色"
                    style="width:100%;"
                    @click.native="onOpenRole('form')"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" autocomplete="off" />
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button @click.native="formVisible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="formvalidate" :loading="loading" @click="onSubmit" />
        </template>
      </my-window>

      <my-select-window-org
        ref="org"
        :visible.sync="orgVisible"
        multiple
        :form="orgForm"
        @click="onSelectOrg"
      />

      <my-select-window-role
        ref="role"
        :visible.sync="roleVisible"
        multiple
        :form="roleForm"
        @click="onSelectRole"
      />

      <!--选择直属主管-->
      <my-select-user
        title="选择直属主管"
        :multiple="false"
        :visible.sync="selectManagerVisible"
        @click="onSelectManager"
      />
    </my-container>
  </my-container>
</template>

<script>
import userApi from '@/api/admin/user'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'
import MySelect from '@/components/my-select'
import MySelectWindowOrg from '@/components/my-select-window/org'
import MySelectWindowRole from '@/components/my-select-window/role'
import MySelectUser from '@/components/my-select-window/user'
import MyUserOrg from './org'
import { testMobile } from '@/utils/test'

/**
 * 用户管理
 */
export default {
  name: 'User',
  _sync: {
    disabled: false,
    title: '用户管理',
    desc: '',
    cache: true
  },
  components: {
    MyUserOrg,
    MyConfirmButton,
    MySearch,
    MySearchWindow,
    MyWindow,
    MySelectWindowOrg,
    MySelect,
    MySelectWindowRole,
    MySelectUser
  },
  data() {
    const formData = {
      userName: '',
      name: '',
      password: '',
      roles: [],
      orgs: [],
      orgId: null,
      staff: {},
      managerUserId: null,
      managerUserName: ''
    }
    return {
      // 高级查询字段
      fields: [
        { value: 'name', label: '姓名', type: 'string' },
        { value: 'mobile', label: '手机号', type: 'string' },
        { value: 'email', label: '邮箱', type: 'string' },
        { value: 'userName', label: '用户名', type: 'string' },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,
      sels: [],
      users: [],
      roles: [],
      select: { roles: [] },
      total: 0,
      listLoading: false,

      pageLoading: false,

      userNameReadonly: true,
      formVisible: false, // 新增界面是否显示
      loading: false,
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: testMobile, trigger: ['blur', 'change'] }
        ],
        email: [{ type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }],
        'orgs': [{ required: true, message: '请选择部门', trigger: 'change' }],
        'orgId': [{ required: true, message: '请选择主属部门', trigger: 'change' }],
        userName: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
      },
      initForm: _.cloneDeep(formData),
      // 新增界面数据
      form: _.cloneDeep(formData),
      deleteLoading: false,

      orgForm: null,
      orgVisible: false,

      roleForm: null,
      roleVisible: false,

      orgId: null,
      org: null,

      selectManagerVisible: false
    }
  },
  computed: {
    orgLabels() {
      return this.form.staff?.orgs?.map(a => a.name)
    },
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 160,
        maxWidth: 500,
        autoCalcRange: false
      }
    }
  },
  watch: {
    'form.orgs'() {
      if (this.form.orgs.some(a => a.id === this.form.orgId)) {
        return
      }
      this.form.orgId = this.form.orgs.length > 0 ? this.form.orgs[0].id : null
    },
    'form.mobile'(v) {
      if (!(this.form.id > 0)) {
        this.form.userName = v
      }
    }
  },
  methods: {
    onOpenSelectManager() {
      this.selectManagerVisible = true
    },
    onOrgChange(row) {
      if (row?.id > 0) {
        this.org = { id: row.id, name: row.name }
        this.orgId = row.id
        this.getUsers()
      }
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getUsers()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getUsers()
      this.searchWindowVisible = false
    },

    // 获取用户列表
    async getUsers() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter,
        filter: { orgId: this.orgId }
      }

      this.listLoading = true
      const res = await userApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.users = data
    },
    // 显示新增界面
    async onAdd() {
      this.form = _.cloneDeep(this.initForm)
      this.form.orgs = [_.cloneDeep(this.org)]
      this.formVisible = true
    },
    // 显示编辑界面
    async onEdit(row) {
      this.pageLoading = true
      const res = await userApi.get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        this.formVisible = true
        const data = _.cloneDeep(this.initForm)
        _.merge(data, res.data)
        if (!data.staff) {
          data.staff = {}
        }

        this.form = data
      }
    },
    closeForm() {
      this.$refs.form.resetFields()
    },
    // 新增验证
    formvalidate() {
      let isValid = false
      this.$refs.form.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 新增
    async onSubmit() {
      this.loading = true
      const para = _.cloneDeep(this.form)
      para.roleIds = para.roles?.map(a => a.id)
      para.orgIds = para.orgs?.map(a => a.id)
      delete para.roles
      delete para.orgs
      const res = await userApi[para.id > 0 ? 'update' : 'add'](para)
      this.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: para.id > 0 ? this.$t('admin.updateOk') : this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs['form'].resetFields()
      this.formVisible = false
      this.getUsers()
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true
      if (row && (row.type === 10 || row.type === 100)) {
        this.$message({
          message: row.name + '为平台管理员禁止删除',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 删除
    async onDelete(row) {
      row._loading = true
      const para = { id: row.id }
      const res = await userApi.deleteAsync(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getUsers()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true
      var row = this.sels && this.sels.find(s => s.type === 10 || s.type === 100)
      if (row) {
        this.$message({
          message: row.name + '为平台管理员禁止删除',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await userApi.batchDelete(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getUsers()
    },
    onOpenRole(form) {
      this.roleForm = form
      this.roleVisible = true
      this.$nextTick(() => {
        this.$refs.role.setCheckedList(this[form].roles)
      })
    },
    onSelectRole(form, selectData) {
      this[form].roles = selectData.map(a => { return { id: a.id, name: a.name } })
      this.roleVisible = false
    },
    onOpenOrg(form) {
      this.orgForm = form
      this.orgVisible = true
      this.$nextTick(() => {
        this.$refs.org.setCheckedNodes(this[form].orgs)
      })
    },
    onSelectOrg(form, selectData) {
      this[form].orgs = selectData.map(a => { return { id: a.id, name: a.name } })
      this.orgVisible = false
    },
    // 重置密码
    async resetPassword() {
      this.pageLoading = true
      const para = { id: this.currentRow?.id }
      const res = await userApi.resetPassword(para)
      this.pageLoading = false
      if (!res?.success) {
        this.$message({
          message: '重置密码失败',
          type: 'error'
        })
        return
      }

      this.$message({
        message: `重置密码成功，密码为【${res.data}】`,
        type: 'success'
      })

      this.getUsers()
    },
    // 设置主管
    async setManager(row) {
      this.pageLoading = true
      const name = row.isManager ? '取消' : '设置'
      const para = { userId: row.id, orgId: this.orgId, isManager: !row.isManager }
      const res = await userApi.setManager(para)
      this.pageLoading = false
      if (!res?.success) {
        this.$message({
          message: `${name}主管失败`,
          type: 'error'
        })
        return
      }

      this.$message({
        message: `${name}主管成功`,
        type: 'success'
      })

      this.getUsers()
    },
    // 更多操作
    onCommand(command, row) {
      const me = this
      this.currentRow = row
      if (command === 'resetPassword') {
        this.$confirm('确定要重置密码?', '提示').then(() => {
          me.resetPassword()
        }).catch(() => {})
      } else if (command === 'setManager') {
        const name = row.isManager ? '取消' : '设置'
        this.$confirm(`确定要${name}主管?`, '提示').then(() => {
          me.setManager(row)
        }).catch(() => {})
      }
    },
    // 选择直属主管
    onSelectManager(data) {
      if (data?.id > 0) {
        console.log(11)
        this.form.managerUserId = data.id
        this.form.managerUserName = data.name
      } else {
        console.log(22)
        this.form.managerUserId = null
        this.form.managerUserName = ''
      }

      this.selectManagerVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
</style>

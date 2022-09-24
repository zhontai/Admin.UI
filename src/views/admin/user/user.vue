<template>
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
        <el-form-item v-if="checkPermission(['api:admin:user:batchsoftdelete'])">
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
      @selection-change="onSelsChange"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="userName" label="用户名" width />
      <el-table-column prop="name" label="姓名" width />
      <el-table-column prop="roleNames" label="角色" width>
        <template #default="{row}">
          {{ row.roleNames ? row.roleNames.join(','):'' }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:admin:user:update','api:admin:user:softdelete'])" label="操作" width="180">
        <template #default="{ row }">
          <el-button v-if="checkPermission(['api:admin:user:update'])" @click="onEdit(row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:user:softdelete'])"
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
                <el-input v-model="form.mobile" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="部门" prop="emp.orgs">
                <my-select
                  v-model="form.emp.orgs"
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
              <el-form-item label="主属部门" prop="emp.mainOrgId">
                <el-select v-model="form.emp.mainOrgId" placeholder="请选择主属部门" style="width:100%;">
                  <el-option
                    v-for="item in form.emp.orgs"
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
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" autocomplete="off" />
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
  </my-container>
</template>

<script>
import userApi from '@/api/admin/user'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'
import MySelect from '@/components/my-select'
import MySelectWindowOrg from '@/components/my-select-window/organization'
import MySelectWindowRole from '@/components/my-select-window/role'
import { mapState } from 'vuex'
import { testMobile } from '@/utils/test'

export default {
  name: 'MyPageUser',
  _sync: {
    disabled: true
  },
  components: { MyConfirmButton, MySearch, MySearchWindow, MyWindow, MySelectWindowOrg, MySelect, MySelectWindowRole },
  data() {
    const formData = {
      userName: '',
      name: '',
      password: '',
      roles: [],
      emp: {
        orgs: [],
        mainOrgId: null
      }
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

      users: [],
      roles: [],
      select: { roles: [] },
      total: 0,
      sels: [], // 列表选中列
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
        'emp.orgs': [{ required: true, message: '请选择部门', trigger: 'change' }],
        'emp.mainOrgId': [{ required: true, message: '请选择主属部门', trigger: 'change' }],
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
      roleVisible: false
    }
  },
  computed: {
    ...mapState('admin/user', {
      orgId: 'orgId'
    }),
    orgLabels() {
      return this.form.emp?.orgs?.map(a => a.name)
    }
  },
  watch: {
    orgId(v, ov) {
      if (v > 0) {
        this.getUsers()
      }
    },
    'form.emp.orgs'() {
      if (this.form.emp.orgs.some(a => a.id === this.form.emp.mainOrgId)) {
        return
      }
      this.form.emp.mainOrgId = this.form.emp.orgs.length > 0 ? this.form.emp.orgs[0].id : null
    }
  },
  methods: {
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
        filter: this.orgId
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
        if (!data.emp) {
          data.emp = {
            orgs: [],
            mainOrgId: null
          }
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
      para.emp.orgIds = para.emp?.orgs?.map(a => a.id)
      delete para.roles
      delete para.emp.orgs
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
      if (row && row.userName === 'admin') {
        this.$message({
          message: row.name + '，禁止删除！',
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
      var row = this.sels && this.sels.find(s => s.userName === 'admin')
      if (row && row.userName === 'admin') {
        this.$message({
          message: row.name + '，禁止删除！',
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
    // 选择
    onSelsChange(sels) {
      this.sels = sels
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
        this.$refs.org.setCheckedNodes(this[form].emp.orgs)
      })
    },
    onSelectOrg(form, selectData) {
      this[form].emp.orgs = selectData.map(a => { return { id: a.id, name: a.name } })
      this.orgVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
</style>

<template>
  <my-container v-loading="pageLoading">
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="租户名"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:tenant:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:tenant:batchsoftdelete'])">
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
      :data="tenants"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="name" label="租户名" width />
      <el-table-column prop="code" label="编码" width />
      <el-table-column prop="dbTypeName" label="数据库" width="120" />
      <el-table-column prop="idleTime" label="空闲时间（分）" width="120" />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <!--<el-table-column prop="CreatedUserName" label="创建者" width="" >-->
      <!--</el-table-column>-->
      <el-table-column prop="enabled" label="状态" width="80">
        <template #default="{row}">
          <el-tag
            :type="row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:admin:tenant:update','api:admin:tenant:softdelete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:admin:tenant:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:tenant:softdelete'])"
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
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
        @get-page="getTenants"
      />
    </template>

    <!--新增窗口-->
    <el-drawer
      v-if="checkPermission(['api:admin:tenant:add'])"
      title="新增租户"
      :modal="false"
      :wrapper-closable="true"
      :modal-append-to-body="false"
      :visible.sync="addFormVisible"
      direction="btt"
      size="'auto'"
      class="el-drawer__wrapper"
      style="position:absolute;"
      @close="closeAddForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="120px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="租户名" prop="name">
                <el-input v-model="addForm.name" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="编码" prop="code">
                <el-input v-model="addForm.code" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="数据库" prop="dbType">
                <el-select v-model="addForm.dbType" filterable placeholder="请选择数据库" style="width:100%;">
                  <el-option
                    v-for="item in dbTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="空闲时间（分）" prop="idleTime">
                <el-input-number v-model="addForm.idleTime" controls-position="right" :min="1" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="状态" prop="enabled">
                <el-select v-model="addForm.enabled" placeholder="请选择租户状态" style="width:100%;">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <el-form-item label="连接字符串" prop="connectionString">
                <el-input v-model="addForm.connectionString" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <el-form-item label="说明" prop="description">
                <el-input v-model="addForm.description" type="textarea" :rows="2" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="addFormValidate" :loading="addLoading" @click="onAddSubmit" />
      </div>
    </el-drawer>

    <!--编辑窗口-->
    <el-drawer
      v-if="checkPermission(['api:admin:tenant:update'])"
      title="编辑租户"
      :modal="false"
      :wrapper-closable="true"
      :modal-append-to-body="false"
      :visible.sync="editFormVisible"
      direction="btt"
      size="'auto'"
      style="position:absolute;"
      @close="closeEditForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="120px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="租户名" prop="name">
                <el-input v-model="editForm.name" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="编码" prop="code">
                <el-input v-model="editForm.code" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="数据库" prop="dbType">
                <el-select v-model="editForm.dbType" filterable placeholder="请选择数据库" style="width:100%;">
                  <el-option
                    v-for="item in dbTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="空闲时间（分）" prop="idleTime">
                <el-input-number v-model="editForm.idleTime" controls-position="right" :min="1" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="状态" prop="enabled">
                <el-select v-model="editForm.enabled" placeholder="请选择租户状态" style="width:100%;">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <el-form-item label="连接字符串" prop="connectionString">
                <el-input v-model="editForm.connectionString" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <el-form-item label="说明" prop="description">
                <el-input v-model="editForm.description" type="textarea" :rows="2" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormValidate" :loading="editLoading" @click="onEditSubmit" />
      </div>
    </el-drawer>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getTenantListPage, removeTenant, editTenant, addTenant, batchRemoveTenant, getTenant } from '@/api/admin/tenant'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Tenants',
  components: { MyContainer, MyConfirmButton },
  data() {
    return {
      filter: {
        name: ''
      },
      tenants: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      dbTypeList: [
        { 'label': 'MySql', 'value': 0 },
        { 'label': 'SqlServer', 'value': 1 },
        { 'label': 'PostgreSQL', 'value': 2 },
        { 'label': 'Oracle', 'value': 3 },
        { 'label': 'Sqlite', 'value': 4 },
        { 'label': 'OdbcOracle', 'value': 5 },
        { 'label': 'OdbcSqlServer', 'value': 6 },
        { 'label': 'OdbcMySql', 'value': 7 },
        { 'label': 'OdbcPostgreSQL', 'value': 8 },
        { 'label': 'Odbc', 'value': 9 },
        { 'label': 'OdbcDameng', 'value': 10 },
        { 'label': 'MsAccess', 'value': 11 },
        { 'label': 'Dameng', 'value': 12 },
        { 'label': 'OdbcKingbaseES', 'value': 13 },
        { 'label': 'ShenTong', 'value': 14 },
        { 'label': 'KingbaseES', 'value': 15 },
        { 'label': 'Firebird', 'value': 16 }
      ],
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入租户名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        code: '',
        dbType: 0,
        connectionString: '',
        idleTime: 10,
        description: '',
        enabled: true
      },
      editFormRef: null,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入租户名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        code: '',
        dbType: 0,
        connectionString: '',
        idleTime: 10,
        description: '',
        enabled: true
      },
      addFormRef: null,
      deleteLoading: false
    }
  },
  mounted() {
    this.getTenants()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getTenants()
    },
    // 获取租户列表
    async getTenants() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getTenantListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.tenants = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await getTenant({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        const data = res.data
        this.editForm = data
        this.editFormVisible = true
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 显示新增界面
    onAdd() {
      this.addFormVisible = true
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 编辑验证
    editFormValidate: function() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true
      const para = _.cloneDeep(this.editForm)

      const res = await editTenant(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getTenants()
    },
    // 新增验证
    addFormValidate: function() {
      let isValid = false
      this.$refs.addForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 新增
    async onAddSubmit() {
      this.addLoading = true
      const para = _.cloneDeep(this.addForm)

      const res = await addTenant(para)
      this.addLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
      this.getTenants()
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true
      if (row && row.name === 'admin') {
        this.$message({
          message: row.description + '，禁止删除！',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removeTenant(para)
      row._loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getTenants()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true
      var row = this.sels && this.sels.find(s => s.name === 'admin')
      if (row && row.name === 'admin') {
        this.$message({
          message: row.description + '，禁止删除！',
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
      const res = await batchRemoveTenant(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getTenants()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner{
  text-align: left;
}
</style>

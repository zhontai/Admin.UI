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
        <el-form-item v-if="checkPermission(['api:admin:employee:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:employee:batchsoftdelete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
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
      :data="employees"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="onSelsChange"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名" width />
      <el-table-column prop="organizationName" label="部门" width />
      <el-table-column prop="position" label="岗位" width />
      <el-table-column prop="entryTime" label="入职时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column v-if="checkPermission(['api:admin:employee:update','api:admin:employee:softdelete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:admin:employee:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:employee:softdelete'])"
            type="delete"
            :loading="row._loading"
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
        @get-page="getEmployees"
      />
    </template>

    <!--高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      :modal="false"
      @click="onSearchFilter"
    />

    <!--新增窗口-->
    <my-window
      v-if="checkPermission(['api:admin:employee:add'])"
      title="新增员工"
      embed
      drawer
      :visible.sync="addFormVisible"
      @close="onCloseAddForm"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="部门" prop="email">
              <el-input v-model="addForm.organizationName" placeholder="请选择部门" readonly autocomplete="off" class="input-with-select" @click.native="onOpenOrganization('addForm')">
                <el-button slot="append" icon="el-icon-more" @click="onOpenOrganization('addForm')" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="岗位" prop="email">
              <el-input v-model="addForm.position" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="addForm.nickName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="工号" prop="code">
              <el-input v-model="addForm.code" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addForm.phone" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="addForm.email" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                v-model="addForm.entryTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="addFormvalidate" :loading="addLoading" @click="onAddSubmit" />
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:employee:update'])"
      title="编辑员工"
      embed
      drawer
      :visible.sync="editFormVisible"
      @close="onCloseEditForm"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="部门" prop="email">
              <el-input v-model="editForm.organizationName" placeholder="请选择部门" readonly autocomplete="off" class="input-with-select" @click.native="onOpenOrganization('editForm')">
                <el-button slot="append" icon="el-icon-more" @click="onOpenOrganization('editForm')" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="岗位" prop="email">
              <el-input v-model="editForm.position" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="editForm.nickName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="工号" prop="code">
              <el-input v-model="editForm.code" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="editForm.phone" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="editForm.email" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                v-model="editForm.entryTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormvalidate" :loading="editLoading" @click="onEditSubmit" />
      </template>
    </my-window>

    <my-select-organization :visible.sync="organizationVisible" :form="organizationForm" @click="onSelectOrganization" />
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import employeeApi from '@/api/admin/employee'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'
import MySelectOrganization from '@/components/my-select-window/organization'

export default {
  name: 'Employee',
  _sync: {
    disabled: false,
    title: '员工管理',
    desc: '',
    cache: true
  },
  components: { MyConfirmButton, MySearch, MySearchWindow, MyWindow, MySelectOrganization },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }

    return {
      // 高级查询字段
      fields: [
        { value: 'name', label: '姓名', default: true },
        { value: 'nickName', label: '昵称', type: 'string' },
        { value: 'entryTime', label: '入职时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,

      organizationForm: null,
      organizationVisible: false,

      employees: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        nickName: ''
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 新增界面数据
      addForm: {
        name: '',
        nickName: ''
      },
      deleteLoading: false,
      datePickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // }
      }
    }
  },
  async mounted() {
    await this.getEmployees()
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getEmployees()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getEmployees()
      this.searchWindowVisible = false
    },

    // 获取员工列表
    async getEmployees() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }

      this.listLoading = true
      const res = await employeeApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.employees = data
    },
    // 显示新增界面
    async onAdd() {
      this.addForm = {}
      this.addFormVisible = true
    },
    onCloseAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 新增验证
    addFormvalidate() {
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

      const res = await employeeApi.add(para)
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
      this.getEmployees()
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await employeeApi.get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        const data = res.data
        this.editForm = data
        this.editFormVisible = true
      }
    },
    onCloseEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 编辑验证
    editFormvalidate() {
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

      const res = await employeeApi.update(para)
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
      this.getEmployees()
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await employeeApi.softDelete(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getEmployees()
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await employeeApi.batchSoftDelete(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getEmployees()
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    onOpenOrganization(form) {
      this.organizationVisible = true
      this.organizationForm = form
    },
    onSelectOrganization(form, selectData) {
      if (selectData) {
        this[form].organizationName = selectData.name
        this[form].organizationId = selectData.id
      }

      this.organizationVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:100%;
  margin-left: 0px;
}
</style>

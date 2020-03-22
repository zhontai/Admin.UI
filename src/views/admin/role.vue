<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form size="small" :inline="true" :model="filter" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="filter.name"
              placeholder="角色名"
              clearable
              @keyup.enter.native="getRoles"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRoles">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <confirm-button
              v-if="sels.length > 0"
              :type="'delete'"
              :placement="'bottom-end'"
              :loading="deleteLoading"
              :validate="batchDeleteValidate"
              style="margin-left: 0px;"
              @click="onBatchDelete"
            >
              <p slot="content">确定要批量删除吗？</p>批量删除
            </confirm-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="roles"
      highlight-current-row
      style="width: 100%;height:100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="80" />
      <el-table-column prop="name" label="角色名" width />
      <el-table-column prop="description" label="说明" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <!--<el-table-column prop="CreatedUserName" label="创建者" width="" >-->
      <!--</el-table-column>-->
      <el-table-column prop="enabled" label="状态" width="200">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ scope.row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ $index, row }">
          <el-button size="small" @click="onEdit($index, row)">编辑</el-button>
          <confirm-button
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--工具条 prev, pager, next, jumper -->
    <el-row>
      <el-col :span="24" class="pagination">
        <el-pagination
          layout="total, slot, sizes, prev, jumper, next"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          :page-count="pageCount"
          background
          style="text-align:right;"
        >
          <span class="el-pagination__count">，{{ pageCount }} 页</span>
        </el-pagination>
      </el-col>
    </el-row>

    <!--编辑界面-->
    <el-drawer
      title="编辑角色"
      :wrapper-closable="true"
      :visible.sync="editFormVisible"
      direction="ltr"
      size="'auto'"
      @close="closeEditForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item label="角色名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="editForm.description" auto-complete="off" />
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-select v-model="editForm.enabled" placeholder="请选择角色状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <confirm-button :validate="editFormValidate" :loading="editLoading" @click="onEditSubmit" />
      </div>
    </el-drawer>

    <!--新增界面-->
    <el-drawer
      title="新增角色"
      :wrapper-closable="true"
      :visible.sync="addFormVisible"
      direction="btt"
      size="'auto'"
      class="el-drawer__wrapper"
      @close="closeAddForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="角色名" prop="name">
                <el-input v-model="addForm.name" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <el-form-item label="状态" prop="enabled">
                <el-select v-model="addForm.enabled" placeholder="请选择角色状态" style="width:100%;">
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
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="说明" prop="description">
                <el-input v-model="addForm.description" auto-complete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="说明" prop="description">
                                <el-input type="textarea" v-model="addForm.description" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
          </el-row>-->
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <confirm-button :validate="addFormValidate" :loading="addLoading" @click="onAddSubmit" />
      </div>
    </el-drawer>
  </section>
</template>

<script>
import { formatTime } from '@/utils'
import {
  getRoleListPage,
  removeRole,
  editRole,
  addRole,
  batchRemoveRole,
  getRole
} from '@/api/admin/role'
import ConfirmButton from '@/components/ConfirmButton'
export default {
  name: 'Roles',
  components: {
    ConfirmButton
  },
  data() {
    return {
      filter: {
        name: ''
      },
      roles: [],
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,
      sels: [], // 列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        description: '',
        enabled: ''
      },
      editFormRef: null,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        description: '',
        enabled: true
      },
      addFormRef: null,
      deleteLoading: false
    }
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1
    }
  },
  watch: {
    currentPage() {
      this.getRoles()
    },
    pageSize() {
      this.getRoles()
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'yyyy-MM-dd hh:mm')
    },
    // 获取角色列表
    async getRoles() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getRoleListPage(para)
      this.listLoading = false

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.roles = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      const loading = this.$loading()
      const res = await getRole({ id: row.id })
      loading.close()
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

      const res = await editRole(para)
      this.editLoading = false

      if (res.success) {
        this.$message({
          message: this.$t('admin.updateOk'),
          type: 'success'
        })
        this.$refs['editForm'].resetFields()
        this.editFormVisible = false
        this.getRoles()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
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

      const res = await addRole(para)
      this.addLoading = false

      if (res.success) {
        this.$message({
          message: this.$t('admin.addOk'),
          type: 'success'
        })
        this.$refs['addForm'].resetFields()
        this.addFormVisible = false
        this.getRoles()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
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
      const res = await removeRole(para)
      row._loading = false

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getRoles()
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
      const res = await batchRemoveRole(para.ids)
      this.deleteLoading = false

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getRoles()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>

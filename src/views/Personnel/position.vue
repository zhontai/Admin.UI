<template>
  <my-container v-loading="pageLoading">
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="岗位名称"
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
        <el-form-item v-if="checkPermission(['api:personnel:position:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:personnel:position:batchsoftdelete'])">
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
      :data="positions"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="岗位名称" width />
      <el-table-column prop="code" label="编码" width />
      <el-table-column prop="description" label="说明" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="enabled" label="状态" width="200">
        <template #default="{row}">
          <el-tag
            :type="row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:personnel:position:update','api:personnel:position:softdelete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:personnel:position:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:personnel:position:softdelete'])"
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
        @get-page="getPositions"
      />
    </template>

    <!--新增窗口-->
    <my-window
      v-if="checkPermission(['api:personnel:position:add'])"
      title="新增岗位"
      embed
      drawer
      :visible.sync="addFormVisible"
      @close="closeAddForm"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="addForm.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="编码" prop="code">
              <el-input v-model="addForm.code" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="addForm.enabled" placeholder="请选择岗位状态" style="width:100%;">
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
            <el-form-item label="说明" prop="description">
              <el-input v-model="addForm.description" type="textarea" :rows="2" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="addFormValidate" :loading="addLoading" @click="onAddSubmit" />
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:personnel:position:update'])"
      title="编辑岗位"
      embed
      drawer
      :visible.sync="editFormVisible"
      @close="closeEditForm"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="editForm.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="编码" prop="code">
              <el-input v-model="editForm.code" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="editForm.enabled" placeholder="请选择岗位状态" style="width:100%;">
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
            <el-form-item label="说明" prop="description">
              <el-input v-model="editForm.description" type="textarea" :rows="2" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormValidate" :loading="editLoading" @click="onEditSubmit" />
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getPositionListPage, removePosition, editPosition, addPosition, batchRemovePosition, getPosition } from '@/api/personnel/position'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MyWindow from '@/components/my-window'

export default {
  name: 'Position',
  components: { MyContainer, MyConfirmButton, MyWindow },
  data() {
    return {
      filter: {
        name: ''
      },
      positions: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
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
        name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        description: '',
        enabled: true
      },
      addFormRef: null,
      deleteLoading: false,

      selectPermissionVisible: false,
      currentRow: null
    }
  },
  computed: {
    positionId() {
      return this.currentRow?.id
    },
    title() {
      return `设置${this.currentRow?.name}（${this.currentRow?.code}）权限`
    }
  },
  mounted() {
    this.getPositions()
  },
  beforeUpdate() {
    // console.log('update')
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getPositions()
    },
    // 获取岗位列表
    async getPositions() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getPositionListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.positions = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await getPosition({ id: row.id })
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

      const res = await editPosition(para)
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
      this.getPositions()
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

      const res = await addPosition(para)
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
      this.getPositions()
    },
    // 删除验证
    deleteValidate(row) {
      const isValid = true

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removePosition(para)
      row._loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getPositions()
    },
    // 批量删除验证
    batchDeleteValidate() {
      const isValid = true

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await batchRemovePosition(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getPositions()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>

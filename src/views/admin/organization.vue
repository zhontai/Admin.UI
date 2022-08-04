<template>
  <my-container>
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="部门名称"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:organization:add'])">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="organizationTree"
      row-key="id"
      :default-expand-all="true"
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      height="'100%'"
      style="width: 100%;height:100%;"
      @select-all="onSelectAll"
      @select="onSelect"
    >
      <template #empty>
        <el-empty image-size="100" />
      </template>
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column prop="name" label="部门名称" width="180" />
      <el-table-column prop="code" label="部门编码" width="120" />
      <el-table-column prop="value" label="部门值" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width="140" />
      <el-table-column prop="enabled" label="状态" width="100">
        <template #default="{row}">
          <el-tag
            :type="row.enabled ? 'success' : 'danger'"
            disable-transitions
          >{{ row.enabled ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:admin:organization:update','api:admin:organization:softdelete'])" label="操作" fixed="right" width="180">
        <template v-if="checkPermission(['api:admin:organization:add'])" #default="{ $index, row }">
          <el-button icon="el-icon-edit" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:organization:add'])"
            :type="'delete'"
            :loading="row._loading"
            :icon="'el-icon-delete'"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--新增窗口-->
    <my-window
      v-if="checkPermission(['api:admin:organization:add'])"
      title="新增"
      :visible.sync="addFormVisible"
      @close="closeAddForm"
    >
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item prop="parentIds" label="上级部门">
          <el-cascader
            :key="addFormKey"
            v-model="addForm.parentIds"
            :options="organizations"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            filterable
            clearable
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addForm.code" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门值" prop="value">
          <el-input v-model="addForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="addForm.enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="addForm.description" type="textarea" rows="4" auto-complete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <my-confirm-button type="submit" :loading="addLoading" :validate="addFormValidate" @click="onAddSubmit" />
        </div>
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:organization:update'])"
      title="编辑"
      :visible.sync="editFormVisible"
      @close="closeEditForm"
    >
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="editFormRules">
        <el-form-item prop="parentIds" label="上级部门">
          <el-cascader
            :key="editFormKey"
            v-model="editForm.parentIds"
            placeholder="请选择，支持搜索功能"
            :options="organizations"
            :props="{ checkStrictly: true, label: 'name', value: 'id' }"
            filterable
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="editForm.code" auto-complete="off" />
        </el-form-item>
        <el-form-item label="部门值" prop="value">
          <el-input v-model="editForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="editForm.enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="editForm.description" type="textarea" rows="4" auto-complete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <my-confirm-button type="submit" :loading="editLoading" :validate="editFormValidate" @click="onEditSubmit" />
        </div>
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime, treeToList, listToTree, getTreeParents } from '@/utils'
import orgApi from '@/api/admin/organization'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MyWindow from '@/components/my-window'

export default {
  name: 'Organization',
  _sync: {
    disabled: false,
    title: '部门管理',
    desc: '',
    cache: true
  },
  components: { MyContainer, MyConfirmButton, MyWindow },
  data() {
    return {
      filter: {
        name: ''
      },
      organizationTree: [],
      organizations: [],
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      sels: [],
      listLoading: false,

      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        parentIds: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        parentIds: [],
        name: '',
        code: '',
        value: '',
        description: '',
        enabled: true
      },
      editFormKey: 1,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        parentIds: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        parentIds: [],
        name: '',
        code: '',
        value: '',
        description: '',
        enabled: true
      },
      addFormKey: 1
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.getList()
    },
    // 获取列表
    async getList() {
      const para = {
        key: this.filter.name
      }
      this.listLoading = true
      const res = await orgApi.getList(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)

      this.organizations = listToTree(_.cloneDeep(list), {
        id: 0,
        parentId: 0,
        name: '顶级'
      })

      list.forEach(d => {
        d._loading = false
      })
      const tree = listToTree(list)
      this.organizationTree = tree
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await orgApi.softDelete(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getList()
    },
    // 显示编辑界面
    async onEdit(index, row) {
      const loading = this.$loading()
      const res = await orgApi.get({ id: row.id })
      loading.close()
      if (res && res.success) {
        const parents = getTreeParents(this.organizationTree, row.id)
        const parentIds = parents.map(p => p.id)
        parentIds.unshift(0)

        const data = res.data
        data.parentIds = parentIds
        this.editForm = data
        this.editFormVisible = true
        ++this.editFormKey
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
      ++this.editFormKey
    },

    // 显示新增界面
    handleAdd() {
      this.addFormVisible = true
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
      ++this.addFormKey
    },
    editFormValidate() {
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
      para.parentId = para.parentIds.pop()

      if (para.id === para.parentId) {
        this.$message({
          message: '上级部门不能是自己！',
          type: 'error'
        })
        this.editLoading = false
        return
      }

      const res = await orgApi.update(para)
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
      this.getList()
    },
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
      para.parentId = para.parentIds.pop()

      const res = await orgApi.add(para)
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
      this.getList()
    },
    onSelectAll: function(selection) {
      const selections = treeToList(selection)
      const rows = treeToList(this.organizationTree)
      const checked = selections.length === rows.length
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked)
      })

      this.sels = this.$refs.multipleTable.selection
    },
    onSelect: function(selection, row) {
      const checked = selection.some(s => s.id === row.id)
      if (row.children && row.children.length > 0) {
        const rows = treeToList(row.children)
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, checked)
        })
      }

      this.sels = this.$refs.multipleTable.selection
    }
  }
}
</script>

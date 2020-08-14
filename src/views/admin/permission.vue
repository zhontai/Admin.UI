<template>
  <section style="padding:10px;">
    <!--查询-->
    <el-form class="ad-form-query" :inline="true" :model="filters" @submit.native.prevent>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="filters.createTime"
          type="daterange"
          align="left"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:240px"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filters.label"
          placeholder="权限名称"
          @keyup.enter.native="getPermissions"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getPermissions">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown
          v-if="checkPermission([
            'api:admin:permission:addgroup',
            'api:admin:permission:addmenu',
            'api:admin:permission:addapi',
            'api:admin:permission:adddot'
          ])"
        >
          <el-button type="primary">
            新增<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;">
              <el-dropdown-item v-if="checkPermission(['api:admin:permission:addgroup'])" icon="el-icon-folder" @click.native="onOpenAddGroup">新增分组</el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['api:admin:permission:addmenu'])" icon="el-icon-tickets" @click.native="onOpenAddMenu">新增菜单</el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['api:admin:permission:addapi'])" icon="el-icon-s-operation" @click.native="onOpenAddApi">新增接口</el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['api:admin:permission:adddot'])" icon="el-icon-s-operation" @click.native="onOpenAddDot">新增权限点</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      highlight-current-row
      :data="permissionTree"
      row-key="id"
      :default-expand-all="false"
      :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%;"
      @select-all="onSelectAll"
      @select="onSelect"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column type="index" width="50" label="#" />
      <el-table-column label="权限" width="220">
        <template v-slot="{row}">
          <i :class="row.icon" />
          {{ row.label }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column label="类型" width="100">
        <template v-slot="{ row }">
          {{ row.type === 1 ? '分组' : row.type === 2 ? '菜单' : row.type === 3 ? '接口' : row.type === 4 ? '权限点' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="地址" width>
        <template v-slot="{ row }">
          {{ row.type === 2 ? row.path : row.type === 3 ? row.apiPath : '' }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createTime" label="创建时间" :formatter="formatCreateTime" width="100" >
      </el-table-column>-->
      <el-table-column prop="enabled" label="状态" width="100">
        <template v-slot="{row}">
          <el-tag :type="row.enabled ? 'success' : 'danger'" disable-transitions>
            {{ row.enabled ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission([
          'api:admin:permission:updategroup',
          'api:admin:permission:updatemenu',
          'api:admin:permission:updateapi',
          'api:admin:permission:updatedot',
          'api:admin:permission:softdelete'])"
        label="操作"
        fixed="right"
        width="180"
      >
        <template v-slot="{ $index, row }">
          <!-- <el-link @click="onEdit(scope.$index, scope.row)" icon="el-icon-edit" style="color:#409eff">编辑</el-link>
          <el-link @click="onEdit(scope.$index, scope.row)" icon="el-icon-delete" style="margin-left:10px;color:#f56c6c;">删除</el-link>-->
          <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle style="margin-left:10px;"></el-button>-->
          <el-button
            v-if="(row.type === 1 && checkPermission(['api:admin:permission:updategroup']))
              || (row.type === 2 && checkPermission(['api:admin:permission:updatemenu']))
              || (row.type === 3 && checkPermission(['api:admin:permission:updateapi']))
              || (row.type === 4 && checkPermission(['api:admin:permission:updatedot']))"
            icon="el-icon-edit"
            @click="onEdit($index, row)"
          >编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:admin:permission:softdelete'])"
            type="delete"
            :loading="row._loading"
            :icon="'el-icon-delete'"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分组-->
    <el-dialog
      v-if="checkPermission(['api:admin:permission:addgroup','api:admin:permission:updategroup'])"
      :title="(permissionGroup.form.id > 0 ? '编辑':'新增')+'分组'"
      :visible.sync="permissionGroup.visible"
      :close-on-click-modal="false"
      @close="onCloseGroup"
    >
      <el-form ref="permissionGroupForm" :model="permissionGroup.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="permissionGroup.key"
            v-model="permissionGroup.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="groupTree"
            :props="{ checkStrictly: true, value: 'id' }"
            filterable
          />
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="permissionGroup.form.label" auto-complete="off" />
        </el-form-item>
        <!-- <el-form-item label="描述" prop="description">
          <el-input v-model="permissionGroup.form.description" auto-complete="off" />
        </el-form-item> -->
        <el-form-item label="图标类名" prop="icon">
          <el-input v-model="permissionGroup.form.icon" auto-complete="off" />
        </el-form-item>
        <el-form-item prop="opened" label="默认展开" width>
          <el-switch v-model="permissionGroup.form.opened" />
        </el-form-item>
        <el-form-item label="隐藏" prop="hidden">
          <el-switch v-model="permissionGroup.form.hidden" />
        </el-form-item>
        <!-- <el-form-item label="启用" prop="enabled">
          <el-switch v-model="permissionGroup.form.enabled" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="permissionGroup.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateGroup" :loading="permissionGroup.loading" @click="onSubmitGroup" />
        </div>
      </template>
    </el-dialog>

    <!--菜单-->
    <el-dialog
      v-if="checkPermission(['api:admin:permission:addmenu','api:admin:permission:updatemenu'])"
      :title="(permissionMenu.form.id > 0 ? '编辑':'新增')+'菜单'"
      :visible.sync="permissionMenu.visible"
      :close-on-click-modal="false"
      @close="onCloseMenu"
    >
      <el-form ref="menuForm" :model="permissionMenu.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="permissionMenu.key"
            v-model="permissionMenu.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="groupTree"
            :props="{ checkStrictly: true, value: 'id'}"
            filterable
          />
        </el-form-item>
        <el-form-item prop="viewId" label="视图组件" width>
          <el-cascader
            :key="permissionMenu.key"
            v-model="permissionMenu.form.viewId"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="viewTree"
            :props="{ value: 'id',label:'path', emitPath:false }"
            filterable
            clearable
            :show-all-levels="false"
            @change="onChangeView"
          >
            <template v-slot="{ data }">
              <span>{{ data.path }}</span>
              <span style="float:right;margin-left:15px;">{{ data.label }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="访问地址" prop="path">
          <el-input v-model="permissionMenu.form.path" auto-complete="off" />
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="permissionMenu.form.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="permissionMenu.form.description" auto-complete="off" />
        </el-form-item>
        <el-form-item label="图标类名" prop="icon">
          <el-input v-model="permissionMenu.form.icon" auto-complete="off" />
        </el-form-item>
        <el-form-item prop="closable" label="标签可关闭" width>
          <el-switch v-model="permissionMenu.form.closable" />
        </el-form-item>
        <el-form-item label="隐藏" prop="hidden">
          <el-switch v-model="permissionMenu.form.hidden" />
        </el-form-item>
        <el-form-item label="打开新窗口" prop="hidden">
          <el-switch v-model="permissionMenu.form.newWindow" />
        </el-form-item>
        <el-form-item label="链接外显" prop="hidden">
          <el-switch v-model="permissionMenu.form.external" />
        </el-form-item>
        <!-- <el-form-item label="启用" prop="enabled">
          <el-switch v-model="permissionMenu.form.enabled" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="permissionMenu.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateMenu" :loading="permissionMenu.loading" @click="onSubmitMenu" />
        </div>
      </template>
    </el-dialog>

    <!--接口-->
    <el-dialog
      v-if="checkPermission(['api:admin:permission:addapi','api:admin:permission:updateapi'])"
      :title="(permissionApi.form.id > 0 ? '编辑':'新增')+'接口'"
      :visible.sync="permissionApi.visible"
      :close-on-click-modal="false"
      @close="onCloseApi"
    >
      <el-form ref="apiForm" :model="permissionApi.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="permissionApi.key"
            v-model="permissionApi.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="menuTree"
            :props="{ value: 'id' }"
            filterable
          />
        </el-form-item>
        <el-form-item prop="apiId" label="API接口" width>
          <el-cascader
            :key="permissionApi.key"
            v-model="permissionApi.form.apiId"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="apiTree"
            :props="{ value: 'id', label:'path', emitPath:false }"
            filterable
            :show-all-levels="false"
            @change="onChangeApi"
          >
            <template v-slot="{ data }">
              <span>{{ data.path }}</span>
              <span style="float:right;margin-left:15px;">{{ data.label }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="permissionApi.form.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="permissionApi.form.code" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="permissionApi.form.description" auto-complete="off" />
        </el-form-item>
        <el-form-item label="隐藏" prop="hidden">
          <el-switch v-model="permissionApi.form.hidden" />
        </el-form-item>
        <!-- <el-form-item label="启用" prop="enabled">
          <el-switch v-model="permissionApi.form.enabled" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="permissionApi.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateApi" :loading="permissionApi.loading" @click="onSubmitApi" />
        </div>
      </template>
    </el-dialog>

    <!--权限点-->
    <el-dialog
      v-if="checkPermission(['api:admin:permission:adddot','api:admin:permission:updatedot'])"
      :title="(permissionDot.form.id > 0 ? '编辑':'新增')+'权限点'"
      :visible.sync="permissionDot.visible"
      :close-on-click-modal="false"
      @close="onCloseDot"
    >
      <el-form ref="dotForm" :model="permissionDot.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="permissionDot.key"
            v-model="permissionDot.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="menuTree"
            :props="{ value: 'id' }"
            filterable
          />
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="permissionDot.form.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="permissionDot.form.code" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="permissionDot.form.description" auto-complete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="permissionDot.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateDot" :loading="permissionDot.loading" @click="onSubmitDot" />
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { formatTime, treeToList, listToTree, getTreeParents } from '@/utils'
import { getApiList } from '@/api/admin/api'
import { getViewList } from '@/api/admin/view'
import {
  getPermissionList,
  removePermission,
  addGroup,
  addMenu,
  addApi,
  addDot,
  updateGroup,
  updateMenu,
  updateApi,
  updateDot,
  getGroup,
  getMenu,
  getApi,
  getDot
} from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Permission',
  components: {
    MyConfirmButton
  },
  data() {
    return {
      filters: {
        label: '',
        createTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              end.setDate(end.getDate() - 1)
              const start = new Date()
              start.setDate(start.getDate() - 1)
              // start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              var weekday = start.getDay() || 7
              start.setDate(start.getDate() - weekday + 1)
              picker.$emit('pick', [start, end])
              // date.setDate(1); 当月今天
            }
          }
        ]
      },
      permissionTree: [],
      expandRowKeys: [],
      listLoading: false,
      sels: [], // 列表选中列

      formRules: {
        parentId: [{ required: true, message: '请选择父级', trigger: 'change' }],
        parentIds: [{ required: true, message: '请选择父级', trigger: 'change' }],
        apiId: [{ required: true, message: '请选择API接口', trigger: 'change' }],
        apiIds: [{ required: true, message: '请选择API接口', trigger: 'change' }],
        // viewId: [{ required: true, message: '请选择视图组件', trigger: 'change' }],
        // viewIds: [{ required: true, message: '请选择视图组件', trigger: 'change' }],
        label: [{ required: true, message: '请输入名称', trigger: ['blur'] }],
        code: [{ required: true, message: '请输入编码', trigger: ['blur'] }],
        path: [{ required: true, message: '请输入菜单地址', trigger: ['blur'] }]
      },

      groupTree: [],
      menuTree: [],
      apiTree: [],
      viewTree: [],

      permissionGroup: {
        addForm: {
          type: 1,
          parentId: 0,
          parentIds: [0],
          label: '',
          description: '',
          icon: '',
          hidden: false,
          opened: false,
          enabled: true
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      },
      permissionMenu: {
        addForm: {
          type: 2,
          parentId: 0,
          parentIds: [0],
          viewId: null,
          viewIds: [],
          label: '',
          path: '',
          description: '',
          icon: '',
          hidden: false,
          closable: true,
          enabled: true,
          newWindow: false,
          external: false
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      },
      permissionApi: {
        addForm: {
          id: 0,
          type: 3,
          parentId: null,
          parentIds: [],
          apiId: null,
          apiIds: [],
          label: '',
          code: '',
          description: '',
          hidden: false,
          enabled: true
          // icon: ''
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      },
      permissionDot: {
        addForm: {
          id: 0,
          type: 4,
          parentId: null,
          parentIds: [],
          label: '',
          code: '',
          description: ''
          // icon: ''
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      },
      addFormKey: 1
    }
  },
  async mounted() {
    await this.getPermissions()
  },
  methods: {
    formatCreateTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    async getApiList() {
      const res = await getApiList()
      if (res && res.success) {
        this.apiTree = listToTree(_.cloneDeep(res.data))
      }
    },
    async getViewList() {
      const res = await getViewList()
      if (res && res.success) {
        this.viewTree = listToTree(_.cloneDeep(res.data))
      }
    },
    // 获取权限列表
    async getPermissions() {
      const para = {
        key: this.filters.label,
        start: this.filters.createTime ? this.filters.createTime[0] : '',
        end: this.filters.createTime ? this.filters.createTime[1] : ''
      }
      this.listLoading = true
      const res = await getPermissionList(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = res.data

      // 分组树
      const groups = list.filter(l => l.type === 1)
      this.groupTree = listToTree(_.cloneDeep(groups), {
        id: 0,
        parentId: 0,
        label: '根节点'
      })
      ++this.permissionGroup.key

      // 菜单树
      const menus = list.filter(l => l.type === 1 || l.type === 2)
      this.menuTree = listToTree(_.cloneDeep(menus), {
        id: 0,
        parentId: 0,
        label: '根节点'
      })
      ++this.permissionMenu.key
      ++this.permissionApi.key

      const keys = list.filter(l => l.opened).map(l => l.id + '')
      this.expandRowKeys = keys

      list.forEach(l => {
        l._loading = false
      })
      const tree = listToTree(list)
      this.permissionTree = tree
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removePermission(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getPermissions()
    },
    // 显示编辑界面
    async onEdit(index, row) {
      const parents = getTreeParents(this.permissionTree, row.id)
      const parentIds = parents.map(p => p.id)
      parentIds.unshift(0)

      const type = row.type
      const loading = this.$loading()
      if (type === 1) {
        const res = await getGroup({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.permissionGroup.form = data
          this.permissionGroup.visible = true
          ++this.permissionGroup.key
        }
      } else if (type === 2) {
        if (this.viewTree.length === 0) {
          await this.getViewList()
        }
        const res = await getMenu({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.permissionMenu.form = data
          this.permissionMenu.visible = true
          ++this.permissionMenu.key
        }
      } else if (type === 3) {
        if (this.apiTree.length === 0) {
          await this.getApiList()
        }
        const res = await getApi({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.permissionApi.form = data
          this.permissionApi.visible = true
          ++this.permissionApi.key
        }
      } else if (type === 4) {
        const res = await getDot({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.permissionDot.form = data
          this.permissionDot.visible = true
          ++this.permissionDot.key
        }
      }
    },

    // 权限分组方法
    onOpenAddGroup() {
      this.permissionGroup.form = _.cloneDeep(this.permissionGroup.addForm)
      this.permissionGroup.visible = true
    },
    onCloseGroup() {
      this.$refs.permissionGroupForm.resetFields()
      ++this.permissionGroup.key
    },
    validateGroup() {
      let isValid = false
      this.$refs.permissionGroupForm.validate(valid => {
        isValid = valid
      })

      return isValid
    },
    async onSubmitGroup() {
      this.permissionGroup.loading = true
      const para = _.cloneDeep(this.permissionGroup.form)
      para.parentId = para.parentIds.pop()

      let res
      if (para.id > 0) {
        res = await updateGroup(para)
      } else {
        res = await addGroup(para)
      }
      this.permissionGroup.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })
      this.permissionGroup.visible = false
      this.getPermissions()
    },

    // 菜单方法
    async onOpenAddMenu() {
      if (this.viewTree.length === 0) {
        const loading = this.$loading()
        await this.getViewList()
        loading.close()
      }

      this.permissionMenu.form = _.cloneDeep(this.permissionMenu.addForm)
      this.permissionMenu.visible = true
      ++this.permissionMenu.key
    },
    onCloseMenu() {
      this.$refs.menuForm.resetFields()
      ++this.permissionMenu.key
    },
    validateMenu() {
      let isValid = false
      this.$refs.menuForm.validate(valid => {
        isValid = valid
      })

      return isValid
    },
    async onSubmitMenu() {
      this.permissionMenu.loading = true
      const para = _.cloneDeep(this.permissionMenu.form)
      para.parentId = para.parentIds.pop()

      let res
      if (para.id > 0) {
        res = await updateMenu(para)
      } else {
        res = await addMenu(para)
      }
      this.permissionMenu.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })
      this.permissionMenu.visible = false
      this.getPermissions()
    },

    // 接口方法
    async onOpenAddApi() {
      if (this.apiTree.length === 0) {
        const loading = this.$loading()
        await this.getApiList()
        loading.close()
      }

      this.permissionApi.form = _.cloneDeep(this.permissionApi.addForm)
      this.permissionApi.visible = true
      ++this.permissionApi.key
    },
    onCloseApi() {
      this.$refs.apiForm.resetFields()
      ++this.permissionApi.key
    },
    validateApi() {
      let isValid = false
      this.$refs.apiForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    async onSubmitApi() {
      this.permissionApi.loading = true
      const para = _.cloneDeep(this.permissionApi.form)
      para.parentId = para.parentIds[para.parentIds.length - 1]

      let res
      if (para.id > 0) {
        res = await updateApi(para)
      } else {
        res = await addApi(para)
      }
      this.permissionApi.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })

      this.permissionApi.visible = false
      this.getPermissions()
    },

    // 权限点方法
    async onOpenAddDot() {
      this.permissionDot.form = _.cloneDeep(this.permissionDot.addForm)
      this.permissionDot.visible = true
      ++this.permissionDot.key
    },
    onCloseDot() {
      this.$refs.dotForm.resetFields()
      ++this.permissionDot.key
    },
    validateDot() {
      let isValid = false
      this.$refs.dotForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    async onSubmitDot() {
      this.permissionDot.loading = true
      const para = _.cloneDeep(this.permissionDot.form)
      para.parentId = para.parentIds[para.parentIds.length - 1]

      let res
      if (para.id > 0) {
        res = await updateDot(para)
      } else {
        res = await addDot(para)
      }
      this.permissionDot.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })

      this.permissionDot.visible = false
      this.getPermissions()
    },

    onChangeApi(value) {
      const apis = treeToList(this.apiTree)
      const api = apis.find(a => a.id === value)
      if (api && api.label) {
        this.permissionApi.form.label = api.label
        this.permissionApi.form.code = _.trimStart(_.replace(api.path, /\//g, ':'), ':')
      }
    },
    onChangeView(value) {
      const views = treeToList(this.viewTree)
      const view = views.find(a => a.id === value)
      if (view && view.label) {
        this.permissionMenu.form.label = view.label
      }
      if (view && view.path) {
        this.permissionMenu.form.path = view.path
      }
    },

    onSelectAll(selection) {
      const selections = treeToList(selection)
      const rows = treeToList(this.permissionTree)
      const checked = selections.length === rows.length
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked)
      })

      this.sels = this.$refs.multipleTable.selection
    },
    onSelect(selection, row) {
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

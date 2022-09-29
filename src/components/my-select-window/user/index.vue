<template>
  <my-window
    :title="title"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    embed
    drawer
    size="100%"
    drawer-body-style="padding:0px;height: calc(100% - 61px);"
    :before-close="onCancel"
    @opened="onSearch"
  >
    <my-container
      left-aside-width="220px"
      :left-aside-resize-options="resizeOptions"
      :show-left-aside="true"
      :resizable="true"
      :show-header="false"
      :show-footer="false"
      :main-style="'padding:0px;'"
    >
      <template #left-aside>
        <my-select-user-org @change="onOrgChange" />
      </template>
      <my-container v-loading="pageLoading">
        <!--顶部操作-->
        <template #header>
          <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
            <el-form-item>
              <my-search :fields="fields" @click="onSearch" />
            </el-form-item>
          </el-form>
        </template>

        <!--列表-->
        <el-table
          v-loading="listLoading"
          :data="users"
          :highlight-current-row="!multiple"
          height="'100%'"
          style="width: 100%;height:100%;"
          :row-key="(row)=>row.id"
          @current-change="onCurrentChange"
          @selection-change="onSelsChange"
        >
          <template #empty>
            <el-empty :image-size="100" />
          </template>
          <el-table-column v-if="multiple" type="selection" reserve-selection width="50" />
          <el-table-column prop="name" label="姓名" width />
          <el-table-column prop="mobile" label="手机号" width />
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
      </my-container>
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import userApi from '@/api/admin/user'
import MySearch from '@/components/my-search'
import MySelectUserOrg from './org'
import MyWindow from '@/components/my-window'

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
  components: { MySelectUserOrg, MySearch, MyWindow },
  props: {
    title: {
      type: String,
      default: '选择员工'
    },
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 高级查询字段
      fields: [
        { value: 'name', label: '姓名', type: 'string' },
        { value: 'mobile', label: '手机号', type: 'string' },
        { value: 'email', label: '邮箱', type: 'string' },
        { value: 'userName', label: '用户名', type: 'string' }
      ],
      dynamicFilter: null,
      sels: [],
      currentRow: null,
      users: [],
      total: 0,
      listLoading: false,
      pageLoading: false,
      orgId: null
    }
  },
  computed: {
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
  methods: {
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      this.$emit('click', this.multiple ? this.sels : this.currentRow)
    },
    onOrgChange(row) {
      if (row?.id > 0) {
        this.orgId = row.id
        this.getUsers()
      }
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    onCurrentChange(row) {
      this.currentRow = row
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getUsers()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
</style>

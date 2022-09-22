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
    @opened="onOpened"
  >
    <my-container v-loading="pageLoading" style="height: 100%;">
      <template #header>
        <el-input v-model="filterText" placeholder="筛选角色" clearable />
      </template>
      <el-collapse v-model="activeGroupList">
        <el-collapse-item v-for="group in tree" v-show="group.children?.length > 0" :key="group.id" :name="group.id">
          <template slot="title">
            {{ group.name }}
          </template>
          <el-table
            ref="table"
            :data="group.children"
            :show-header="false"
            current-row-key="id"
            @selection-change="onSelectionChange"
          >
            <template #empty>
              <el-empty :image-size="50" />
            </template>
            <el-table-column type="selection" width="50" />
            <el-table-column prop="name" label="角色名" width />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import { listToTree } from '@/utils/tree'
import { getList } from '@/api/admin/role'
import MyWindow from '@/components/my-window'

export default {
  name: 'MySelectRole',
  components: { MyWindow },
  props: {
    title: {
      type: String,
      default: '选择角色'
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
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'name'
        }
      }
    }
  },
  data() {
    return {
      filterText: '',
      dataList: [],
      tree: [],
      activeGroupList: [],
      pageLoading: false,
      node: false,
      checkedList: []
    }
  },
  watch: {
    filterText(val) {
      this.filterRoles(val)
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
      this.$emit('click', this.form, this.checkedList)
    },
    async onOpened() {
      await this.initData()
      this.$nextTick(() => {
        this.checkedList?.forEach(a => {
          this.$refs.table?.forEach(b => {
            b.toggleRowSelection(a, true)
          })
        })
      })
      this.$emit('opened')
    },
    filterRoles(val) {
      if (val) {
        const data = this.dataList.filter(a => a.parentId !== 0 && a.name.indexOf(val) > -1)
        this.tree = listToTree(_.cloneDeep(this.groupList.concat(data)))
      } else {
        this.tree = listToTree(_.cloneDeep(this.dataList))
      }
    },
    // 初始化数据
    async initData() {
      this.pageLoading = true
      const res = await getList()
      this.pageLoading = false

      if (!res?.success) {
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.dataList = data
      this.groupList = data.filter(a => a.parentId === 0)
      this.activeGroupList = this.groupList.map(a => a.id)
      this.tree = listToTree(_.cloneDeep(data))
    },
    setCheckedList(checkedList) {
      this.checkedList = checkedList
    },
    onSelectionChange: function(sels) {
      if (sels?.length > 0) {
        sels.forEach(a => {
          if (!(this.checkedList.some(b => b.id === a.id))) {
            this.checkedList.push(a)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .el-collapse{
    border-top-width: 0px;
    border-bottom-width: 0px;
    .el-collapse-item__wrap{
      border-bottom-width: 0px;
    }
  }
}
</style>

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
        <el-input
          v-model="filterText"
          placeholder="筛选部门"
          clearable
        />
      </template>
      <el-tree
        ref="tree"
        :props="{
          label: 'name'
        }"
        :data="tree"
        node-key="id"
        :highlight-current="!multiple"
        default-expand-all
        check-strictly
        :show-checkbox="multiple"
        check-on-click-node
        :expand-on-click-node="false"
        :indent="16"
        :filter-node-method="filterNode"
      />
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import { listToTree } from '@/utils/tree'
import { getList } from '@/api/admin/organization'
import MyWindow from '@/components/my-window'

export default {
  name: 'MySelectOrg',
  components: { MyWindow },
  props: {
    title: {
      type: String,
      default: '选择部门'
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
    }
  },
  data() {
    return {
      filterText: '',
      tree: [],
      listLoading: false,
      pageLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
      var data = this.multiple ? this.$refs.tree.getCheckedNodes() : this.$refs.tree.getCurrentNode()
      this.$emit('click', this.form, data)
    },
    async onOpened() {
      await this.initData()
      this.$emit('opened')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 初始化数据
    async initData() {
      this.listLoading = true
      const res = await getList()
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)
      list.forEach(d => {
        d._loading = false
      })
      this.tree = listToTree(list)
    },
    setCheckedNodes(nodes) {
      this.$refs.tree.setCheckedNodes(nodes)
    },
    setCheckedKeys(keys) {
      this.$refs.tree.setCheckedKeys(keys)
    }
  }
}
</script>

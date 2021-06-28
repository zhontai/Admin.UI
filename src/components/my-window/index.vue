<template>
  <el-dialog
    v-draggable="{ host:'.el-dialog', handle:'.el-dialog__header,.el-dialog__footer', relativePosition:true}"
    :title="title"
    :visible.sync="visible"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :top="'8vh'"
    :custom-class="'my-window'"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="onCancel"
    :style="inline?'position:absolute;':''"
    @close="onClose"
  >
    <slot />
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button @click.native="onCancel">取消</el-button>
          <el-button type="primary" @click="onSure">确定</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
import draggable from '@/directive/draggable'

/**
 * 窗口
 * 使用说明
    import MyWindow from '@/components/my-window'
    components: { MyWindow }

    <!--窗口-->
*/
export default {
  name: 'MyWindow',
  directives: {
    draggable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    // 关闭
    onClose() {
      this.$emit('close')
    },
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      this.$emit('sure')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .my-search-window{
  width:60%;
  .el-dialog__body{
    padding:10px;
  }
}
</style>

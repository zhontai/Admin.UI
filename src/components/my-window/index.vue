<template>
  <!-- v-resizable="{ host:'.el-dialog' }" -->
  <el-dialog
    v-draggable="dragOptions"
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
import resizable from '@/directive/resizable'
/**
 * 窗口 my-window

  <my-window
    v-if="checkPermission([''])"
    title=""
    :visible.sync="visibleAdd"
    :close-on-click-modal="false"
    @close="onCloseAdd"
  >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.native="visibleAdd = false">取消</el-button>
        <my-confirm-button type="submit" :validate="validateAdd" :loading="loadingAdd" @click="onSubmitAdd" />
      </div>
    </template>
  </my-window>

  import MyWindow from '@/components/my-window'

  export default {
    components: { MyWindow }
  }
*/
export default {
  name: 'MyWindow',
  directives: {
    draggable,
    resizable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    draggable: {
      type: Boolean,
      default: true
    },
    footerDraggable: {
      type: Boolean,
      default: true
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
      default: false
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
    dragOptions() {
      const handles = []
      if (this.draggable) {
        handles.push('.el-dialog__header')
      }
      if (this.footerDraggable) {
        handles.push('.el-dialog__footer')
      }
      return {
        host: '.el-dialog',
        handle: handles,
        disabled: !this.draggable && !this.footerDraggable,
        relativePosition: true
      }
    }
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

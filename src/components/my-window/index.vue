<template>
  <el-dialog
    v-draggable="dragOptions"
    v-resizable="resizeOptions"
    :title="title"
    :visible.sync="visible"
    :modal="modal"
    :modal-append-to-body="!embed||modalAppendToBody"
    :append-to-body="appendToBody"
    :top="'8vh'"
    :custom-class="'my-window'"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="onCancel"
    :style="dialogStyle"
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
import PopupManager from 'element-ui/src/utils/popup/popup-manager'
import { setStyle } from 'element-ui/lib/utils/dom'
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
    // 可拖拽
    draggable: {
      type: Boolean,
      default: false
    },
    // 可更改尺寸
    resizable: {
      type: Boolean,
      default: false
    },
    // 页脚可拖拽
    footerDraggable: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    // 窗口内嵌
    embed: {
      type: Boolean,
      default: false
    },
    // 窗口切换
    switch: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
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
        autoCalcRange: true,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        }
      }
    },
    resizeOptions() {
      return {
        host: '.el-dialog',
        handles: 'e,s,w,es,se,ws,sw',
        edge: 5,
        disabled: !this.resizable,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        }
      }
    },
    dialogStyle() {
      const style = {
        pointerEvents: this.switch ? 'none' : '',
        overflow: this.switch ? 'hidden' : 'auto'
      }
      if (this.embed) {
        style.position = 'absolute'
      }

      return style
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
    },
    // 点击窗口
    onMousedown() {
      setStyle(this.$el, 'z-index', PopupManager.nextZIndex())
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

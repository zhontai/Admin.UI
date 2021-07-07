<template>
  <el-drawer
    v-if="drawer"
    v-resizable="drawerResizeOptions"
    :modal="currentModal"
    :wrapper-closable="wrapperClosable || closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :modal-append-to-body="currentModalAppendToBody"
    :append-to-body="currentAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    :direction="direction"
    :size="currentSize"
    :custom-class="customClass"
    :style="drawerStyle"
    :before-close="onCancel"
    @close="onClose"
  >
    <template #title>
      <slot name="title">
        <span role="heading" :title="title">{{ title }}</span>
      </slot>
    </template>
    <section style="padding:24px 48px 74px 24px;">
      <slot />
    </section>
    <div class="drawer-footer">
      <slot name="footer">
        <el-button @click.native="onCancel">取消</el-button>
        <el-button type="primary" @click="onSure">确定</el-button>
      </slot>
    </div>
  </el-drawer>
  <my-dialog
    v-else
    v-draggable="dragOptions"
    v-resizable="resizeOptions"
    :visible.sync="visible"
    :modal="currentModal"
    :modal-append-to-body="currentModalAppendToBody"
    :append-to-body="currentAppendToBody"
    :top="top"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="onCancel"
    :style="dialogStyle"
    :fullscreen="fullscreen"
    @close="onClose"
    @mousedown.native="onMousedown"
  >
    <template #title>
      <slot name="title">
        <span class="el-dialog__title">{{ title }}</span>
      </slot>
    </template>
    <slot />
    <template #footer>
      <slot name="footer">
        <el-button @click.native="onCancel">取消</el-button>
        <el-button type="primary" @click="onSure">确定</el-button>
      </slot>
    </template>
  </my-dialog>
</template>

<script>
import draggable from '@/directive/draggable'
import resizable from '@/directive/resizable'
import PopupManager from 'element-ui/src/utils/popup/popup-manager'
import { setStyle } from 'element-ui/lib/utils/dom'
import MyDialog from '@/components/my-dialog'

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
  components: { MyDialog },
  directives: {
    draggable,
    resizable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    // 抽屉
    drawer: {
      type: Boolean,
      default: false
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
    // 更改尺寸方向
    resizeHandles: {
      type: [String, Array],
      default: 'all'
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
    // 遮罩
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
    // 全屏
    fullscreen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '8vh'
    },
    customClass: {
      type: String,
      default: 'my-window'
    },
    direction: {
      type: String,
      default: 'btt',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      }
    },
    size: {
      type: [Number, String],
      default: 'auto'
    }
  },
  data() {
    let drawerResizeHandles = this.currentResizeHandles
    if (this.drawer) {
      switch (this.direction) {
        case 'btt':
          drawerResizeHandles = 'n'
          break
        case 'ttb':
          drawerResizeHandles = 's'
          break
        case 'ltr':
          drawerResizeHandles = 'e'
          break
        case 'rtl':
          drawerResizeHandles = 'w'
          break
        default:
          drawerResizeHandles = this.currentResizeHandles
          break
      }
    }
    return {
      currentModal: this.embed ? false : (this.modal && !this.switch),
      currentSize: this.fullscreen ? '100%' : this.size,
      drawerResizeHandles: drawerResizeHandles,
      currentAppendToBody: this.embed ? false : this.appendToBody,
      currentModalAppendToBody: this.embed ? false : this.modalAppendToBody
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
        disabled: (!this.draggable && !this.footerDraggable) || this.fullscreen,
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
        handles: this.resizeHandles,
        edge: 5,
        disabled: !this.resizable || this.fullscreen,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        }
      }
    },
    drawerResizeOptions() {
      return {
        host: '.el-drawer',
        handles: this.drawerResizeHandles,
        edge: 5,
        disabled: !this.resizable || this.fullscreen,
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
    },
    drawerStyle() {
      const style = {
        pointerEvents: this.switch ? 'none' : '',
        overflow: 'hidden'
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
      if (this.switch) {
        // 会影响表单弹出层，需要重新考虑
        // setStyle(this.$el, 'z-index', PopupManager.nextZIndex())
      }
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

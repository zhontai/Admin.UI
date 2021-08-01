<template>
  <el-drawer
    v-if="drawer"
    ref="mydrawer"
    v-resizable="currentDrawerResizeOptions"
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
    @open="onOpen"
    @close="onClose"
    @opened="onOpened"
    @closed="onClosed"
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
  <my-el-dialog
    v-else
    v-draggable="currentDragOptions"
    v-resizable="cuurentResizeOptions"
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
    @open="onOpen"
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
  </my-el-dialog>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'
import draggable from '@/directive/draggable'
import resizable from '@/directive/resizable'
import { setStyle } from 'element-ui/lib/utils/dom'
import MyElDialog from '@/components/element-ui/my-el-dialog'

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
  import MyConfirmButton from '@/components/my-confirm-button'

  export default {
    components: { MyWindow, MyConfirmButton }
  }
*/
export default {
  name: 'MyWindow',
  components: { MyElDialog },
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
      default: true
    },
    // 可更改尺寸
    resizable: {
      type: Boolean,
      default: true
    },
    // 更改尺寸方向
    resizeHandles: {
      type: [String, Array],
      default: 'all'
    },
    // resize选项
    resizeOptions: {
      type: Object,
      default: null
    },
    // drag选项
    dragOptions: {
      type: Object,
      default: null
    },
    drawerResizeOptions: {
      type: Object,
      default: null
    },
    // 页脚可拖拽
    footerDraggable: {
      type: Boolean,
      default: true
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
      default: true
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
    currentDragOptions() {
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
        },
        ...this.dragOptions
      }
    },
    cuurentResizeOptions() {
      return {
        host: '.el-dialog',
        handles: this.resizeHandles,
        edge: 5,
        disabled: !this.resizable || this.fullscreen,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        },
        minWidth: 200,
        minHeight: 190,
        autoCalcRange: true,
        ...this.resizeOptions
      }
    },
    currentDrawerResizeOptions() {
      return {
        host: '.el-drawer',
        handles: this.drawerResizeHandles,
        edge: 5,
        disabled: !this.resizable || this.fullscreen,
        offset: {
          left: 'marginLeft',
          top: 'marginTop'
        },
        minWidth: 200,
        minHeight: 190,
        autoCalcRange: true,
        rangeDom: this.embed ? '.el-main.main' : null,
        ...this.drawerResizeOptions
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
    if (this.drawer) {
      this.proxyChangeLayout = this.changeLayout.bind(this)
      addResizeListener(this.$el, this.proxyChangeLayout)
    }
  },
  beforeDestroy() {
    this.proxyChangeLayout && removeResizeListener(this.$el, this.proxyChangeLayout)
  },
  methods: {
    changeLayout() {
      this.currentSize = this.size
      this.$nextTick(function() {
        const rect = this.embed ? document.querySelector('.el-main.main').getBoundingClientRect() : document.body.getBoundingClientRect()
        const drawerRect = this.$refs.mydrawer.$refs.drawer.getBoundingClientRect()
        if (drawerRect.height > rect.height || drawerRect.width > rect.width) {
          this.currentSize = '100%'
        } else {
          this.currentSize = this.size
        }
      })
    },
    // 打开
    onOpen() {
      this.$emit('open')
    },
    onOpened() {
      this.$emit('opened')
    },
    // 关闭
    onClose() {
      this.$emit('close')
    },
    onClosed() {
      this.$emit('closed')
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
    // 点击窗口，实现切换窗口切换功能
    onMousedown() {
      if (this.switch) {
        const wins = []
        const wrappers = this.$el.parentNode.querySelectorAll('.el-dialog__wrapper')
        if (wrappers.length === 1) {
          return
        }
        wrappers.forEach(function(el) {
          if (el.style.zIndex > 0) {
            wins.push(el)
          }
        })
        if (wins.length === 1) {
          return
        }

        wins.sort(function(a, b) {
          if (a.style.zIndex > b.style.zIndex) {
            return 1
          } else if (a.style.zIndex < b.style.zIndex) {
            return -1
          } else {
            return 0
          }
        })

        const zIndexs = wins.map(w => {
          return w.style.zIndex
        })

        const currentZIndex = this.$el.style.zIndex
        const currentIndex = wins.findIndex(w => w.style.zIndex === currentZIndex)
        const deleteWins = wins.splice(currentIndex, 1)
        wins.push(deleteWins[0])
        wins.forEach(function(w, index) {
          setStyle(w, 'z-index', zIndexs[index])
        })
      }
    }
  }
}
</script>

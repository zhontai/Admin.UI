// 复用element-ui的dom处理函数
import { addClass, removeClass, setStyle } from 'element-ui/lib/utils/dom'

// 需要继承Events
import Events from '@/utils/events'

// 拖拽容器的className
const DRAGGABLE_CLASS = 'my-draggable'
const DRAGGABLE_RELATIVE_CLASS = 'my-draggable__relative'

// 拖拽句柄的元素className
const DRAGGABLE_HANDLE_CLASS = 'my-draggable__handle'

// 元素正在拖拽中得className
const DRAGGING_CLASS = 'my-draggable--dragging'

// 元素克隆后的元素className
const CLONE_CLASS = 'my-draggable__clone'

// 元素克隆后元素过渡动画className
const CLONE_TRANSLATE = 'my-draggable__clone--translate'

// 禁止页面选择className
const USER_SELECT_NONE = 'user-select--none'

// 空函数
const noop = function() {
}

/**
 * 拖拽类实例化默认参数
 * @const
 * @type {object}
 * @property {string} [host=null] 宿主元素选择器
 * @property {string} [handle=null] 拖拽句柄元素选择器
 * @property {string} [axis=null] 限制拖拽方向可选: v 垂直、h 水平，默认不限制
 * @property {number} [delay=100] 延时开始拖拽
 * @property {Object} [range={}] 限制拖拽范围
 * @property {number} [range.left=-10000] x坐标位置
 * @property {number} [range.top=-10000] y坐标位置
 * @property {number} [range.width=10000] 最大宽度
 * @property {number} [range.height=10000] 最大高度
 * @property {HTMLElement} [target=null] 限制在元素范围内拖拽
 * @property {boolean|function} [clone=false] 克隆拖拽对象，可以是函数返回HtmlElement
 * @property {boolean} [revert=true] 拖拽放置后动画返回原来位置，clone不为false时才有效
 * @property {string} [group=null] 分组名称， 与droppable配合使用
 * @property {function} [onStartDrag] 开始拖拽时回调
 * @property {function} [onStopDrag] 结束拖拽时回调
 * @property {function} [onDrag] 正在拖拽时回调
 */
const defaultOptions = {
  // 宿主元素选择器
  host: null,

  // 拖拽句柄元素选择器
  handle: null,

  // 限制拖拽方向可选: v 垂直、h 水平，默认不限制
  axis: null,

  // 延时开始拖拽
  delay: 100,

  // 限制拖拽范围
  range: {
    left: 0,
    top: 0,
    width: 10000,
    height: 10000
  },
  // 在元素范围内
  target: null,

  // 相对定位
  relativePosition: false,

  // 克隆拖拽，boolean 或 function
  clone: false,

  // 拖拽放置后动画返回原来位置，clone不为false时才有效
  revert: false,

  // 分组名称， 与droppable配合使用
  group: null,

  // 是否禁用拖拽
  disabled: false,

  // 克隆的元素是否加到body下
  appendToBody: false,

  // 附加数据
  data: null,

  // 开始拖拽时回调
  onStartDrag: noop,

  // 结束拖拽时回调
  onStopDrag: noop,

  // 正在拖拽时回调
  onDrag: noop
}

/**
 * 拖拽实现类 继承 [Events]{@link module:utils/events~Events}
 * @class
 * @extends Events
 */
class Draggable extends Events {
  /**
   * 构造函数
   * @param {HtmlDocument} document HTML 文档对象
   * @param {HtmlElement} el 需要拖拽的元素
   * @param {object} [options] 参数选项，默认值：[defaultOptions]{@link module:@/directive/draggable~defaultOptions}
   */
  constructor(document, el, options) {
    super()
    /**
     * HTML文档对象
     * @type {HtmlDocument}
     */
    this.document = document
    /**
     * 需要拖拽的元素
     * @type {HtmlElement}
     */
    this.el = this.getElement(el, options.host)
    this.init(options)
  }

  /**
   * 初始化返回, 实例化时调用
   * @private
   * @param {object} [options] 参数选项，默认值：[defaultOptions]{@link module:@/directive/draggable~defaultOptions}
   */
  init(options) {
    /**
     * 实例化选项参数对象
     * @member {Object}
     */
    this.options = Object.assign({},
      defaultOptions,
      options === false ? { disabled: true } : options || {})

    const o = this.options

    this.handles = []
    if (!o.disabled) {
      addClass(this.el, o.relativePosition ? DRAGGABLE_RELATIVE_CLASS : DRAGGABLE_CLASS)
      if (o.handle) {
        const type = this.getType(o.handle)
        if (type === 'array') {
          o.handle.forEach(querySelector => {
            const handle = this.getElement(this.el, querySelector)
            if (handle) {
              this.handles.push(handle)
            }
          })
        } else {
          const handle = this.getElement(this.el, o.handle)
          if (handle) {
            this.handles.push(handle)
          }
        }
      }
      if (this.handles.length === 0) {
        this.handles.push(this.el)
      }
      this.handles.forEach(handle => {
        addClass(handle, DRAGGABLE_HANDLE_CLASS)
        this.on(handle, 'mousedown', this.handleMouseDown)
      })
    }
    this.setRange()
  }

  getType(obj) {
    const toString = Object.prototype.toString
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    return map[toString.call(obj)]
  }

  /**
   * 通过选择器、元素对象、函数获取元素对象
   * @private
   * @param {HTMLElement} el 容器元素
   * @param {HTMLElement|String|Function|*} selector
   * @return {HTMLElement}
   */
  getElement(el, selector) {
    const type = typeof selector
    if (type === 'function') {
      return selector()
    } else if (type === 'string') {
      return el.querySelector(selector)
    } else if (selector instanceof HTMLElement) {
      return selector
    }
    return null
  }

  /**
   *  设置拖拽范围
   *  @private
   */
  setRange() {
    this.options.target = this.getElement(this.document, this.options.target)
    if (this.options.target instanceof HTMLElement) {
      const rect = this.options.target.getBoundingClientRect()
      this.options.range = {
        left: rect.left,
        top: rect.top,
        width: rect.left + rect.width,
        height: rect.top + rect.height
      }
    }
  }

  /**
   *  当选项参数改变时调用，更新组件
   * @param {object} [options] 参数选项, 参考：[defaultOptions]{@link module:@/directive/draggable~defaultOptions}
   */
  reset(options) {
    this.destroy()
    this.init(options)
  }

  /**
   * 响应鼠标按下时事件
   * @private
   * @param {MouseEvent} e 原生 MouseEvent
   */
  handleMouseDown(e) {
    // 防止宿主跟随鼠标移动
    e.preventDefault()
    // 设置延迟开始拖拽
    this.timer = setTimeout(() => {
      this.on(this.document, 'mousemove', this.handleMouseMove)
      this.startDrag(e.clientX, e.clientY)
    }, this.options.delay)

    this.on(this.document, 'mouseup', this.handleMouseUp)
  }

  /**
   * 响应鼠标移动事件
   * @private
   * @param {MouseEvent} e 原生 MouseEvent
   */
  handleMouseMove(e) {
    if (!this.isDragging) return

    // 如果元素同时绑定了resizable，当resizable正在Resizing时，不进行拖拽
    if (this.el.__resizable__ && this.el.__resizable__.isResizing) return

    this.drag(e.clientX, e.clientY)
  }

  /**
   * 响应鼠标松开时事件
   * @private
   * @param {MouseEvent} e 原生 MouseEvent
   */
  handleMouseUp(e) {
    clearTimeout(this.timer)
    if (this.isDragging) {
      this.off(this.document, 'mousemove', this.handleMouseMove)
      this.stopDrag(e.clientX, e.clientY)
    }
    this.off(this.document, 'mouseup', this.handleMouseUp)
  }

  /**
   * 为了防止拖拽过程中鼠标选中了页面的文字导致 mouseup 事件不被触发，在开始拖拽时禁止页面选择文字，在停止拖拽后再恢复
   * @private
   * @param none 添加还是删除，true为添加
   */
  setBodySelect(none) {
    none
      ? addClass(this.document.body, USER_SELECT_NONE)
      : removeClass(this.document.body, USER_SELECT_NONE)
  }

  /**
   * 创建拖拽代理，克隆拖拽的元素
   * @private
   * @returns {HtmlElement}
   */
  createProxy() {
    const o = this.options
    if (o.clone) {
      let node = null
      if (typeof o.clone === 'function') {
        node = o.clone(this)
      } else {
        node = this.el.cloneNode(true)
      }
      addClass(node, CLONE_CLASS)
      if (o.appendToBody) {
        this.document.body.appendChild(node)
      } else {
        this.el.parentNode.insertBefore(node, this.el)
      }
      return node
    }
    return this.el
  }

  /**
   * 删除拖拽代理
   * @private
   */
  removeProxy() {
    const o = this.options
    if (o.clone) {
      if (o.revert) {
        this.on(this.dragProxy, 'webkitTransitionEnd', this.handleAnimationEnd)
        this.on(this.dragProxy, 'transitionend', this.handleAnimationEnd)
        addClass(this.dragProxy, CLONE_TRANSLATE)
        setStyle(this.dragProxy, 'left', `${this.dragData.startLeft}px`)
        setStyle(this.dragProxy, 'top', `${this.dragData.startTop}px`)
        setTimeout(this.handleAnimationEnd.bind(this), 500)
      } else {
        this.handleAnimationEnd()
      }
    }
  }

  /**
   * 拖拽代理动画结束时销毁事件句柄，释放内存
   * @private
   */
  handleAnimationEnd() {
    if (this.dragProxy) {
      this.off(this.dragProxy, 'webkitTransitionEnd', this.handleAnimationEnd)
      this.off(this.dragProxy, 'transitionend', this.handleAnimationEnd)
      this.dragProxy.parentNode.removeChild(this.dragProxy)
      this.dragProxy = null
    }
  }

  /**
   * 开始拖拽
   * @private
   * @param pageX 鼠标X坐标
   * @param pageY 鼠标Y坐标
   */
  startDrag(pageX, pageY) {
    const left = this.el.offsetLeft
    const top = this.el.offsetTop
    const width = this.el.offsetWidth
    const height = this.el.offsetHeight
    this.isDragging = true
    this.dragData = {
      startLeft: left,
      startTop: top,
      left: left,
      top: top,
      startX: pageX,
      startY: pageY,
      width: width,
      height: height,
      offsetWidth: pageX - left,
      offsetHeight: pageY - top,
      data: this.options.data
    }
    /**
     * 开始拖拽时回调
     * @callback 开始拖拽时回调
     */
    this.options.onStartDrag(this.dragData)
    this.setBodySelect(true)
    addClass(this.el, DRAGGING_CLASS)
    this.dragProxy = this.createProxy()
    /**
     * 可放置的元素数组, 开始拖拽后才会创建
     * @type {HtmlElement[]}
     */
    this.droppables = this.getDroppables()
  }

  /**
   * 获取当前页面可放置的droppable
   * @private
   * @returns {Object[]} 可以放置的元素数组
   */
  getDroppables() {
    const o = this.options
    if (!o.group) return []
    const nodes = Array.from(this.document.querySelectorAll('.xdh-droppable'))
    return nodes.filter(node => {
      // 排除已经隐藏了droppable
      const match = node.style.display !== 'none'
      if (!match) {
        return false
      }
      const options = node.__droppable__.options
      // 判断droppable是否接受当前的draggable放置
      if (options.accept && !options.disabled) {
        return options.accept.includes(o.group.trim())
      }
      return false
    })
  }

  /**
   * 判断拖拽的元素是否在可拖拽范围内
   * @private
   * @param x 元素x坐标
   * @param y 元素y坐标
   * @param rect 可拖拽范围
   * @returns {boolean}
   */
  hasInRect(x, y, rect) {
    return x > rect.left &&
      x < rect.left + rect.width &&
      y > rect.top &&
      y < rect.top + rect.height
  }

  /**
   * 检查位置坐标的位置能否放置，能放置，返回可放置元素数组
   * @private
   * @param pageX
   * @param pageY
   * @returns {HTMLElement[]}
   */
  checkDroppable(pageX, pageY) {
    return this.droppables.filter(node => {
      const rect = node.getBoundingClientRect()
      const drop = node.__droppable__
      node.entered = !!node.entered
      const isMatch = this.hasInRect(pageX, pageY, rect)
      if (isMatch) {
        if (!node.entered) {
          // 判断是否已近存在进入droppable
          const hasEnterNodes = this.droppables.filter(n => n.entered)
          // 把已近进入的droppable设置为离开，确保当前进入的droppable只有一个
          hasEnterNodes.forEach(n => {
            n.entered = false
            n.__droppable__.$emit('drag-leave', this)
          })
          node.entered = true
          drop.$emit('drag-enter', this)
        }
        drop.$emit('drag-over', this)
      } else {
        if (node.entered) {
          node.entered = false
          drop.$emit('drag-leave', this)
        }
      }
      return isMatch
    })
  }

  /**
   * 获取可拖拽范围
   * @private
   * @param left
   * @param top
   * @param width
   * @param height
   * @returns {{left: *, top: *}}
   */
  getDragRange(left, top, width, height) {
    const range = this.options.range
    const offset = {
      left: left,
      top: top
    }
    if (left < range.left) {
      offset.left = range.left
    }
    if (top < range.top) {
      offset.top = range.top
    }
    if (left + width > range.width) {
      offset.left = range.width - width
    }
    if (top + height > range.height) {
      offset.top = range.height - height
    }
    return offset
  }

  /**
   * 拖拽
   * @private
   * @param pageX
   * @param pageY
   */
  drag(pageX, pageY) {
    const data = this.dragData
    const left = data.startLeft + pageX - data.startX
    const top = data.startTop + pageY - data.startY
    const range = this.getDragRange(left, top, data.width, data.height)
    switch (this.options.axis) {
      case 'h':
        data.left = range.left
        break
      case 'v':
        data.top = range.top
        break
      default:
        data.left = range.left
        data.top = range.top
        break
    }
    this.applyDrag()
    this.checkDroppable(pageX, pageY)
    this.options.onDrag(this.dragData)
  }

  /**
   * 拖拽实时修改元素位置
   * @private
   */
  applyDrag() {
    const data = this.dragData
    setStyle(this.dragProxy, this.options.relativePosition ? 'marginLeft' : 'left', `${data.left}px`)
    setStyle(this.dragProxy, this.options.relativePosition ? 'marginTop' : 'top', `${data.top}px`)
  }

  /**
   * 拖拽结束
   * @param pageX
   * @param pageY
   * @private
   */
  stopDrag(pageX, pageY) {
    this.isDragging = false
    this.setBodySelect()
    this.options.onStopDrag(this.dragData)
    removeClass(this.el, DRAGGING_CLASS)

    const metches = this.checkDroppable(pageX, pageY)
    metches.length ? this.handleAnimationEnd() : this.removeProxy()
    metches.forEach(node => {
      node.entered && node.__droppable__.$emit('drop', this, metches)
    })

    if (this.options.clone) {
      const data = this.dragData
      setStyle(this.el, this.options.relativePosition ? 'marginLeft' : 'left', `${data.left}px`)
      setStyle(this.el, this.options.relativePosition ? 'marginTop' : 'top', `${data.top}px`)
    }
  }

  /**
   * 销毁，释放内存
   */
  destroy() {
    super.destroy()
    this.handleAnimationEnd()

    removeClass(this.el, this.options.relativePosition ? DRAGGABLE_RELATIVE_CLASS : DRAGGABLE_CLASS)
    this.handles.forEach(handle => {
      this.off(handle, 'mousedown', this.handleMouseDown)
      removeClass(handle, DRAGGABLE_HANDLE_CLASS)
    })
  }
}

/**
 * 指令 v-draggable
 * @export
 * @example
 *
 *  <div v-draggable="{}"></div>
 *
 *  import draggable from '@/directive/draggable'
 *  export default {
 *    directives: {
 *      draggable
 *    }
 *  }
 */
export default {
  /**
   * 元素在页面渲染时回调，在这里进行实例化Draggable
   * @param {HtmlElement} el 指令的宿主元素
   * @param {Object} binding Vue指令binding对象
   */
  bind(el, binding) {
    el.__draggable__ = new Draggable(window.document, el, binding.value)
  },
  componentUpdated(el, binding) {
    const instance = el.__draggable__
    instance.options = Object.assign({},
      defaultOptions, instance.options,
      binding.value === false ? { disabled: true } : binding.value || {})
  },
  /**
   * 元素在页面销毁时回调，在这里销毁Draggable实例
   * @param el
   */
  unbind(el) {
    const instance = el.__draggable__
    instance.destroy()
  }
}

/**
 *  元素拖拽改变尺寸指令
 *  @module @/directive/resizable
 */

import { addClass, removeClass, getStyle, setStyle } from 'element-ui/lib/utils/dom'

// 需要继承Events
import Events from '@/utils/events'

// 禁止页面选择className
const USER_SELECT_NONE = 'user-select--none'

// 拖拽容器的className
const RESIZABLE_CLASS = 'my-resizable'

const RESIZING_CLASS = 'my-resizable--resizing'

// 空函数
const noop = function() {
}

/**
 * Resizable实例化默认参数
 * @const
 * @type {object}
 * @property {boolean} [disabled=false] 是否禁用
 * @property {string} [handles=all]  可resize的方向，可选值 e,s,w,n,nw,ne,sw,se,all
 * @property {number} [minWidth=20] 可resize最小宽度
 * @property {number} [minHeight=20] 可resize最小高度
 * @property {number} [maxWidth=10000] 可resize最大宽度
 * @property {number} [maxHeight=10000] 可resize最大高度
 * @property {Object} [offset={}] 位置定义
 * @property {string} [offset.left=left] x位置名称
 * @property {string} [offset.top=top] y位置名称
 * @property {function} [onStartResize] 开始改变尺寸时回调
 * @property {function} [onStopResize] 结束改变尺寸时回调
 * @property {function} [onResize] 正在改变尺寸时回调
 */
const defaultOptions = {
  // 宿主元素选择器
  host: null,
  disabled: false,
  // 可resize的方向，可选值 e,s,w,n,nw,ne,sw,se,all
  handles: 'all',
  minWidth: 100,
  minHeight: 100,
  maxWidth: 10000,
  maxHeight: 10000,
  // 自动计算范围
  autoCalcRange: false,
  // 范围元素选择器
  rangeDom: null,
  // 是否只改变width和height的值，在layout组件不需要改变left 和 top
  onlySize: false,
  // 位置定义
  offset: {
    left: 'left',
    top: 'top'
  },
  onStartResize: noop,
  onStopResize: noop,
  onResize: noop
}

/**
 * Resizable 元素改变尺寸类, 继承 [Events]{@link module:utils/events~Events}
 * @class
 * @extends Events
 */
class Resizable extends Events {
  /**
   * 构造函数
   * @param {HtmlDocument} document HTML 文档对象
   * @param {HtmlElement} el 需要拖拽的元素
   * @param {object} [options] 参数选项，默认值：[defaultOptions]{@link module:@/directive/resizable~defaultOptions}
   */
  constructor(document, el, options) {
    super()
    /**
     * HTML文档对象
     * @type {HtmlDocument}
     */
    this.document = document

    this.targetDom = el

    /**
     * 需要拖拽的元素
     * @type {HtmlElement}
     */
    this.el = this.getElement(el, options.host) || el
    this.init(options)
  }

  createDom(innerHTML) {
    const con = document.createElement('div')
    con.innerHTML = innerHTML.toString()
    return con.childNodes[0]
  }

  init(options) {
    /**
     * 实例化选项参数对象
     * @member {Object}
     */
    this.options = Object.assign({},
      defaultOptions,
      options === false ? { disabled: true } : options || {})

    const o = this.options
    this.isResizing = false
    this.isMouseEnter = false
    if (!o.disabled) {
      addClass(this.el, RESIZABLE_CLASS)

      const type = this.getType(o.handles)
      this.dirs = ['e', 's', 'w', 'n', 'nw', 'ne', 'sw', 'se']

      if (type === 'array') {
        this.dirs = o.handles
      } else {
        if (o.handles !== 'all') {
          this.dirs = o.handles.split(',')
        }
      }
      if (this.dirs.length > 0) {
        this.resizeEvent = new Event('resize')
        this.dirs.forEach(dir => {
          let resizeDom = this.getElement(this.el, `.my-resize__${dir}`)
          if (!resizeDom) {
            resizeDom = this.createDom(`<div class="my-resize__${dir}" _dir="${dir}" />`)
            this.el.appendChild(resizeDom)
          }
          this.off(resizeDom, 'mousedown', this.handleMouseDown).on(resizeDom, 'mousedown', this.handleMouseDown)
        })
      }
    }
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
    const type = this.getType(selector)
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
   *  当选项参数改变时调用，更新组件
   * @param {object} [options] 参数选项, 参考：[defaultOptions]{@link module:@/directive/reizable~defaultOptions}
   */
  reset(options) {
    this.destroy()
    this.init(options)
  }

  handleMouseDown(e) {
    e.preventDefault()

    if (this.options.autoCalcRange) {
      const rangeDomRect = this.options.rangeDom ? this.getElement(this.document, this.options.rangeDom).getBoundingClientRect() : this.targetDom.parentNode.getBoundingClientRect()
      this.options.maxWidth = rangeDomRect.width - 10
      this.options.maxHeight = rangeDomRect.height - 10
    }

    this.dir = e.target.attributes['_dir'].value
    this.startResize(e.clientX, e.clientY)
    this.setCursor(this.dir)
    this.off(this.document, 'mousemove', this.handleMouseMove).on(this.document, 'mousemove', this.handleMouseMove)
    this.off(this.document, 'mouseup', this.handleMouseUp).on(this.document, 'mouseup', this.handleMouseUp)
    return false
  }

  handleMouseMove(e) {
    if (this.options.disabled) return

    if (this.isResizing) {
      this.resize(e)
      this.applyResize()
    }
    return false
  }

  setCursor(dir) {
    const cursor = dir ? `${dir}-resize` : ''
    setStyle(this.document.body, 'cursor', cursor)
  }

  handleMouseUp(e) {
    this.isResizing && this.stopResize()
    this.off(e.target, 'mousemove', this.handleMouseMove)
    this.off(e.target, 'mouseup', this.handleMouseUp)
    this.setCursor(null)
  }

  startResize(clientX, clientY) {
    this.isResizing = true
    const left = this.el.offsetLeft
    const top = this.el.offsetTop
    const width = this.el.offsetWidth
    const height = this.el.offsetHeight
    this.resizeData = {
      dir: this.dir,
      startLeft: left,
      startTop: top,
      left: left,
      top: top,
      startX: clientX,
      startY: clientY,
      startWidth: width,
      startHeight: height,
      width: width, // outerWidth
      height: height, // outerHeight
      deltaWidth: width - Number.parseInt(getStyle(this.el, 'width')), // outerWidth 与 元素 width 的差值
      deltaHeight: height - Number.parseInt(getStyle(this.el, 'height')) // outerHeight 与 元素 height 的差值
    }
    this.setBodySelect(true)
    this.options.onStartResize(this.resizeData)
    addClass(this.el, RESIZING_CLASS)
  }

  stopResize() {
    this.isResizing = false
    this.setBodySelect()
    this.options.onStopResize(this.resizeData)
    removeClass(this.el, RESIZING_CLASS)
  }

  resize({ clientX, clientY }) {
    const data = this.resizeData
    if (!data.dir) return

    const o = this.options
    if (data.dir.includes('e')) {
      let width = data.startWidth + clientX - data.startX
      width = Math.min(
        Math.max(width, o.minWidth),
        o.maxWidth
      )
      data.width = width
    }
    if (data.dir.includes('s')) {
      let height = data.startHeight + clientY - data.startY
      height = Math.min(
        Math.max(height, o.minHeight),
        o.maxHeight
      )
      data.height = height
    }
    if (data.dir.includes('w')) {
      let width = data.startWidth - clientX + data.startX
      width = Math.min(
        Math.max(width, o.minWidth),
        o.maxWidth
      )
      data.width = width
      data.left = data.startLeft + data.startWidth - data.width
    }
    if (data.dir.includes('n')) {
      let height = data.startHeight - clientY + data.startY
      height = Math.min(
        Math.max(height, o.minHeight),
        o.maxHeight
      )
      data.height = height
      data.top = data.startTop + data.startHeight - data.height
    }
  }

  applyResize() {
    const data = this.resizeData
    const onlySize = this.options.onlySize
    switch (data.dir) {
      case 's':
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        break
      case 'w':
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        !onlySize && setStyle(this.el, this.options.offset.left, `${data.left}px`)
        break
      case 'e':
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        break
      case 'n':
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        !onlySize && setStyle(this.el, this.options.offset.top, `${data.top}px`)
        break
      case 'ne':
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        !onlySize && setStyle(this.el, this.options.offset.top, `${data.top}px`)
        break
      case 'sw':
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        !onlySize && setStyle(this.el, this.options.offset.left, `${data.left}px`)
        break
      case 'se':
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        break
      default:
        setStyle(this.el, 'width', `${data.width - data.deltaWidth}px`)
        setStyle(this.el, 'height', `${data.height - data.deltaHeight}px`)
        !onlySize && setStyle(this.el, this.options.offset.left, `${data.left}px`)
        !onlySize && setStyle(this.el, this.options.offset.top, `${data.top}px`)
        break
    }
    window.dispatchEvent(this.resizeEvent)
    this.options.onResize(this.resizeData)
  }

  /**
   * 为了防止拖拽过程中鼠标选中了页面的文字导致 mouseup 事件不被触发，在开始拖拽时禁止页面选择文字，在停止拖拽后再恢复
   * @param none
   * @private
   */
  setBodySelect(none) {
    none
      ? addClass(this.document.body, USER_SELECT_NONE)
      : removeClass(this.document.body, USER_SELECT_NONE)
  }

  /**
   * 销毁
   */
  destroy() {
    super.destroy()

    if (this.el) {
      removeClass(this.el, RESIZABLE_CLASS)
      this.off(this.el, 'mousedown', this.handleMouseDown)
    }

    this.off(this.document, 'mousemove', this.handleMouseMove)
    this.off(this.document, 'mouseup', this.handleMouseUp)

    this.dirs && this.dirs.forEach(dir => {
      const resizeDom = this.el.querySelector(`.my-resize__${dir}`)
      if (resizeDom) {
        try {
          this.el.removeChild(resizeDom)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
}

/**
 * 指令 v-resizable
 * @export
 * @example
 *
 *  <div v-resizable="{}"></div>
 *
 *  import resizable from '@/directive/resizable'
 *  export default {
 *    directives: {
 *      resizable
 *    }
 *  }
 */
export default {
  /**
   * 元素在页面渲染时回调，在这里进行实例化Resizable
   * @param {HtmlElement} el 指令的宿主元素
   * @param {Object} binding Vue指令binding对象
   */
  bind(el, binding) {
    el.__resizable__ = new Resizable(window.document, el, binding.value)
  },
  inserted(el) {
  },
  componentUpdated(el, binding) {
    const instance = el.__resizable__
    instance?.reset(binding.value)
  },
  /**
   * 元素在页面销毁时回调，在这里销毁Resizable实例
   * @param el
   */
  unbind(el) {
    const instance = el.__resizable__
    instance?.destroy()
  }
}

/**
 * 事件基类，提供DOM事件和自定义事件侦听、触发、销毁功能，自定义事件基于Vue实现，面向对象类可继承该类实现事件相关功能
 * @module @/utils/events
 */

import { on, off } from 'element-ui/lib/utils/dom'
import Vue from 'vue'

/**
 * 事件处理基类
 * @export
 */
class Events {
  /**
   * @constructor
   */
  constructor() {
    /**
     * DOM事件句柄对象handler缓存集合,  私有属性
     * @type {Object[]}
     * @property {Object[]} handler
     * @property  {HtmlElement} handler.el DOM元素
     * @property {String} handler.eventName 事件名称，如: click、mouseenter、keydown
     * @property {Function} handler.callback 事件回调函数
     * @property {Function} handler.proxy 时间回调函数代理，更换了作用域this指向当前实例
     */
    this.__handlers__ = []

    /**
     * 自定义事件处理对象，基于Vue实例实现，私有属性
     * @type {Vue}
     */
    this.__event__ = new Vue({})
  }

  /**
   * 绑定DOM事件
   * @param {HtmlElement} el 元素DOM对象
   * @param {String} eventName 事件名称如：click、mouseenter、keydown
   * @param {Function} callback 事件回调函数
   */
  on(el, eventName, callback) {
    const proxy = callback.bind(this)
    const handler = { el, eventName, callback, proxy }
    this.__handlers__.push(handler)
    on(el, eventName, proxy)
    return this
  }

  /**
   * 绑定自定义事件
   * @param {String} name 事件名称
   * @param {Function} handler 事件处理函数
   * @returns {Vue}
   */
  $on(name, handler) {
    this.__event__.$on.apply(this.__event__, arguments)
    return this
  }

  /**
   * 绑定自定义事件
   * @param {String} name 事件名称
   * @param {Function} handler 事件处理函数
   * @return {*}
   */
  $once(name, handler) {
    this.__event__.$once.apply(this.__event__, arguments)
    return this
  }

  /**
   * 销毁指定DOM事件
   * @param {HtmlElement} el DOM元素
   * @param {String} [eventName] 事件名称如：click、mouseenter、keydown，可选参数，如不传，即表示销毁当前元素的全部事件
   * @param {Function} [callback] 事件回调函数，可选，如不传，即表示销毁当前元素指定类型的事件
   */
  off(el, eventName, callback) {
    if (!el) return
    const length = arguments.length
    this.__handlers__.forEach((item, index) => {
      switch (length) {
        case 3:
          if (item.el === el && item.eventName === eventName && item.callback === callback) {
            off(item.el, item.eventName, item.proxy)
            this.__handlers__.splice(index, 1)
          }
          break
        case 2:
          if (item.el === el && item.eventName === eventName) {
            off(item.el, item.eventName, item.proxy)
            this.__handlers__.splice(index, 1)
          }
          break
        case 1:
          if (item.el === el) {
            off(item.el, item.eventName, item.proxy)
            this.__handlers__.splice(index, 1)
          }
          break
      }
    })
    return this
  }

  /**
   * 销毁自定义事件
   * @param {String} [name] 事件名称，可选，不传表示销毁当前实例的全部事件
   * @param {Function} [handler] 事件回调函数，可选，不传表示销毁当前实例指定时间名称的全部事件
   * @returns {*}
   */
  $off(name, handler) {
    this.__event__.$off.apply(this.__event__, arguments)
    return this
  }

  /**
   * 触发自定义事件
   * @param {string} name 事件名称
   * @param {Function} handler 事件回调函数
   * @returns {*}
   */
  $emit(name, handler) {
    this.__event__.$emit.apply(this.__event__, arguments)
    return this
  }

  /**
   * 销毁实例，把DOM和自定义事件全部销毁，释放内存
   */
  destroy() {
    this.__handlers__.forEach(item => {
      off(item.el, item.eventName, item.proxy)
    })
    this.__handlers__ = []
    this.__event__.$off()
    this.__event__.$destroy()
  }
}

/**
 * 事件基类
 * @type {Events}
 */
export default Events

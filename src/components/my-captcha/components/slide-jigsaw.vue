<template>
  <div ref="jigsaw" style="position: relative;">
    <div
      v-if="type === '1'"
      v-show="showJigsaw"
      :class="['verify-img-out', mode === 'hover' ? 'verify-img-out-hover':'']"
      :style="[{height: (parseInt(setSize.imgHeight) + vSpace) + 'px'}, mode === 'hover' ? { 'bottom': barSize.height}:{}]"
    >
      <div
        class="verify-img-panel"
        :style="{width: setSize.imgWidth, height: setSize.imgHeight}"
      >
        <img :src="backImgBase ? backImgBase : defaultImg" alt="" style="width:100%;height:100%;display:block">
        <div
          v-if="type === '1'"
          class="verify-sub-block"
          :style="{ left: moveBlockLeft }"
          @touchstart="start"
          @mousedown="start"
        >
          <img :src="blockBackImgBase" alt="" style="width:100%;height:100%;display:block">
        </div>
        <div v-show="showRefresh" class="verify-refresh" @click="refresh"><i class="el-icon-refresh-right" />
        </div>
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ?'suc-bg':'err-bg'">{{ tipWords }}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      :class="['verify-bar-area', statusClass]"
      :style="{ width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height }"
    >
      <span class="verify-msg">{{ text }}</span>
      <div
        class="verify-left-bar"
        :style="{ width: (leftBarWidth !== undefined) ? leftBarWidth : 0, height: barSize.height, transaction: transitionWidth }"
      >
        <span class="verify-msg">{{ finishText }}</span>
      </div>
      <div
        class="verify-move-block"
        :style="{ width: blockSize.width, height: barSize.height, left: moveBlockLeft, transition: transitionLeft }"
        @touchstart="start"
        @mousedown="start"
      >
        <i :class="[iconClass]" />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
     * VerifySlide
     * @description 滑块
     * */
import { aesEncrypt } from './../utils/ase'
import { resetSize } from './../utils/util'
import { reqGet, reqCheck } from './../api/index'
import { on, off } from 'element-ui/lib/utils/dom'

//  "captchaType":"SlideJigsaw",
export default {
  name: 'SlideJigsaw',
  props: {
    captchaType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '1'
    },
    // 弹出式popup，嵌入式embed，悬浮hover
    mode: {
      type: String,
      default: 'embed'
    },
    vSpace: {
      type: Number,
      default: 5
    },
    explain: {
      type: String,
      default: '向右拖动滑块填充拼图'
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object,
      default() {
        return {
          width: '40px',
          height: '40px'
        }
      }
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '40px'
        }
      }
    },
    defaultImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      secretKey: '', // 后端返回的加密秘钥 字段
      passFlag: false, // 是否通过的标识
      backImgBase: '', // 验证码背景图片
      blockBackImgBase: '', // 验证滑块的背景图片
      backToken: '', // 后端返回的唯一token值
      startMoveTime: '', // 移动开始的时间
      endMovetime: '', // 移动结束的时间
      tipsBackColor: '', // 提示词的背景颜色
      tipWords: '',
      text: '',
      finishText: '',
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0
      },
      top: 0,
      left: 0,
      moveBlockLeft: undefined,
      leftBarWidth: undefined,
      // 移动中样式
      moveBlockBackgroundColor: undefined,
      iconColor: undefined,
      iconClass: 'el-icon-right',
      isDragging: false, // 拖拽状态
      isEnd: false,		// 是够验证完成
      showRefresh: true,
      transitionLeft: '',
      transitionWidth: '',
      statusClass: '',
      showJigsaw: this.mode !== 'hover'
    }
  },
  computed: {
    barArea() {
      return this.$el.querySelector('.verify-bar-area')
    },
    resetSize() {
      return resetSize
    }
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    // 禁止拖拽
    this.$el.onselectstart = function() {
      return false
    }
  },
  methods: {
    init() {
      this.text = this.explain
      this.getPictrue()
      this.$nextTick(() => {
        const setSize = this.resetSize(this)	// 重新设置宽度高度
        for (const key in setSize) {
          this.$set(this.setSize, key, setSize[key])
        }

        if (this.mode === 'hover') {
          const jigsaw = this.$refs.jigsaw
          off(jigsaw, 'mouseover', this.onBarMouseOver)
          off(jigsaw, 'mouseout', this.onBarMouseOut)
          on(jigsaw, 'mouseover', this.onBarMouseOver)
          on(jigsaw, 'mouseout', this.onBarMouseOut)
        }

        this.$parent.$emit('ready', this)
      })

      off(window, 'touchmove', (e) => {
        this.move(e)
      })
      off(window, 'mousemove', (e) => {
        this.move(e)
      })

      // 鼠标松开
      off(window, 'touchend', () => {
        this.end()
      })
      off(window, 'mouseup', () => {
        this.end()
      })

      on(window, 'touchmove', (e) => {
        this.move(e)
      })
      on(window, 'mousemove', (e) => {
        this.move(e)
      })

      // 鼠标松开
      on(window, 'touchend', () => {
        this.end()
      })
      on(window, 'mouseup', () => {
        this.end()
      })
    },
    // 滑动条进入
    onBarMouseOver() {
      this.showJigsaw = true
    },
    // 滑动条移开
    onBarMouseOut() {
      this.showJigsaw = false
    },
    // 鼠标按下
    start: function(e) {
      e = e || window.event
      let x = 0
      if (e.touches) { // 兼容移动端
        x = e.touches[0].pageX
      } else { // 兼容PC端
        x = e.clientX
      }

      this.startLeft = Math.floor(x - this.barArea.getBoundingClientRect().left)
      this.startMoveTime = +new Date() // 开始滑动的时间
      if (this.isEnd === false) {
        e.stopPropagation()
        this.isDragging = true
      }
    },
    // 鼠标移动
    move: function(e) {
      e.preventDefault()
      e = e || window.event
      if (this.isDragging && this.isEnd === false) {
        if (this.text !== '') {
          this.text = ''
        }
        this.statusClass = 'verify-bar-area--moving'

        let x = 0
        if (e.touches) { // 兼容移动端
          x = e.touches[0].pageX
        } else { // 兼容PC端
          x = e.clientX
        }
        var bar_area_left = this.barArea.getBoundingClientRect().left
        var move_block_left = x - bar_area_left // 小方块相对于父元素的left值
        if (move_block_left >= this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2) {
          move_block_left = this.barArea.offsetWidth - parseInt(parseInt(this.blockSize.width) / 2) - 2
        }
        if (move_block_left <= 0) {
          move_block_left = parseInt(parseInt(this.blockSize.width) / 2)
        }
        // 拖动后小方块的left值
        this.moveBlockLeft = (move_block_left - this.startLeft) + 'px'
        this.leftBarWidth = (move_block_left - this.startLeft + parseInt(this.blockSize.width)) + 'px'
      }
    },

    // 鼠标松开
    end: function() {
      this.endMovetime = +new Date()
      var _this = this
      this.isDragging = false
      // 判断是否重合
      if (this.isEnd === false) {
        var moveLeftDistance = parseInt((this.moveBlockLeft || '').replace('px', ''))
        if (!(moveLeftDistance > 0)) {
          return
        }
        moveLeftDistance = moveLeftDistance * 310 / parseInt(this.setSize.imgWidth)
        moveLeftDistance = parseInt(moveLeftDistance)
        const data = {
          captchaType: this.captchaType,
          'point': this.secretKey ? aesEncrypt(JSON.stringify({ x: moveLeftDistance }), this.secretKey) : JSON.stringify({ x: moveLeftDistance }),
          'token': this.backToken
        }
        reqCheck(data).then(res => {
          if (res.success) {
            this.statusClass = 'verify-bar-area--success'
            this.iconClass = 'el-icon-check'
            this.showRefresh = false
            this.isEnd = true
            if (this.mode === 'popup') {
              setTimeout(() => {
                this.$parent.clickShow = false
              }, 1500)
            }
            this.passFlag = true
            this.tipWords = `${((this.endMovetime - this.startMoveTime) / 1000).toFixed(2)}s验证成功`
            var captchaVerification = this.secretKey ? aesEncrypt(this.backToken + '---' + JSON.stringify({ x: moveLeftDistance }), this.secretKey) : this.backToken + '---' + JSON.stringify({ x: moveLeftDistance })
            setTimeout(() => {
              this.tipWords = ''
              this.$parent.closeBox()
              this.$parent.$emit('success', { captchaVerification })
            }, 1000)
          } else {
            this.passFlag = false
            this.iconClass = 'el-icon-close'
            this.statusClass = 'verify-bar-area--error'
            setTimeout(function() {
              _this.refresh()
            }, 1000)
            this.$parent.$emit('error', this)
            // this.tipWords = '验证失败'
            setTimeout(() => {
              this.tipWords = ''
            }, 1000)
          }
        })
      }
    },

    refresh: function() {
      this.showRefresh = true
      this.finishText = ''

      this.transitionLeft = 'left .3s'
      this.moveBlockLeft = 0

      this.leftBarWidth = undefined
      this.transitionWidth = 'width .3s'

      this.statusClass = ''
      this.iconClass = 'el-icon-right'
      this.isEnd = false
      this.isDragging = false

      this.getPictrue()
      setTimeout(() => {
        this.transitionWidth = ''
        this.transitionLeft = ''
        this.text = this.explain
      }, 300)
    },

    // 请求背景图片和验证图片
    getPictrue() {
      const data = {
        captchaType: this.captchaType,
        clientUid: localStorage.getItem('slider'),
        ts: Date.now() // 现在的时间戳
      }
      reqGet(data).then(res => {
        if (res.success) {
          this.backImgBase = res.data.data.baseImage
          this.blockBackImgBase = res.data.data.blockImage
          this.backToken = res.data.token
          // this.secretKey = res.repData.secretKey
        } else {
          this.tipWords = res.repMsg
        }

        // 判断接口请求次数是否失效
        // if (res.repCode === '6201') {
        //   this.backImgBase = null
        //   this.blockBackImgBase = null
        // }
      })
    }
  }
}
</script>


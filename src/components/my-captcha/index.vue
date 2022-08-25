<template>
  <div v-show="showBox" :class="mode==='popup'?'mask':''">
    <div :class="mode==='popup'?'verifybox':''" :style="{'max-width':parseInt(imgSize.width)+30+'px'}">
      <div v-if="mode==='popup'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="el-icon-close" />
        </span>
      </div>
      <div
        class="verifybox-bottom"
        :style="{padding:mode==='popup'?'15px':'0'}"
      >
        <!-- 验证码容器 -->
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          :default-img="defaultImg"
        />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
     * Verify 验证码组件
     * @description 分发验证码使用
     * */
import ClickWord from './components/click-word'
import SlideJigsaw from './components/slide-jigsaw'

export default {
  name: 'MyCaptcha',
  components: {
    ClickWord,
    SlideJigsaw
  },
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default() {
        // 默认语言不输入为浏览器语言
        let language = ''
        if (navigator.language) {
          language = navigator.language
        } else {
          language = navigator.browserLanguage
        }
        return language
      }
    },
    captchaType: {
      type: String,
      default: 'SlideJigsaw'
    },
    figure: {
      type: Number,
      default: 0
    },
    arith: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'embed'
    },
    vSpace: {
      type: Number,
      default: 15
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
    }
  },
  data() {
    return {
      // showBox:true,
      clickShow: false,
      // 内部类型
      verifyType: '1',
      // 所用组件类型
      componentType: 'SlideJigsaw',
      // 默认图片
      defaultImg: ''// require('@/assets/images/default.jpg')
    }
  },
  computed: {
    instance() {
      return this.$refs.instance || {}
    },
    showBox() {
      if (this.mode === 'popup') {
        return this.clickShow
      } else {
        return true
      }
    }
  },
  watch: {
    captchaType: {
      immediate: true,
      handler(captchaType) {
        switch (captchaType.toString()) {
          case 'SlideJigsaw':
            this.verifyType = '1'
            this.componentType = 'SlideJigsaw'
            break
          case 'clickWord':
            this.verifyType = '2'
            this.componentType = 'ClickWord'
            break
        }
      }
    }
  },
  mounted() {
    this.uuid()
  },
  methods: {
    // 生成 uuid
    uuid() {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      const slider = 'slider' + '-' + s.join('')
      const point = 'point' + '-' + s.join('')
      // 判断下是否存在 slider
      console.log(localStorage.getItem('slider'))
      if (!localStorage.getItem('slider')) {
        localStorage.setItem('slider', slider)
      }
      if (!localStorage.getItem('point')) {
        localStorage.setItem('point', point)
      }
    },
    /**
     * i18n
     * @description 兼容vue-i18n 调用$t来转换ok
     * @param {String} text-被转换的目标
     * @return {String} i18n的结果
     * */
    i18n(text) {
      if (this.$t) {
        return this.$t(text)
      } else {
        // 兼容不存在的语言
        const i18n = this.$options.i18n.messages[this.locale] || this.$options.i18n.messages['en-US']
        return i18n[text]
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh() {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    load() {
      if (this.instance.load) {
        this.instance.load()
      }
    },
    closeBox() {
      this.clickShow = false
      // this.refresh()
    },
    show() {
      if (this.mode === 'popup') {
        this.clickShow = true
        this.load()
      }
    }
  }
}
</script>
<style>
    .verifybox{
      position: relative;
      box-sizing: border-box;
      border-radius: 2px;
      border: 1px solid #e4e7eb;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
    .verifybox-top{
      padding: 0 15px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      font-size: 16px;
      color: #45494c;
      border-bottom: 1px solid #e4e7eb;
      box-sizing: border-box;
    }
    .verifybox-bottom{
      padding: 15px;
      box-sizing: border-box;
    }
    .verifybox-close{
      position: absolute;
      top: 13px;
      right: 9px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
      opacity: 0.8;
    }
    .verifybox-close:hover{
      opacity: 1;
    }
    .mask{
        position: fixed;
        top: 0;
        left:0;
        z-index: 1001;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0,.3);
        /* display: none; */
        transition: all .5s;
    }
    .verify-tips{
      position: absolute;
      left: 0px;
      bottom:0px;
      width: 100%;
      height: 30px;
      line-height:30px;
      color: #fff;
    }
    .suc-bg{
      background-color:rgba(92, 184, 92,.5);
      filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
    }
    .err-bg{
       background-color:rgba(217, 83, 79,.5);
       filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
    }
    .tips-enter,.tips-leave-to{
        bottom: -30px;
    }
    .tips-enter-active,.tips-leave-active{
        transition: bottom .5s;
    }
    /* ---------------------------- */
    /*常规验证码*/
    .verify-code {
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 5px;
        border: 1px solid #ddd;
    }

    .cerify-code-panel {
        height: 100%;
        overflow: hidden;
    }

    .verify-code-area {
        float: left;
    }

    .verify-input-area {
        float: left;
        width: 60%;
        padding-right: 10px;

    }

    .verify-change-area {
        line-height: 30px;
        float: left;
    }

    .varify-input-code {
        display: inline-block;
        width: 100%;
        height: 25px;
    }

    .verify-change-code {
        color: #337AB7;
        cursor: pointer;
    }

    .verify-btn {
        width: 200px;
        height: 30px;
        background-color: #337AB7;
        color: #FFFFFF;
        border: none;
        margin-top: 10px;
    }

    /*滑动验证码*/
    .verify-img-out.verify-img-out-hover{
      height: 170px;
      position: absolute;
      z-index: 2;
      bottom: 40px;
    }
    .verify-bar-area {
        position: relative;
        background: #FFFFFF;
        text-align: center;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .verify-bar-area .verify-move-block {
        position: absolute;
        top: 0px;
        left: 0;
        background: #fff;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        box-shadow: 0 0 2px #888888;
        border-radius: 1px;
    }

    .verify-bar-area .verify-move-block i{
      font-size: 22px;
      line-height: 40px;
    }

    .verify-bar-area .verify-move-block:hover,.verify-bar-area.verify-bar-area--moving  .verify-move-block{
        background-color: #1991fa;
        color: #FFFFFF;
    }

    .verify-bar-area .verify-left-bar {
        position: absolute;
        top: -1px;
        left: -1px;
        cursor: pointer;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border: 1px solid transparent;
    }

    .verify-bar-area.verify-bar-area--moving .verify-left-bar {
        background: #D9ECFF;
        border-color: #409EFF;
    }

    .verify-bar-area.verify-bar-area--error .verify-left-bar {
        background: #FDE2E2;
        border-color: #F56C6C;
    }
    .verify-bar-area.verify-bar-area--error .verify-move-block{
        background-color: #F56C6C;
        color: #FFFFFF;
    }

    .verify-bar-area.verify-bar-area--success .verify-left-bar {
        background: #d2f4ef;
        border-color: #52ccba;
    }

    .verify-bar-area.verify-bar-area--success .verify-move-block{
        background-color: #52ccba;
        color: #FFFFFF;
    }

    .verify-img-panel {
        margin: 0;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        border-radius: 3px;
        position: relative;
    }

    .verify-img-panel .verify-refresh {
        width: 34px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        font-size: 20px;
        color: #fff;
        opacity: 0.8;
        background: rgba(0,0,0,.2);
    }

    .verify-img-panel .verify-refresh:hover {
        opacity: 1;
    }

    .verify-img-panel .verify-gap {
        background-color: #fff;
        position: relative;
        z-index: 2;
        border: 1px solid #fff;
    }

    .verify-img-panel .verify-sub-block {
        position: absolute;
        text-align: center;
        top:0px;
        left:0px;
    }

    .verify-bar-area .verify-move-block .verify-icon {
        font-size: 18px;
    }

    .verify-bar-area .verify-msg {
        z-index: 3;
    }
</style>

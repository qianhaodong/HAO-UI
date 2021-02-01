Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },

  // 自定义样式
  externalClasses: ['sq-class'],

  properties: {
    // 遮罩隐藏功能
    __maskClosable: {
      type: Boolean,
      value: false
    },
    // 按钮
    actionBtns: {
      type: Array,
      value: [
        {
          type: 'cancel',
          txt: '取消'
        },
        {
          type: 'confirm',
          txt: '确认'
        }
      ]
    },
    // 自定义底部按钮
    customBtns: {
      type: Boolean,
      value: false
    }
  },

  data: {
    visible: false
  },

  methods: {
    show() {
      this.setData({ visible: true })
    },

    hide() {
      this.setData({ visible: false })
    },
    
    handleBtnClick({ currentTarget: { dataset } }) {
      this.hide()
      this.triggerEvent('btn-click', { type: dataset.type })
    },
    
    handleMaskClick() {
      if (!this.data.__maskClosable) return
      this.hide()
    },

    // 弹窗显示时禁止页面滚动
    stopTouchMove() { return }
  }
})

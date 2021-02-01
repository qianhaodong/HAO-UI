Component({
  externalClasses: ['q-as-class'],

  options: {
    multipleSlots: true
  },
  
  properties: {
    // 遮罩隐藏功能
    maskClosable: {
      type: Boolean,
      value: true
    },
    // 隐藏取消
    showCancel: {
      type: Boolean,
      value: false
    },
    // 取消文本
    cancelText: {
      type: String,
      value: '取消'
    },
    // 圆角
    borderRadius: {
      type: Boolean,
      value: false
    },
    // 自定义
    custom: {
      type: Boolean,
      value: false,
    },
    // 操作选项
    actions: {
      type: Array,
      value: [
        { name: '操作一' },
        { name: '操作二' }
      ]
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

    handleMaskClick() {
      if (!this.data.maskClosable) return
      this.handleCancelClick()
    },

    handleItemClick({ currentTarget: { dataset = {} } }) {
      const { index } = dataset
      this.triggerEvent('click', { index })
      this.hide()
    },

    handleCancelClick() {
      this.triggerEvent('cancel');
      this.hide()
    },
    
    // 弹窗显示时禁止页面滚动
    stopTouchMove() { return }
  }
})

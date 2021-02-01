Component({
  externalClasses: ['q-md-class'],
  
  properties: {
    // 遮罩层关闭功能
    maskClosable: {
      type: Boolean,
      value: false
    },
    // 当前选择项索引
    currentIndex: {
      type: Number,
      value: 0
    },
    // 下拉列表
    dropList: {
      type: Array,
      value: []
    }
  },

  data: {
    // 组件显示标志
    visible: false,
    // 过渡结束状态（用来实现下拉弹窗隐藏过渡效果）
    tsEnd: true
  },

  methods: {
    // 弹窗显示时禁止页面滚动
    stopTouchMove() { return },

    // 遮罩层点击事件
    handleMaskClick() {
      if (!this.data.maskClosable) return
      // 初始化过渡完成状态
      this.setData({ tsEnd: false })
      this.handleHideClick()
    },

    // 下拉菜单 显示/收起 切换事件
    handleToggleClick() {
      this.setData({
        tsEnd: false,
        visible: !this.data.visible
      })
    },

    // 下拉菜单项点击事件
    handleItemClick({ currentTarget: { dataset } }) {
      const { index } = dataset
      
      // 初始化状态
      this.setData({
        tsEnd: false,
        visible: false
      })

      // 当点击当前项时，不执行
      if (this.data.currentIndex === index) return
      
      this.setData({ currentIndex: index })
      this.triggerEvent('click', { index })
    },

    handleHideClick() {
      this.setData({
        visible: false
      })
    },

    // 过渡结束事件
    scrollTransitionend() {
      this.setData({ tsEnd: true })
    }
  }
})
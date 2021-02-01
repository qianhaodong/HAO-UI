Component({
  properties: {
    // 导航标题
    navTitle: {
      type: String,
      value: ''
    },
    // back icon
    backIcon: {
      type: String,
      value: '/assets/images/back-icon.png'
    },
    // border-bottom
    showBorder: {
      type: Boolean,
      value: false
    }
  },

  data: {
    // 自定义导航栏高度
    navBarHeight: 0,
  },

  lifetimes: {
    attached() {
      this.initStyle()
    }
  },

  methods: {
    // 初始化导航栏样式
    initStyle() {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync()
      // 获取状态栏高度
      const statusBarHeight = systemInfo.statusBarHeight
      const menuBtnInfo = wx.getMenuButtonBoundingClientRect()
      const {
        // 获取菜单按钮（右上角胶囊按钮）的高度
        height: menuBtnHeight,
        // 获取菜单按钮（右上角胶囊按钮）的上边界坐标
        top: menuBtnTop
      } = menuBtnInfo
      // 计算导航栏高度 = 状态栏高度 + 菜单按钮高度 + 菜单按钮到状态栏的距离 * 2
      const navBarHeight = statusBarHeight + menuBtnHeight + (menuBtnTop - statusBarHeight) * 2

      this.setData({
        statusBarHeight,
        navBarHeight
      })
      this.triggerEvent('height', { height: navBarHeight })
    },

    back() {
      this.triggerEvent('back')
    }
  }
})

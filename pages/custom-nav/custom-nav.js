Page({
  data: {

  },

  onLoad(options) {

  },

  back() {
    wx.showModal({
      title: '确认退出',
      content: '是否确认退出？',
      success: res => {
        if (res.confirm) {
          wx.navigateBack({ delta: 1 })
        }
      }
    })
  },
  
  // 获取自定义导航栏高度
  getNavBarHeight({ detail: { height } }) {
    this.setData({ navBarHeight: height })
  },
})
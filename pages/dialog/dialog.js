Page({
  data: {
    actionbtns1: [{
      type: 'confirm',
      txt: '我知道了',
      color: '#52698b'
    }],

    popChooseList: [
      {
        name: '选项1'
      },
      {
        name: '选项2'
      },
      {
        name: '选项3'
      }
    ]
  },

  onLoad() {
    const { popChooseList } = this.data

    // 初始化选中状态
    popChooseList.forEach((item, index) => {
      item.checked = false
      if (index == 0) {
        item.checked = true
      }
    })

    this.setData({ popChooseList })
  },

  show({ currentTarget: { dataset } }) {
    const { id } = dataset

    // 执行组件 show() 方法
    this.selectComponent(`#dialog${id}`).show()
  },

  phoneCallTap() {
    wx.makePhoneCall({
      phoneNumber: '10086'
    })
  },

  handleBtnClick() {
    this.selectComponent('#dialog3').hide()
  },

  // 获取用户信息
  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const { userInfo } = e.detail
      console.log('userInfo: ', userInfo)
    }
  },

  handleItemClick({ currentTarget: { dataset } }) {
    const { index } = dataset
    const { popChooseList } = this.data

    popChooseList.forEach((item, cIndex) => {
      if (index == cIndex) {
        item.checked = true
      } else {
        item.checked = false
      }
    })

    this.setData({ popChooseList })
  }
})
Page({
  data: {
    radioShow: true,
    visible: false,
    list: [
      { name: '选项1' },
      { name: '选项2' },
      { name: '选项3' },
      { name: '选项4' },
      { name: '选项5' },
      { name: '选项6' },
      { name: '选项7' },
      { name: '选项8' },
      { name: '选项9' },
      { name: '选项10' },
      { name: '选项11' },
      { name: '选项12' },
      { name: '选项13' },
      { name: '选项14' },
      { name: '选项15' },
      { name: '选项16' },
    ]
  },

  handleBtnClick({ detail }) {
    const { result } = detail
    let { list } = this.data

    if (!result.length) {
      wx.showToast({
        title: '请选择操作项',
        icon: 'none',
        duration: 2000
      })
      return
    }

    list = list.filter((item, index) => result.includes(index))
    console.log('list: ', list)
  }
})
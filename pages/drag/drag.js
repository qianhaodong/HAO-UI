Page({
  data: {
    list: [
      { color: '#ff6666' },
      { color: '#ff9966' },
      { color: '#ffff66' },
      { color: '#66ff99' },
      { color: '#6666ff' },
      { color: '#6699ff' },
      { color: '#9966ff' },
      { color: '#ffcc66' },
      { color: '#cafedb' },
    ]
  },

  handleItemClick({ detail }) {
    const { index } = detail
    console.log('item: ', this.data.list[index].color)
  },

  change({ detail}) {
    this.data.list = detail.listData
  }
})
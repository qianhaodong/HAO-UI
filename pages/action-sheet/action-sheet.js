Page({
  data: {
    actions1: [
      { name: '选项一' },
      { name: '选项二', color: '#3b9cff' },
      { name: '选项三', loading: true }
    ]
  },

  onLoad(options) {

  },

  show({ currentTarget: { dataset } }) {
    const { id } = dataset

    // 执行组件 show() 方法
    this.selectComponent(`#action-sheet${id}`).show()
  },

  handleItemClick({ detail }) {
    const { index } = detail

    console.log('index: ', index)
  }
})
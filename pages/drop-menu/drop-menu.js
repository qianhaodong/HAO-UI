Page({
  data: {
    dropList: [
      { name: '菜单1' },
      { name: '菜单2' },
      { name: '菜单3' },
      { name: '菜单4' },
      { name: '菜单5' },
      { name: '菜单6' },
      { name: '菜单7' },
      { name: '菜单8' },
      { name: '菜单9' },
      { name: '菜单10' }
    ]
  },

  handleItemClick({ detail }) {
    console.log('index: ', detail.index)
  }
})
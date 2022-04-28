Page({
  data: {
    list: [
      {
        id: 1,
        name: '常用组件',
        icon: '/assets/images/icon1.png',
        comps: [
          {
            name: '日期筛选',
            page: '/pages/picker-date/picker-date'
          },
          {
            name: '自定义导航栏',
            page: '/pages/custom-nav/custom-nav'
          },
          {
            name: '图片上传',
            page: '/pages/upload-img/upload-img'
          }
        ]
      },
      {
        id: 2,
        name: '操作反馈',
        icon: '/assets/images/icon2.png',
        comps: [
          {
            name: 'Action-Sheet',
            page: '/pages/action-sheet/action-sheet'
          },
          {
            name: '下拉菜单',
            page: '/pages/drop-menu/drop-menu'
          },
          {
            name: 'Dialog',
            page: '/pages/dialog/dialog'
          }
        ]
      },
      {
        id: 3,
        name: '拖拽',
        icon: '/assets/images/icon3.png',
        comps: [
          {
            name: '拖拽',
            page: '/pages/drag/drag'
          },
          {
            name: '拖拽排序',
            page: '/pages/drag-sort/drag-sort'
          }
        ]
      },
      {
        id: 4,
        name: '多选列表',
        icon: '/assets/images/icon4.png',
        comps: [
          {
            name: '多选列表',
            page: '/pages/multiple-list/multiple-list'
          },
          {
            name: '多选删除列表',
            page: '/pages/del-multiple-list/del-multiple-list'
          },
          /* {
            name: '长列表渲染',
            page: '/pages/long-list/long-list'
          } */
        ]
      },
      {
        id: 5,
        name: '其它组件',
        icon: '/assets/images/icon5.png',
        comps: [
          {
            name: '小球动画',
            page: '/pages/ball-animation/ball-animation'
          },
          {
            name: '商品购物车示例',
            page: '/pages/cart/cart'
          },
          {
            name: '手写签名',
            page: '/pages/sign-canvas/index'
          }
        ]
      }
    ]
  },

  onLoad(options) {
    const { list } = this.data

    list.forEach(item => {
      item.open = false
    })

    this.setData({ list })
  },

  handleItemClick({ currentTarget: { dataset } }) {
    const { index } = dataset
    const { list } = this.data

    list.forEach((item, cIndex) => {
      if (index == cIndex) {
        item.open = !item.open
      } else {
        item.open = false
      }
    })

    this.setData({ list })
  }
})
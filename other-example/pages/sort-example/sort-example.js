const { mockData } = require('../../../assets/js/data.js')

Component({
  options: {
    // 匹配纯数据字段
    pureDataPattern: /^__/
  },

  data: {
    categroyMenu: [],
    categroyMenuIndex: 0, // 分类菜单索引
    goodsList: [], // 商品列表
    scrollViewTop: 0, // scroll-view 组件垂直滚动距离
    pageScrollTop: 0, // 初始化当前页面 scroll-view 组件顶部距离

    /* 纯数据字段 */
    __foodsTypeId: 0, // 商品分类 Id（如果为 0，则默认获取第一个分类下的商品）
    __sorted: false, // 是否排序过
    __sortedList: [], // 有排序操作过的列表
  },

  methods: {
    onLoad(options) {
      this._getAllFoods()
    },

    // 分类菜单切换
    categroyMenuTap({ currentTarget: { dataset } }) {
      const { index, foodsTypeId: __foodsTypeId } = dataset

      // 点击当前状态，不执行操作
      if (this.data.categroyMenuIndex === index) return
      
      this.setData({
        __foodsTypeId,
        goodsList: [],
        categroyMenuIndex: index,
        navScrollTop: (index - 1) * 48,
        scrollViewTop: 0,
        pageScrollTop: 0
      })

      wx.nextTick(() => { this._getAllFoods() })
    },

    // 排序内容组件 scroll-view 滚动事件
    sortContentScroll(e) {
      this.setData({
        scrollViewTop: e.detail.scrollTop
      })
    },

    // 销量排序
    handleSalesSort() {
      const { goodsList } = this.data

      // 从大到小排序
      goodsList.sort((a, b) => b['salesVolumeInMonth'] - a['salesVolumeInMonth'])

      this.setData({
        goodsList,
        scrollViewTop: 0,
        pageScrollTop: 0
      }, () => {
        wx.showToast({
          title: '此分类商品已按销量排序',
          icon: 'none',
          duration: 2000
        })
      })
      this._handleSortedEvent()
    },
    
    // 置顶排序
    handleTopclick({ currentTarget: { dataset } }) {
      const { index } = dataset
      const { goodsList } = this.data

      // 从原数组中截取该项
      const cItem = goodsList.splice(index, 1)
      // 将该项插入首项
      goodsList.unshift(cItem[0])
      
      this.setData({
        goodsList,
        scrollViewTop: 0,
        pageScrollTop: 0
      })
      this._handleSortedEvent()
    },
    
    change({ detail }) {
      const { listData: goodsList } = detail

      this.data.goodsList = goodsList
      this._handleSortedEvent()
    },

    confirm() {
      // 未排序则直接返回
      if (!this.data.__sorted) {
        wx.navigateBack({ delta: 1})
        return
      }

      // 关闭页面询问对话框
      if (wx.disableAlertBeforeUnload) {
        wx.disableAlertBeforeUnload()
      }
      
      wx.showToast({
        title: '排序成功',
        icon: 'success',
        duration: 1000
      })
      const timer = setTimeout(() => {
        wx.navigateBack({ delta: 1 })
        clearTimeout(timer)
      }, 1000)
    },

    // 获取商品列表
    _getAllFoods() {
      if (mockData.data.code == 0) {
        const { __foodsTypeId } = this.data
        const categroyMenu = mockData.data.foodsTypes.map(item => {
          return {
            ft_id: item.ft_id,
            ft_name: item.ft_name
          }
        })

        let goodsList = []
        if (__foodsTypeId == 0) {
          goodsList = mockData.data.foodsTypes[0].foodsList
        } else {
          goodsList = mockData.data.foodsTypes.find(item => item.ft_id == __foodsTypeId).foodsList
        }

        // 根据排序的顺序处理商品顺序
        const { __sortedList } = this.data
        const cIndex = __sortedList.findIndex(item => item.f_typeid == __foodsTypeId)
        if (cIndex !== -1) {
          const goodIds = __sortedList[cIndex].f_id_list
          let resultList = []
          for(let i = 0; i < goodIds.length; i++) {
            resultList[i] = goodsList.find(item => item.f_id == goodIds[i])
          }
          goodsList = resultList
        }

        goodsList.forEach(item => {
          // 处理商品价格
          const priceList = item.foodsSpecs.map(item => item.fs_price)
          const maxPrice = Math.max(...priceList)
          const minPrice = Math.min(...priceList)
          item.localPrice = maxPrice === minPrice ? maxPrice : `${minPrice}-${maxPrice}`

          // 处理商品库存（提取最少规格库存）
          const stockList = item.foodsSpecs.map(spec => spec.fsActualInventory)
          item.stock = Math.min(...stockList)
        })

        // 提取需要的数据，提高渲染速度
        goodsList = goodsList.map(item => {
          return {
            f_id: item.f_id,
            f_name: item.f_name,
            // 销量
            salesVolumeInMonth: item.salesVolumeInMonth,
            // 库存
            stock: item.stock,
            localPrice: item.localPrice
          }
        })

        this.setData({ categroyMenu, goodsList })
      }
    },

    // 排序逻辑处理
    _handleSortedEvent() {
      const { goodsList, __sortedList, __foodsTypeId } = this.data
      // 获取排序后的商品 Id 列表
      const goodIds = goodsList.map(item => item.f_id)
      
      // 保存当前分类下的排序列表
      // 判断列表中是否存在当前分类
      const index = __sortedList.findIndex(item => item.f_typeid == __foodsTypeId)
      if (index !== -1) {
        __sortedList[index].f_id_list = goodIds
      } else {
        __sortedList.push({
          f_typeid: __foodsTypeId,
          f_id_list: goodIds
        })
      }
      this.setData({ __sortedList })

      // 当排序标识 __sorted 为 false 时，则设置为 true
      !this.data.__sorted && this.setData({ __sorted: true })
    }
  },

  observers: {
    // 判断有排序操作后，则开启对话框
    __sorted(newVal) {
      console.log('sorted')
      if (newVal && wx.enableAlertBeforeUnload) {
        // 开启小程序页面返回询问对话框
        wx.enableAlertBeforeUnload({
          message: '排序未保存，是否确认退出？',
          fail: error => {
            console.error(error)
          }
        })
      }
    }
  }
})
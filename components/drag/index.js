Component({
  behaviors: ['wx://component-export'],
  export() {
    return {
      // 获取组件实例时传出的数据
      list: this.data.list
    }
  },

  options: {
    // 匹配纯数据字段
    pureDataPattern: /^_/,
    multipleSlots: true
  },

  externalClasses: ['drag-class'],

  properties: {
    // 排序列表
    _listData: { 
      type: Array,
      value: []
    },
    // 列数
    columns: {
      type: Number,
      value: 1
    },
    // 顶部高度
    _topHeight: {
      type: Number,
      value: 0
    },
    // 底部高度
    _bottomHeight: {
      type: Number,
      value: 0
    },
    // 页面在垂直方向已滚动的距离
    _pageScrollTop: {
      type: Number,
      value: 0
    }
  },

  data: {
    list: [], // 渲染列表
    dragWrapHeight: 0, // 拖拽容器高度
    curIndex: -1, // 当前激活元素的索引
    curZIndex: -1, // 当前激活的元素索引, 用于控制激活元素 z-index 值
    tranX: 0, // 当前激活元素的 X轴 偏移量
    tranY: 0, // 当前激活元素的 Y轴 偏移量
    dragging: false, // 是否在拖拽中
    overOnePage: false, // 判断排序列表是否超过一屏
    itemTransition: false, // item 变换是否需要过渡动画, 初始化渲染不需要

    /* 纯数据字段 */
    _windowHeight: 0, // 视窗高度
    _realTopHeight: 0, // 计算后顶部高度实际值
    _realBottomHeight: 0, // 计算后底部高度实际值
    _itemDom: { // 每一项 item 的 dom 信息, 由于大小一样所以只存储一个
      width: 0,
      height: 0,
      left: 0,
      top: 0
    },
    _drapWrapDom: { // 整个拖拽区域的 dom 信息
      width: 0,
			height: 0,
			left: 0,
			top: 0
    },
    _startTranX: 0, // 当前激活元素的初始 X轴 偏移量
    _startTranY: 0, // 当前激活元素的初始 Y轴 偏移量
    _preOriginKey: -1, // 前一次排序时候的起始 key 值
  },

  lifetimes: {
    ready() {
      this.init()
    }
  },
  
  methods: {
    handleItemClick({ currentTarget: { dataset } }) {
      const { key: index, fixed = false } = dataset
      // 派发点击事件
      this.triggerEvent('click', { index, fixed })
    },

    handleLongpress(e) {
      // 获取触摸点信息
      const _startTouch = e.changedTouches[0]
      if (!_startTouch) return

      const curIndex = e.currentTarget.dataset.index
      const { list, dragging } = this.data

      // 如果是固定项则返回
      if (list[curIndex].fixed) return

      // 防止多指触发 drag 动作, 如果已经在 drag 中则返回
      if (dragging) return
      this.setData({ dragging: true })

      const { _itemDom, _drapWrapDom, columns } = this.data
      const { pageX: startPageX, pageY: startPageY } = _startTouch
      let _startTranX = 0, _startTranY = 0

      if (columns > 2) {
        // 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
        _startTranX = startPageX - _itemDom.width / 2 - _drapWrapDom.left
      }
      // 计算Y轴初始位移, 使 item 垂直中心移动到点击处
      _startTranY = startPageY - _itemDom.height / 2 - _drapWrapDom.top

      this.setData({
        _startTouch,
        _startTranX,
        _startTranY,
        curIndex,
        curZIndex: curIndex,
        tranX: _startTranX,
        tranY: _startTranY
      })
      // 派发长按事件
      this.triggerEvent('long-press')
    },

    handleTouchmove(e) {
      // 获取触摸点信息
      const currentTouch = e.changedTouches[0]
      if (!currentTouch) return

      if (!this.data.dragging) return

      const {
        _windowHeight,
        _realTopHeight,
        _realBottomHeight,
        _itemDom,
        _startTouch,
        _startTranX,
        _startTranY,
        _preOriginKey,
        columns,
        list,
        overOnePage
      } = this.data
      let {
        pageX: startPageX,
        pageY: startPageY,
        identifier: startTouchId
      } = _startTouch
      let {
        pageX: currentPageX,
        pageY: currentPageY,
        identifier: currentTouchId,
        clientY: currentClientY
      } = currentTouch

      // 如果不是同一个触发点则返回
			if (startTouchId !== currentTouchId) return

      // 通过当前坐标点，初始坐标点，初始偏移量来计算当前偏移量
      let tranX = currentPageX - startPageX + _startTranX
      let tranY = currentPageY - startPageY + _startTranY
      
      // 单列时X轴不做位移
      if (columns == 1) { tranX = 0 }

      this.setData({ tranX, tranY })

			// 判断是否超过一屏幕, 超过则需要判断当前位置动态滚动 page 的位置
      if (overOnePage) {
        if (currentClientY > _windowHeight - (_itemDom.height / 2) - _realBottomHeight) {
          wx.pageScrollTo({
            scrollTop: currentPageY + _itemDom.height - (_windowHeight - _realBottomHeight) ,
            duration: 300
          })
        } else if (currentClientY < (_itemDom.height / 2) + _realTopHeight) {
          wx.pageScrollTo({
            scrollTop: currentPageY - _itemDom.height -_realTopHeight,
            duration: 300
          })
        }
      }

      // 获取 originKey 和 targetKey
      const originKey = e.currentTarget.dataset.key
      const targetKey = this.calculateMoving(tranX, tranY)

      // 如果是固定 item 则 return
      if (list[targetKey].fixed) return

      // 防止拖拽过程中发生乱序问题
			if (originKey == targetKey || _preOriginKey == originKey) return
			this.setData({ _preOriginKey: originKey })

      // 触发重新排序
      this.repaint(originKey, targetKey)
    },

    handleTouchend(e) {
      if (!this.data.dragging) return
      this.clearData()
    },

    /**
     * @method 初始化数据
     */
    init() {
      this.clearData()
      this.setData({ itemTransition: false })
      const { _listData } = this.data
      // 避免获取不到节点信息报错问题
			if (!_listData.length) {
				this.setData({ list: [] })
				return
      }
      // 遍历数据源增加扩展项, 以用作排序使用
			let list = _listData.map((item, index) => {
				return {
          fixed: item.fixed || false,
          // 真实索引
					key: index,
					x: 0,
          y: 0
				}
      })
      this.getPosition(list, false)
      // 确保正确获取 DOM 信息
      wx.nextTick(() => { this.initDom() })
    },

    /**
     * @method 初始化获取DOM信息 
     */
    initDom() {
      const { list, columns, _topHeight, _bottomHeight } = this.data
      // 排序列表行数
      const rows = Math.ceil(list.length / columns)
      const { windowWidth = 375, windowHeight } = wx.getSystemInfoSync()
      // 计算适配比例
      const rpxScale = windowWidth / 375

      this.setData({
        _windowHeight: windowHeight,
        _realTopHeight: _topHeight * rpxScale / 2,
        _realBottomHeight: _bottomHeight * rpxScale / 2
      })

      this.createSelectorQuery().select('.item').boundingClientRect(res => {
        this.setData({
          _itemDom: {
            width: res.width,
            height: res.height,
            left: res.left,
            top: res.top
          },
          dragWrapHeight: rows * res.height
        })
        
        // item 渲染完成后，获取 drag-wrap 元素信息
        this.createSelectorQuery().select('.drag-wrap').boundingClientRect(res => {
          // (列表的底部到页面顶部距离 > 屏幕高度 - 底部固定区域高度) 用该公式来计算是否超过一页
          const overOnePage = res.bottom > windowHeight - this.data._realBottomHeight

          this.setData({
            overOnePage,
            _drapWrapDom: {
              width: res.width,
              height: res.height,
              left: res.left,
              top: res.top + this.data._pageScrollTop
            }
          })
        }).exec()
      }).exec()
    },

    /**
     * @method 计算排序位置信息
     * 
     * @param { Array } list 排序列表
     * @param { Boolean } update 是否更新源数据（初始化时不更新）
     */
    getPosition(list, update = true) {
      const { columns, _listData } = this.data
      
      // 遍历排序列表，更新位置基数
      list.forEach(item => {
        item.x = item.key % columns
        item.y = Math.floor(item.key / columns)
      })
      this.setData({ list })

      if (!update) return

      // 根据排序顺序，更新源数据
      let result = []
      _listData.forEach((item, index) => {
        result[list[index].key] = item
      })
      this.triggerEvent('change', { listData: result })
    },

    /**
     * @method 根据当前的手指偏移量计算目标key
     * 
     * @param { Number } tranX X轴偏移量
     * @param { Number } tranY Y轴偏移量
     */
    calculateMoving(tranX, tranY) {
      const { _itemDom, columns, list } = this.data
      const rows = Math.ceil(list.length / columns) - 1
			let i = Math.round(tranX / _itemDom.width)
			let j = Math.round(tranY / _itemDom.height)

			i = i > (columns - 1) ? (columns - 1) : i
			i = i < 0 ? 0 : i
			j = j < 0 ? 0 : j
			j = j > rows ? rows : j

			let targetKey = i + columns * j
			targetKey = targetKey >= list.length ? list.length - 1 : targetKey

			return targetKey
    },

    /**
     * @method 重新排序
     * 
     * @param { Number } origin
     * @param { Number } target
     */
    repaint(origin, target) {
      let { list } = this.data
      
      // 重排序时添加动画
      this.setData({ itemTransition: true })

      if (origin < target) {
        /* 正序拖动 */
				list = list.map((item) => {
					if (item.fixed) return item
					if (item.key > origin && item.key <= target) {
						item.key = this.l2r(item.key - 1, origin)
					} else if (item.key === origin) {
						item.key = target
					}
					return item
				})
				this.getPosition(list)
      } else if (origin > target) {
        /* 倒序拖动 */
				list = list.map((item) => {
					if (item.fixed) return item
					if (item.key >= target && item.key < origin) {
						item.key = this.r2l(item.key + 1, origin)
					} else if (item.key === origin) {
						item.key = target
					}
					return item
				})
				this.getPosition(list)
			}
    },

    /**
     * @method 正序拖动key值和固定项判断逻辑
     * 
     * @param { Number } key
     * @param { Number } origin
     */
		l2r(key, origin) {
			if (key === origin) return origin
			if (this.data.list[key].fixed) {
				return this.l2r(key - 1, origin)
			} else {
				return key
			}
    },
    
		/**
     * @method 倒序拖动key值和固定项判断逻辑
     * 
     * @param { Number } key
     * @param { Number } origin
     */
		r2l(key, origin) {
			if (key === origin) return origin
			if (this.data.list[key].fixed) {
				return this.r2l(key + 1, origin)
			} else {
				return key
			}
		},

    /**
     * @method 初始化参数
     */
    clearData() {
      this.setData({
        _preOriginKey: -1,
        curIndex: -1,
        tranX: 0,
        tranY: 0,
        dragging: false
      })
      // 元素过渡结束后执行（解决激活元素层级不够问题）
      const timer = setTimeout(() => {
        this.setData({ curZIndex: -1 })
        clearTimeout(timer)
      }, 300)
    }
  },

  observers: {
    /**
     * @method 监听数据变化，重新初始化
     */
    _listData(newVal) {
      this.init()
    }
  }
})

Component({
  options: {
    // 存数据字段配置
    pureDataPattern: /^_/,
    // 多插槽配置
    multipleSlots: true
  },

  // 外部样式类
  externalClasses: ['multiple-list-class'],

  properties: {
    // 列表
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        /* 当 list 更新时，保存之前选中的项 */
        const { _result = [] } = this.data
        
        // 添加选中态
        for (let i = 0; i < newVal.length; i++) {
          if (_result.includes(i)) {
            newVal[i].checked = true
          } else {
            newVal[i].checked = false
          }
        }
        this.setData({ localList: JSON.parse(JSON.stringify(newVal)) })
      }
    },

    // 多选状态标志
    radioShow: {
      type: Boolean,
      value: false,
      observer(newVal) {
        const { localList = [] } = this.data
        if (!newVal && localList.length) {
          // 重置选中列表
          localList.forEach(item => {
            item.checked = false
          })

          this.setData({
            localList,
            checkAllFlag: false,
            multipleNumber: 0,
            _result: []
          })
        }
      }
    },

    // 自定义内容
    custom: {
      type: Boolean,
      value: false
    },

    // 底部操作按钮
    operateBtns: {
      type: Array,
      value: [
        { name: '确定', type: 'confirm' }
      ]
    }
  },

  data: {
    // 本地列表
    localList: [],
    // 全选标识
    checkAllFlag: false,
    // 选中数量
    multipleNumber: 0,
    // 选中结果列表
    _result: []
  },

  lifetimes: {
    attached() {}
  },

  methods: {
    // 单选事件
    selectItemTap({ currentTarget: { dataset } }) {
      const { index } = dataset

      // 更新当前项选中状态
      this.setData({
        [`localList[${index}].checked`]: !this.data.localList[index].checked
      })

      // 检测全选状态
      this._checkSelectAll(this.data.localList)
    },
    
    // 全选事件
    selectAllTap() {
      const { localList, checkAllFlag } = this.data

      localList.forEach(item => {
        if (!checkAllFlag) {
          item.checked = true
        } else {
          item.checked = false
        }
      })

      this.setData({
        localList,
        checkAllFlag: !checkAllFlag
      })
      this._checkSelectAll(localList)
    },

    // 底部按钮事件
    handleBtnClick({ currentTarget: { dataset } }) {
      const { index } = dataset
      const { _result } = this.data

      this.triggerEvent('handle-btn-click', {
        btnIndex: index,
        result: _result
      })
    },
    
    // 检查是否全选和统计选中数量
    _checkSelectAll(list) {
      if (!list.length) return

      // 按顺序获取选中项
      const _result = []
      for(let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          _result.push(i)
        }
      }
      this.setData({
        _result,
        checkAllFlag: list.every(item => item.checked),
        multipleNumber: list.filter(item => item.checked).length
      })
    },
  }
})
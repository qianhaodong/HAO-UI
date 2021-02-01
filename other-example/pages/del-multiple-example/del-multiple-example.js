Page({
  data: {
    radioShow: false,
    operateBtns: [
      { name: '取消', type: 'cancel' },
      { name: '删除', type: 'confirm' }
    ],
    list: [
      { name: '选项1', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项2', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项3', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项4', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项5', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项6', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项7', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项8', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项9', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项10', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项11', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项12', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项13', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项14', desc: '这是一段很长的描述语，很长很长' },
      { name: '选项15', desc: '这是一段很长的描述语，很长很长' },
    ],
    // action-sheet 组件状态
    asVisible: false,
    asActions: [
      {
        name: '删除',
        color: '#ff4247'
      },
      {
        name: '多选删除'
      }
    ]
  },

  handleLongpress({ currentTarget: { dataset } }) {
    const { index } = dataset

    // 当处于多选状态时，禁止此事件
    if (this.data.radioShow) return
    
    // 保存当前项索引（单选删除需要）
    this.setData({ currentIndex: index })
    this.selectComponent('#action-sheet').show()
  },

  handleBtnClick({ detail }) {
    const { btnIndex, result } = detail
    
    if (btnIndex == 0) {
      this.setData({ radioShow: false })
    } else if (btnIndex == 1) {
      let { list } = this.data

      if (!result.length) {
        wx.showToast({
          title: '请选择要删除的项',
          icon: 'none',
          duration: 2000
        })
        return
      }

      wx.showModal({
        title: '温馨提示',
        content: '确定要删除所选项吗？',
        success: res => {
          if (res.confirm) {
            list = list.filter((item, index) => {
              if (result.includes(index)) return false
              return true
            })
            this.setData({ list, radioShow: false })
          }
        }
      })
    }
  },

  // action-sheet 组件事件
  handleItemClick({ detail }) {
    const tapIndex = detail.index

    if (tapIndex === 0) {
      /* 单选删除 */
      wx.showModal({
        title: '温馨提示',
        content: '确定要删除所选项吗？',
        success: res => {
          if (res.confirm) {
            const { currentIndex, list } = this.data
            list.splice(currentIndex, 1)
            this.setData({ list })
          }
        }
      })
    } else if (tapIndex === 1) {
      /* 多选删除 */
      this.setData({ radioShow: true })
    }
  }
})
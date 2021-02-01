Component({
  externalClasses: ['multiple-item-class'],

  properties: {
    item: {
      type: Object,
      value: {}
    },

    radioShow: {
      type: Boolean,
      value: false
    },
    
    custom: {
      type: Boolean,
      value: false
    },
  },

  methods: {
    selectItemTap(e) {
      // 不处于多选状态时，禁止事件
      if (!this.data.radioShow) return
      this.triggerEvent('select-item-tap', !this.data.checked)
    },
  }
})
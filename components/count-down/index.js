Component({
  options: {
    // 匹配纯数据字段
    pureDataPattern: /^_/
  },

  externalClasses: ['cd-class'],
  
  properties: {
    // 结束时间
    _target: {
      type: Number,
      value: 0
    },

    // 时间格式
    _format: {
      type: Array,
      value: []
    },

    // 结束清理
    _clearTimer: {
      type: Boolean,
      value: false
    },

    // 是否显示天
    _showDay: {
      type: Boolean,
      value: false
    }
  },

  data: {
    time: '',
    _localFormat: [],
    _changeFormat: false
  },

  lifetimes: {
    ready() {
      this.getFormat()
    }
  },
  
  methods: {
    init() {
      // 初始化倒计时
      setTimeout(() => { this.getLastTime() }, 1000)
    },

    getFormat() {
      const { _format, _showDay, _localFormat } = this.data
      const len =  _format.length

      if (!_showDay) _localFormat.push('')

      if (len > 3) {
        for (let i = 0; i < len; i++) {
          if (_localFormat.length > 4) break
          if (_format[i]) {
            
          }
        }
      }
    },

    getLastTime() {

    },

    formatTime(time) {
      return time > 9 ? time : `0${time}`
    },

    endFn() {
      this.triggerEvent('callback')
    }
  }
})

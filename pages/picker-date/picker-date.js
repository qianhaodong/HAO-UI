Page({
  data: {
    date: ''
  },

  onLoad(options) {

  },

  chooseDate() {
    this.selectComponent('#picker-date').show()
  },

  pickerDateDone({ detail }) {
    console.log('detail: ', detail)
    this.setData({ date: detail })
  }
})
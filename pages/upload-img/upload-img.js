Component({
  options: {
    pureDataPattern: /^__/
  },

  data: {
    count: 9,
    imgList: [{
      src: "/assets/images/upload-img-icon.png",
      fixed: true
    }],
    pageScrollTop: 0,
    uploadDoneFlag: false, // 图片上传完成标志
    uploadImgStart: false, // 图片开始上传标志

    /* 纯数据字段 */
    __chooseImgFlag: false, // 图片选择标志（true 表示已选择图片；false 表示未选择图片）
  },

  methods: {
    onPageScroll(e) {
      this.setData({ pageScrollTop: e.scrollTop })
    },
  
    // 图片选择结束事件
    chooseImgDone(e) {
      const { imgList } = e.detail
  
      this.setData({
        __chooseImgFlag: imgList.length ? true : false,
      })
    },
  
    // 图片上传完成事件
    uploadImgDone(e) {
      const {
        pathList,
        uploadDone: uploadDoneFlag
      } = e.detail

      console.log('pathList: ', pathList)
      this.setData({
        uploadDoneFlag,
        uploadImgStart: false
      })
    },
  
    submitClick() {
      if (!this.data.__chooseImgFlag) {
        wx.showToast({
          title: '请选择图片上传',
          icon: 'none',
          duration: 2000
        })
        return
      }

      this.setData({ uploadImgStart: true })
    }
  }
})
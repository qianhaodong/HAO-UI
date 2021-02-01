Component({
  options: {
    // 匹配纯数据字段
    pureDataPattern: /^_/
  },
  
  properties: {
    // 图片列表
    imgList: {
      type: Array,
      value: [{
        src: '/assets/images/upload-img-icon.png',
        fixed: true
      }],
      observer(newVal, oldVal) {
        // 修改图片时处理
        const { _count } = this.data
        const _previewImgList = newVal.filter(item => !item.fixed)

        this.setData({
          _previewImgList,
          _localCount: _count - _previewImgList.length
        })
      }
    },
    // 开始上传
    upload: {
      type: Boolean,
      value: false
    },
    // 图片数量
    _count: {
      type: Number,
      value: 9
    },
    // 是否可排序
    _sortable: {
      type: Boolean,
      value: true
    },
    // 页面在垂直方向已滚动的距离
    pageScrollTop: {
      type: Number,
      value: 0
    }
  },

  data: {
    delShow: false, // 删除 icon 是否显示
    progressList: [], // 图片上传进度
    _pathList: [], // 图片路径列表
    _previewImgList: [], // 预览图片列表
    _previewCurrentIndex: 0, // 当前预览图片索引
    _localCount: 9, // 本地未选择图片数量
  },

  lifetimes: {
    attached() {
      this.setData({ _localCount: this.data._count })
    }
  },

  methods: {
    handleItemClick({ detail }) {
      const { index, fixed } = detail

      // 隐藏删除 icon
      this.setData({ delShow: false })
      
      if (fixed) {
        /* 选择图片 */
        this.handleChooseImage()
      } else {
        /* 预览图片 */
        this.handleImagePreview(index)
      }
    },

    handleLongpress() {
      this.setData({ delShow: true })
    },
    
    // 选择图片
    handleChooseImage() {
      let { imgList, _previewImgList, _localCount } = this.data

      wx.chooseImage({
        count: _localCount,
        sizeType: ['compressed'],
        success: res => {
          let resultList = res.tempFilePaths
          // 处理选中图片列表，放入临时数组 tempList 中
          let tempList = resultList.map(image => {
            return {
              src: image,
              fixed: false
            }
          })

          if (_localCount - tempList.length === 0) {
            _localCount = 0
            imgList.splice(imgList.length - 1, 0, ...tempList)
            // 当前图片选择完成后，删除最后一项默认图片
            imgList.pop()
            _previewImgList = [...imgList]
          } else {
            // 更新未选择图片数量
            _localCount -= tempList.length
            // 往最后一项前插入图片
            imgList.splice(imgList.length - 1, 0, ...tempList)
            // 更新预览图片列表（复制一份，防止改变原数组）
            _previewImgList = [...imgList]
            // 删除最后一项默认图片
            _previewImgList.pop()
          }

          this.setData({
            imgList,
            _localCount,
            _previewImgList
          })

          // 派发图片选择结束事件
          this.triggerEvent('choose-img-done', { imgList: _previewImgList })
        }
      })
    },

    // 预览图片
    handleImagePreview(index) {
      let { _previewImgList } = this.data
      
      // 处理预览列表
      _previewImgList = _previewImgList.filter(item => !item.fixed).map(item => item.src)
      if (!_previewImgList.length) return
      
      wx.previewImage({
        urls: _previewImgList,
        current: _previewImgList[index]
      })
    },

    // 排序完成
    change({ detail }) {
      const { listData: imgList } = detail
      // 删除最后一项默认图片
      const _previewImgList = imgList.filter(item => !item.fixed)

      // 更新 imgList 数据，不更新视图
      this.data.imgList = imgList
      this.setData({ _previewImgList })

      // 派发图片选择结束事件
      this.triggerEvent('choose-img-done', { imgList: _previewImgList })
    },

    // 删除图片
    handleDelete({ currentTarget: { dataset } }) {
      const { index } = dataset
      // 获取 drag 组件中的真实渲染列表
      const { list = [] } = this.selectComponent('#drag')
      let { imgList, _localCount } = this.data

      // 删除指定项图片（通过真实索引）
      imgList.splice(list[index].key, 1)

      if (_localCount == 0) {
        // 添加默认图片
        imgList.push({
          src: '/assets/images/upload-img-icon.png',
          fixed: true
        })
      }
      // 每删除一张，则增加一次
      _localCount++

      this.setData({
        imgList,
        _localCount,
        _previewImgList: imgList.filter(item => !item.fixed)
      })

      // 派发图片选择结束事件
      this.triggerEvent('choose-img-done', { imgList: this.data._previewImgList })
    },

    /**
     * @method 上传图片方法
     * 
     * @param { Object } data 上传参数
     * 
     * 说明：该方法中可自定义上传逻辑，以下逻辑仅供参考
     */
    uploadImgData(data) {
      let index = data.index ? data.index : 1

      // 图片上传完成时执行
      if (index === data.path.length + 1) {
        console.log('上传完成！')
        wx.hideLoading()
        data.uploadDone = true
        // 保存上传完成路径列表
        this.setData({ _pathList: data.list })
        // 派发上传完成事件
        this.triggerEvent('upload-img-done', {
          uploadDone: true,
          pathList: this.data._pathList
        })
        return
      }

      // 图片上传进度列表（用来存放每张图片上传的进度%）
      let progressList = this.data.progressList
      
      // 上传图片任务（模拟异步上传操作）
      const uploadTask = new Promise((resolve, reject) => {
        // 模拟异步上传进度
        const timer = setInterval(() => {
          if (typeof progressList[data.index - 1] == 'undefined') {
            progressList[data.index - 1] = 0
          }
          progressList[data.index - 1] += 10
          this.setData({ progressList })
          
          if (progressList[data.index - 1] >= 100) {
            resolve()
            clearInterval(timer)
          }
        }, 100)
      })

      uploadTask
        .then(() => {
          // 记录上传成功后图片路径
          data.list.push(data.path[index - 1].src)
        })
        .finally(() => {
          data.index = ++index
          // 递归上传
          this.uploadImgData(data)
        })
    }
  },

  observers: {
    upload(newVal) {
      const { _previewImgList } = this.data

      // 开始上传
      if (!!newVal && _previewImgList.length) {
        wx.showLoading({
          title: '图片上传中...',
          mask: true
        })
        
        this.uploadImgData({
          // 上传图片接口
          url: '上传接口',
          // 上传图片索引
          index: 1,
          // 图片路径列表
          path: _previewImgList,
          // 图片上传完成状态
          uploadDone: false,
          // 上传成功后的图片路径列表
          list: []
        })
      }
    }
  }
})
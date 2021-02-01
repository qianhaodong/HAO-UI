const windowHeight = wx.getSystemInfoSync().windowHeight

function createBalls() {
  let balls = []
  for (let i = 0; i < 10; i++) {
    balls.push({ show: false })
  }
  return balls
}

Page({
  data: {
    balls: createBalls(),
    _dropBalls: []
  },

  handleAnimate(el) {
    this._drop(el)
  },
  
  ballTransitionend({ currentTarget: { dataset } }) {
    this.data._dropBalls.shift()
    this.setData({
      [`balls[${dataset.index}].show`]: false,
      [`balls[${dataset.index}].ballStyle`]: '',
      [`balls[${dataset.index}].ballInnerStyle`]: ''
    })
  },

  _drop(el) {
    for (let i = 0; i < this.data.balls.length; i++) {
      const ball = this.data.balls[i]
      if (!ball.show) {
        ball.show = true
        ball.el = el
        ball.index = i
        this.data._dropBalls.push(ball)
        this._dropAnimate()
        return
      }
    }
  },

  // 小球动画
  _dropAnimate() {
    // 获取最先加入的小球
    const ball = this.data._dropBalls[this.data._dropBalls.length - 1]
    let x = ball.el.touches[0].clientX - 40
    let y = - (windowHeight - ball.el.touches[0].clientY - 16)
    let ballStyle = `transform: translate3d(0, ${y}px, 0)`
    let ballInnerStyle = `transform: translate3d(${x}px, 0, 0)`
    this.setData({
      [`balls[${ball.index}].ballStyle`]: ballStyle,
      [`balls[${ball.index}].ballInnerStyle`]: ballInnerStyle
    }, () => {
      wx.nextTick(() => {
        this.setData({
          [`balls[${ball.index}].show`]: true
        })
      })
    })
  },
})
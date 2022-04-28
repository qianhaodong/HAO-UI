Page({
    data: {
        signImage: ''
    },

    onLoad() {
        
    },

    onPullDownRefresh() {
        this.setData({ signImage: '' })
        wx.stopPullDownRefresh()
    },

    navToSignPage() {
        wx.navigateTo({
            url: './sign-canvas',
            events: {
                getSignImage: image => {
                    this.setData({
                        signImage: image
                    })
                }
            },
        })
    }
})
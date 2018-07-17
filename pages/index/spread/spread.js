const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.id) {
      var id = options.id
    } else {
      var id = 0
    }

    wx.showLoading({
      title: '加载中',
    })

    var self = this
    wx.login({
      success: function (res) {
        var code = res.code
        wx.request({
          url: app.globalData.api + '/home/index/login',
          data: {
            code: code,
            id: id,
          },
          success: function (res1) {
            wx.hideLoading()
            if (res1.data == 'false') {
              wx.showToast({
                title: '登陆失败',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.setStorage({
                key: "userKey",
                data: res1.data
              })
              if(res1.data.result == '1'){
                wx.showToast({
                  title: '注册成功！',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }, 1500
                )
              } else if (res1.data.result == '2'){
                wx.showToast({
                  title: '您已是几和会员！',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function(){
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  },1500
                )
              }
              
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
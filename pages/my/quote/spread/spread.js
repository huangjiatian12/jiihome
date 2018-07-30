const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toMyQuote(id){
    wx.showModal({
      title: '提示',
      content: '是否添加到我的报价？',
      success:function(res){
        if (res.confirm) {
          wx.getStorage({
            key: 'userKey',
            success: function (res) {
              wx.request({
                url: app.globalData.api + '/Home/index/quoteToUser',
                data: {
                  userId: res.data.id,
                  thr_session: res.data.thr_session,
                  id: id,
                },
                success: function (res1) {
                  if(res1.data){
                    wx.redirectTo({
                      url: '/pages/my/quote/myQuote/myQuoe',
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var quoteId = options.id
    wx.login({
      success: function (res) {
        var code = res.code
        wx.request({
          url: app.globalData.api + '/home/index/login',
          data: {
            code: code,
          },
          success: function (res1) {
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
              self.toMyQuote(quoteId)
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
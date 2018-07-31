const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  backTap:function(){
  wx.redirectTo({
    url: '/pages/my/share/share',
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        var imgPath = app.globalData.api + "/home/index/userPrcode?userId=" + res.data.id + "&thr_session=" + res.data.thr_session;
        console.log(imgPath)
        that.setData({
          userId: res.data.id,
          thrSession: res.data.thr_session,
          imgPath:imgPath
        })
      },
    })
  },
  imgYu(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src
    var urls = []
    urls.push(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
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
    var that = this
    var userId = that.data.userId
    var thrSession = that.data.thrSession
    return {
      title: '几和家居',
      path:'pages/index/spread/spread?id=' + userId,
      imageUrl: app.globalData.api + "/home/index/userPrcode?userId=" + userId + "&thr_session=" + thrSession
    }
  },
})
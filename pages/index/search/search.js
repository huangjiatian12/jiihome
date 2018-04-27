var app;
app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyShow: true,
    historyData: []
  },
  searchSubmit: function (e) {
    var keyword = e.detail.value
    var self = this
    if (keyword != '') {
      wx.request({
        url: app.globalData.api + '/Home/index/goodsSearch',
        data: {
          keyword: keyword
        },
        success: function (res) {
          self.setData({
            goodsData: res.data,
          })
        }
      })
      var historyDa = wx.getStorageSync('historyData')
      if (historyDa == '') {
        historyDa = []
      }
      self.setData({
        historyData: historyDa,
      })
      var historyData = self.data.historyData
      var add = { 'value': keyword }
      historyData.push(add)
      wx.setStorage({
        key: "historyData",
        data: historyData
      })
      self.setData({
        historyShow: false,
      })
    }
  },
  delHistory: function () {
    wx.removeStorageSync('historyData')
    var self = this
    self.setData({
      historyData: '',
    })
  },
  searchAgain: function (event) {
    var keyword = event.target.dataset.value
    var self = this
    wx.request({
      url: app.globalData.api + '/Home/index/goodsSearch',
      data: {
        keyword: keyword
      },
      success: function (res) {
        self.setData({
          goodsData: res.data,
        })
      }
    })
    self.setData({
      historyShow: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var historyData = wx.getStorageSync('historyData')
    var self = this
    self.setData({
      historyData: historyData,
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
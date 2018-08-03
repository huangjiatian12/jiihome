const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navSrollLeft: 0,
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    leftsrc:'/image/right.png',
    rightsrc:'/image/right.png'
  },

  getThemePic(id) {
    var self = this
    wx.request({
      url: app.globalData.api + '/home/index/getCarousel',
      data: {
        themeId: id,
      },
      success: function (res) {
        self.setData({
          themePic: res.data,
        })
      }
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            }
          }
        })
      }
    })

    /**  
     * 获取系统信息  
     */
    wx.getSystemInfo({

      success: function (res) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    wx.request({
      url: app.globalData.api + '/home/index/theme',
      success: function (res) {
        console.log(res.data)
        self.setData({
          themeData: res.data
        })
        self.getThemePic(res.data[0]['id'])
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
     * 滑动切换tab  
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /**  
   * 点击tab切换  
   */
  swichNav: function (e) {

    var that = this;
    var themeData = that.data.themeData
    console.log(e)

    if (this.data.currentTab === e.target.dataset.key) {
      return false;
    } else {
      that.getThemePic(themeData[e.target.dataset.key]['id'])

      that.setData({
        currentTab: e.target.dataset.key
      })
    }
  },

  // 点左箭头向左移动1格

  leftTab: function () {
    var that = this
    var themeData = that.data.themeData
    var currentTab = that.data.currentTab
    if (currentTab > 0 && currentTab < themeData.length) {
      var n = parseInt(currentTab) - 1;
      that.setData({
        currentTab:n
      })
      that.getThemePic(themeData[n]['id'])
    }
  },
// 点右箭头向右移动1格

rightTab: function () {
  var that = this
  var themeData = that.data.themeData
  var currentTab = that.data.currentTab
  console.log(themeData)
  console.log(currentTab)
  console.log(themeData[currentTab])
  if (currentTab >= 0 && currentTab < themeData.length-1) {
    var n = parseInt(currentTab) + 1;
    console.log(n)
    that.setData({
      currentTab: n
    })
    that.getThemePic(themeData[n]['id'])
  }
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
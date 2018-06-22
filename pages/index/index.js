const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500
  },
  getInfo(){
    var self = this

    //获取轮播图
    wx.request({
      url: app.globalData.api + '/Home/index/getCarouselImg',
      success: function (res) {
        self.setData({
          imgUrls: res.data,
        })
      }
    })
    //获取设计文章
    wx.request({
      url: app.globalData.api + '/Home/index/getArticle',
      data: {
        num: 5
      },
      success: function (res) {
        self.setData({
          designData: res.data,
        })
      }
    })

    //获取分类图商品同时加载信息
    wx.request({
      url: app.globalData.api + '/Home/index/getBlockInfo',
      data: {
        block: 1,
        goodsNum: 8
      },
      success: function (res) {
        self.setData({
          catGoods: res.data,
        })
        wx.hideLoading()
      }
    })
    //获取只加载商品大图信息
    wx.request({
      url: app.globalData.api + '/Home/index/getBlockInfo',
      data: {
        block: 3,
        goodsNum: 8
      },
      success: function (res) {
        self.setData({
          bigGoods: res.data,
        })
      }
    })
    //获取只加载商品小图信息
    wx.request({
      url: app.globalData.api + '/Home/index/getBlockInfo',
      data: {
        block: 2,
        goodsNum: 8
      },
      success: function (res) {
        self.setData({
          smallGoods: res.data,
        })
      }
    })
    //获取只加载分类图信息
    wx.request({
      url: app.globalData.api + '/Home/index/getBlockInfo',
      data: {
        block: 4,
        goodsNum: 8
      },
      success: function (res) {
        self.setData({
          onlyCat: res.data,
        })
      }
    })
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
   
    self.getInfo()

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
     var self = this
     self.getInfo()
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
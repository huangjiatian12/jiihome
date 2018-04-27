const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  chooseZong: function () {
    var self = this;
    self.setData({
      choose: 'zong',
    })
    wx.request({
      url: app.globalData.api + '/home/index/getCatGoods',
      data: {
        catId: self.data.catId,
        kind: 'zong'
      },
      success: function (res) {
        self.setData({
          goodsData: res.data,
        })
      }
    })
  },
  chooseNew: function () {
    var self = this;
    self.setData({
      choose: 'new',
    })
    wx.request({
      url: app.globalData.api + '/home/index/getCatGoods',
      data: {
        catId: self.data.catId,
        kind: 'new'
      },
      success: function (res) {
        self.setData({
          goodsData: res.data,
        })
      }
    })
  },
  choosePrice: function () {
    var self = this;
    if (self.data.price == 'up') {
      self.setData({
        choose: 'price',
        price: 'down',
      })
      wx.request({
        url: app.globalData.api + '/home/index/getCatGoods',
        data: {
          catId: self.data.catId,
          kind: 'down'
        },
        success: function (res) {
          self.setData({
            goodsData: res.data,
          })
        }
      })
    } else {
      self.setData({
        choose: 'price',
        price: 'up',
      })
      wx.request({
        url: app.globalData.api + '/home/index/getCatGoods',
        data: {
          catId: self.data.catId,
          kind: 'up'
        },
        success: function (res) {
          self.setData({
            goodsData: res.data,
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var self = this
    var catId = options.catId
    var catName = options.catName
    wx.setNavigationBarTitle({ title: catName })
    //获取柜架商品
    wx.request({
      url: app.globalData.api + '/Home/index/getCatGoods',
      data: {
        catId: catId,
      },
      success: function (res) {
        self.setData({
          goodsData: res.data,
          catId: catId,
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
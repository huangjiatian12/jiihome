const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quote:true
  },
  orderSta(){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/orderState',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (e) {
            self.setData({
              orderSta: e.data
            })
          }
        })
      },
    })
  },
  //判断报价订单是否存在
  checkQuote(){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/checkQuote',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (e) {
            self.setData({
              quote:e.data
            })
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
    var self = this
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.orderSta()
        self.checkQuote()
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
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
        self.orderSta()
        self.checkQuote()
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
    var self = this
    self.onLoad()
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
    
  },
  /*
  *获取用户手机号
  */
  getPhoneNumber: function (e) {
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      wx.getStorage({
        key: 'userKey',
        success: function(res) {
          wx.getLocation({
            type: 'wgs84',
            success: function (res2) {
              var latitude = res2.latitude
              var longitude = res2.longitude
              wx.request({
                url: app.globalData.api + '/Home/index/getPhone',
                data: {
                  userId: res.data.id,
                  thr_session: res.data.thr_session,
                  iv: iv,
                  encryptedData: encryptedData,
                  latitude: latitude,
                  longitude: longitude,
                },
                success: function (res1) {
                  if(!res1.data){
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
                              wx.showToast({
                                title: '请重新点击尝试！',
                                icon: 'none',
                                duration: 2000
                              })
                            }
                          }
                        })
                      }
                    })
                  }else{
                    wx.navigateTo({
                      url: '/pages/my/quote/quote',
                    })
                  }
                }
              })
            }
          })
        },
      })
    }
  } 
})
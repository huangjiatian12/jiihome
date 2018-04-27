var app;
app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0
  },
  changesta(e){
    var sta = e.currentTarget.dataset.sta
    var self = this
    self.setData({
      status:sta,
      orderData:''
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.orderDa(sta)
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
        self.orderDa(sta)
      }
    })
    
  },
  orderDa(sta){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/userOrder',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            status: sta
          },
          success: function (res1) {
            wx.hideLoading()
            console.log(res1.data)
            self.setData({
              orderData: res1.data
            })
          }
        })
      },
    })
  },
  removeOrder(e){
    var orderId = e.target.dataset.order
    var self = this
    var key = e.target.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否取消该订单？',
      success: function (res) {
        wx.checkSession({
          success: function () {
            //session_key 未过期，并且在本生命周期一直有效
            self.removeSure(orderId, key)
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
            self.removeSure(orderId, key)
          }
        })
      }
    })
  },
  removeSure(orderId, key){
    var self = this
    var orderData = self.data.orderData
    var orderDa = []
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/removeOrder',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            orderId: orderId
          },
          success: function (res1) {
            console.log(res1.data)
              if (res1.data == '1') {
                wx.showToast({
                  title: '取消订单成功！',
                  icon: 'success',
                  duration: 1000
                })
                for (var i in orderData) {
                  if (i != key) {
                    orderDa.push(orderData[i])
                  }
                }
                self.setData({
                  orderData: orderDa
                })

              } else if (res1.data == '11') {
                wx.showToast({
                  title: '取消订单成功,退款将退还至您付款账户！',
                  icon: 'none',
                  duration: 1500
                })
                for (var i in orderData) {
                  if (i != key) {
                    orderDa.push(orderData[i])
                  }
                }
                self.setData({
                  orderData: orderDa
                })
              } else if (res1.data == '10') {
                wx.showToast({
                  title: '取消订单失败！',
                  icon: 'none',
                  duration: 1500
                })
              } else if (res1.data == '0') {
                wx.showToast({
                  title: '网络错误！',
                  icon: 'none',
                  duration: 1500
                })
              }
          }
        })
      }
    })
  },
  goPay(e){
    var prepay = e.target.dataset.prepay
    var orderId = e.target.dataset.order
    wx.showLoading({
      title: '跳转中...',
    })
    wx.request({
      url: app.globalData.api + '/Home/index/payOrder',
      data:{
        prepay: prepay
      },
      success:function(res){
        wx.hideLoading()
        wx.requestPayment(
          {
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paysign,
            'success': function (res2) { 
              if (res2.errMsg == 'requestPayment:ok') {
                wx.request({
                  url: app.globalData.api + '/Home/index/comPay',
                  data: {
                    orderId: orderId,
                  },
                  success: function (res3) {
                    if (res3.data == '1') {
                      wx.showLoading({
                        title: '支付成功，跳转中...',
                      })
                      wx.redirectTo({
                        url: '/pages/my/order/order?sta=2',
                      })
                    } else {
                      wx.showToast({
                        title: '网络故障！',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            },
            'fail': function (res1) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1000
              })
              wx.navigateTo({
                url: '/pages/my/order/order?sta=0',
              })
            },
          })
      }
    })
  },
  comOrder(e){
    var orderId = e.target.dataset.order
    var self = this
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.comSure(orderId)
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
        self.comSure(orderId)
      }
    })
  },
  comSure(orderId){
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/comOrder',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            orderId: orderId
          },
          success: function (res1) {
            if (res1.data == '1') {
              wx.showToast({
                title: '确认收货成功',
                icon: 'none',
                duration: 1000
              })
              wx.redirectTo({
                url: '/pages/my/order/order?sta=1',
              })
            } else if (res1.data == '0') {
              wx.showToast({
                title: '网络错误!',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  cancelOrd(){
    wx.showToast({
      title: '联系客服退货！',
      icon: 'none',
      duration: 1000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sta = options.sta
    var self = this
    self.setData({
      status: sta
    })
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.orderDa(sta)
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
        self.orderDa(sta)
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
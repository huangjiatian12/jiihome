var app;
app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput:true,
    maxDeduction:'',
    integration:0,
    mes:''
  },
  changeMes:function(e){
    var self = this
    var mes = e.detail.value
    mes = mes.replace(/\s+/g, '')
    self.setData({
      mes:mes
    })
  },
  changeIntegration(e){
     var that = this
     var integration = e.detail.value
     var maxDeduction = that.data.maxDeduction
     var totalPrice = that.data.totalPrice
     if (integration > maxDeduction){
       wx.showToast({
         title: '输入数超过最大可用积分！',
         icon: 'none',
         duration: 1000
       })
     } else if (integration > 0){
       var deductionPrice = totalPrice-integration/10
       that.setData({
         integration:integration,
         deductionPrice: deductionPrice,
       })
     }else{
       var deductionPrice = totalPrice
       that.setData({
         integration: 0,
         deductionPrice: deductionPrice,
       })
     }
  },
  goPay(){
    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    var mes = self.data.mes
    if (self.data.address){
      var address = self.data.address.name + ',' + self.data.address.mobile + ',' + self.data.address.city + self.data.address.address
    }else{
      var address = ''
    }
    var goods = self.data.cartData
    if (mes.length < 50){
      if (address){
        wx.checkSession({
          success: function () {
            //session_key 未过期，并且在本生命周期一直有效
            self.goPaySure(mes, address, goods)
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
            self.goPaySure(mes, address, goods)
          }
        }) 
      }else{
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1000
        })
      }
    }else{
      wx.showToast({
        title: '留言不要超过50个字符',
        icon: 'none',
        duration: 1000
      })
    }
  },
  goPaySure(mes, address, goods){
    var that = this
    var integration = that.data.integration
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/addOrder',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            mes: mes,
            address: address,
            goods: goods,
            integration:integration,
          },
          success: function (res1) {
             if (res1.data.flag == '11') {
               wx.hideLoading()
               wx.requestPayment(
                 {
                   'timeStamp': res1.data.payData.timeStamp,
                   'nonceStr': res1.data.payData.nonceStr,
                   'package': res1.data.payData.package,
                   'signType': 'MD5',
                   'paySign': res1.data.payData.paysign,
                   'success': function (res2) {
                     console.log(res2.data)
                     if (res2.errMsg == 'requestPayment:ok') {
                       wx.request({
                         url: app.globalData.api + '/Home/index/comPay',
                         data: {
                           orderId: res1.data.orderId,
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
                   'fail': function (res2) {
                     wx.showToast({
                       title: '支付失败',
                       icon: 'none',
                       duration: 1000
                     })
                     setTimeout(function () {
                       wx.redirectTo({
                         url: '/pages/my/order/order?sta=0',
                       })},1000)
                     },
                 })
             } else if (res1.data.flag == '10'){
               wx.showToast({
                 title: res1.data.mes,
                 icon: 'none',
                 duration: 1000
               })
             } else if (res1.data.flag == '0') {
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
  /*使用积分弹出框*/
  modalTap:function(){
    this.setData({
      hiddenmodalput:!this.data.hiddenmodalput
    })
  },
  cancel:function(){
     this.setData({
       hiddenmodalput:true
     });
  },
  confirm:function(){
    this.setData({
      hiddenmodalput:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var totalPrice = app.globalData.totalPrice
    var cartData = app.globalData.cartData
    
    self.setData({
      cartData: cartData,
      totalPrice: totalPrice,
      deductionPrice: totalPrice,
    })

    var maxDeduction = 0
    for(var i in cartData){
      maxDeduction = maxDeduction + parseInt(cartData[i]['deduction'])
    }
    console.log(maxDeduction)
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/addressDef',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (res1) {
            if (res1.data.flag == '1') {
              if (res1.data.address[0]) {
                self.setData({
                  address: res1.data.address[0]
                })
              }
            }
          }
        });
        wx.request({
          url: app.globalData.api + '/Home/index/integration',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (res2) {
            if(res2.data.integration < maxDeduction){
              maxDeduction = res2.data.integration
            }

            self.setData({
              maxDeduction: maxDeduction
            })
          }
        })
      },
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
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
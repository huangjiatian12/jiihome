const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: true,
    totalPrice: 0,
    chooseAll: false
  },
  listCart() {
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/listCart',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (res1) {
            if (res1.data.flag == '1'){
              self.setData({
                cartData: res1.data.cartData,
                totalPrice: 0,
                chooseAll: false
              })
            }else if(res1.data.flag == '0') {
              wx.showToast({
                title: '网络状态错误！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  delGoods(e){
    var attrId = e.target.dataset.attrid
    var goodsId = e.target.dataset.goodsid
    var key = e.target.dataset.key
    var goodsName = e.target.dataset.goodsname
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认删除"'+goodsName+'"吗？',
      success: function (res) {
        if (res.confirm) {
          wx.checkSession({
            success: function () {
              //session_key 未过期，并且在本生命周期一直有效
              self.delSure(attrId, goodsId, key)
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
              self.delSure(attrId, goodsId, key)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delSure(attrId, goodsId, key){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/delCart',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            attrId: attrId,
            goodsId: goodsId,
          },
          success: function (res1) {
            if (res1.data == '1') {
              var cartData = self.data.cartData
              cartData.splice(key, 1)
              self.setData({
                cartData: cartData
              })
              wx.showToast({
                title: '删除成功!',
                icon: 'success',
                duration: 2000
              })
            } else if (res1.data == '00') {
              wx.showToast({
                title: '网络状态错误！',
                icon: 'none',
                duration: 2000
              })
            } else if (res1.data == '0') {
              wx.showToast({
                title: '删除失败！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  totalPrice() {
    var self = this
    var totalPrice = 0
    var cartData = self.data.cartData
    for (var i in cartData) {
      if (cartData[i].choose) {
        totalPrice = totalPrice + (cartData[i].goods_price * cartData[i].cart_number)
      }
    }
    self.setData({
      totalPrice: totalPrice
    })
  },
  chooseGoods: function (e) {
    var self = this
    var cartData = self.data.cartData
    var key = e.target.dataset.index
    if (cartData[key].choose) {
      cartData[key].choose = false
      self.setData({
        chooseAll: false
      })
    } else {
      cartData[key].choose = true
    }
    self.setData({
      cartData: cartData
    })
    self.totalPrice()
  },
  chooseAll() {
    var self = this
    var chooseAll = !self.data.chooseAll
    var cartData = self.data.cartData
    for (var i in cartData) {
      cartData[i].choose = chooseAll
    }
    self.setData({
      chooseAll: chooseAll,
      cartData: cartData
    })
    self.totalPrice()
  },
  addNum: function (e) {
    var key = e.target.dataset.index
    var self = this
    var cartData = self.data.cartData
    cartData[key].cart_number = parseInt(cartData[key].cart_number) + 1
    self.setData({
      cartData: cartData
    })
    self.totalPrice()
  },
  minusNum: function (e) {
    var key = e.target.dataset.index
    var self = this
    var cartData = self.data.cartData
    cartData[key].cart_number = parseInt(cartData[key].cart_number) - 1
    self.setData({
      cartData: cartData
    })
    self.totalPrice()
  },
  goBalance() {
    var self = this
    var cartData = self.data.cartData
    var cartDa = []
    for (var i in cartData) {
      if (cartData[i].choose) {
        cartDa.push(cartData[i])
      }
    }
    if (cartDa[0]) {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.cartData = cartDa
      app.globalData.totalPrice = self.data.totalPrice
      wx.navigateTo({
        url: '/pages/cart/balance/balance'
      })
      wx.hideLoading()
    }else{
      wx.showToast({
        title: '请选择商品！',
        icon: 'none',
        duration: 1000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.listCart()
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
        self.listCart()
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
     var self = this 
     self.onLoad()
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
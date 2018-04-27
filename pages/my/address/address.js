const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  addresList(){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
          wx.request({
            url: app.globalData.api + '/Home/index/addressList',
            data: {
              userId: res.data.id,
              thr_session: res.data.thr_session,
            },
            success:function(res1){
                if(res1.data.flag == '1'){
                  self.setData({
                    addressData:res1.data.addressData
                  })
                }else if(res1.data.flag == '0'){
                  wx.showToast({
                    title: '网络状况错误！',
                    icon: 'none',
                    duration: 1500
                  })
                }
            }
          })
        }
    })
  },
  chooseDefault(e) {
    var self = this
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.index
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.chooseSure(id, key)
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
        self.chooseSure(id, key)
      }
    })
  },
  chooseSure(id, key){
    var self = this
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/editDefault',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            id: id
          },
          success: function (res1) {
            if (res1.data == '11') {
              wx.showToast({
                title: '修改成功！',
                icon: 'success',
                duration: 1000
              })
              self.onLoad()
              
            } else if (res1.data == '10') {
              wx.showToast({
                title: '设置失败',
                icon: 'none',
                duration: 1000
              })
            } else if (res1.data == '0') {
              wx.showToast({
                title: '网络状况错误！',
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        self.addresList()
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
        self.addresList()
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
  
  }
})
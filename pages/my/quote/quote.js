const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.request({
      url: app.globalData.api + '/Home/index/chooseFurniture',
      success: function (res) {
        self.setData({
          furData:res.data
        })
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
  
  },
  /*
  *获取用户手机号
  */
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      
    } else {
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          wx.getStorage({
            key: 'userKey',
            success: function(res) {
              wx.request({
                url: app.globalData.api + '/home/index/getPhone',
                data: {
                  iv: e.detail.iv,
                  userId: res.data.id,
                  thr_session: res.data.thr_session,
                  iencryptedDatav: e.detail.encryptedData,
                },
                success: function (res1) {

                }
              })
            },
          })
          
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      })
    }
  } 
})
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { 'hidden': true },
    ], 
    selectPerson: true,
    selectArea: false,
    quote: true,
  },
  orderSta() {
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
  checkQuote() {
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
              quote: e.data
            })
          }
        })
      },
    })
  },
  hiddenBtn: function (e) {
    var that = this;
    // 获取事件绑定的当前组件
    var index = e.currentTarget.dataset.index;
    // 获取list中hidden的值
    // 隐藏或显示内容
    this.setData({
      show: !this.data.show
    });
    that.data.list[index].hidden = !that.data.list[index].hidden;
    that.setData({
      list: that.data.list
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
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/userInfo',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
          },
          success: function (res1) {
            self.setData({
              integration:res1.data.integration,
              integrationRecord: res1.data.integrationRecord,
              todaySum: res1.data.todaySum
            })
          }
        })
      },
    })
  },   
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
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

})
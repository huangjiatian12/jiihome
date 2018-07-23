const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navScrollLeft: 0,
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    tabList: ['全部', '户型', '风格'],
    current: 0,//当前选中的Tab项
    currentTab:0,
  },
  contentChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  getArticle(id){
    var that = this
    wx.request({
      url: app.globalData.api + '/home/index/getArticle',
      data:{
        cateId:id
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          articleData:res.data
        })
      }
    })
  },
  /**
   * Tab的点击切换事件
   */
  switchNav: function (e) {
    var that = this
    var tabList = that.data.tabList
    that.getArticle(tabList[e.currentTarget.dataset.pos]['child'][0]['id'])

    that.setData({
      current: e.currentTarget.dataset.pos,
      currentTab: tabList[e.currentTarget.dataset.pos]['child'][0]['id']
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  switchSon: function (e) {

    var that = this;
    var tabList = that.data.tabList
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.getArticle(e.target.dataset.current)
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.request({
      url: app.globalData.api + '/home/index/getArticleCate',
      success: function (res) {
        that.getArticle(res.data[0]['child'][0]['id'])
        that.setData({
          tabList:res.data,
          currentTab: res.data[0]['child'][0]['id']
        })
      }
    })
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
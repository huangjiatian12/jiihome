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
  onLoad: function () {

  },
  /**
   * Tab的点击切换事件
   */
  switchNav: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  switchSon: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
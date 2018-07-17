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
    tabList: ['全部', '风格', '风格', '风格', '风格', '风格', '风格'],
    current: 0,//当前选中的Tab项
  },
  contentChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onLoad: function () {

  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
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
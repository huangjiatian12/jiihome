var address = require('../../../../utils/city.js');
var app;
app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    showArea: false,
    defaul: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: ''
  },
  showArea() {
    var self = this
    self.setData({
      showArea: true
    })
  },
  chooseDefault() {
    var self = this
    var defaul = self.data.defaul
    self.setData({
      defaul: !defaul
    })
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    // 如果已经显示，不在执行显示动画
    if (that.data.addressMenuIsShow) {
      return
    }
    // 执行显示动画
    //that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      showArea: false
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    //this.startAddressAnimation(false)
    this.setData({
      showArea: false
    })
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    //that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + that.data.citys[value[1]].name + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      showArea: false
    })
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  changeName: function (e) {
    var self = this
    var name = e.detail.value
    name = name.replace(/\s+/g, '')
    self.setData({
      name: name
    })
  },
  changeMobile: function (e) {
    var self = this
    var mobile = e.detail.value
    self.setData({
      mobile: mobile
    })
  },
  changeAddress: function (e) {
    var self = this
    var address = e.detail.value
    address = address.replace(/\s+/g, '')
    self.setData({
      address: address
    })
  },
  addAddress() {
    var self = this
    var name = self.data.name
    var mobile = self.data.mobile
    var city = self.data.areaInfo
    var address = self.data.address
    var status = self.data.defaul
    if (name) {
      if (name.length < 10) {
        if (city) {
          if (address) {
            if (address.length < 30) {
              var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
              if (myreg.test(mobile)) {
                if (status) {
                  status = 1
                } else {
                  status = 0
                }
                wx.checkSession({
                  success: function () {
                    //session_key 未过期，并且在本生命周期一直有效
                    self.addSure(name, mobile, city, address, status)
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
                    self.addSure(name, mobile, city, address, status)
                  }
                })
              } else {
                wx.showToast({
                  title: '请输入正确的手机号',
                  icon: 'none',
                  duration: 1000
                })
              }
            } else {
              wx.showToast({
                title: '详细地址不能超过30字符',
                icon: 'none',
                duration: 1000
              })
            }
          } else {
            wx.showToast({
              title: '请填写详细地址',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请选择省市区',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '收件人姓名不能超过10个字符',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '收件人不能为空',
        icon: 'none',
        duration: 1000
      })
    }
  },
  addSure(name, mobile, city, address, status){
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/addAddress',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session,
            name: name,
            mobile: mobile,
            city: city,
            address: address,
            status: status,
          },
          success:function(res1){
             if(res1.data == '11'){
               wx.showToast({
                 title: '添加地址成功！',
                 icon: 'success',
                 duration: 1000
               })
               setTimeout(function () { wx.navigateBack({})},1000)
             }else if(res1.data == '10'){
               wx.showToast({
                 title: '添加地址失败！',
                 icon: 'none',
                 duration: 1500
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
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
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
})
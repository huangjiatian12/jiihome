const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1,
    cabinetShow:{},
    doorShow:{},
    froShow:{},
    chooseModule:[],
    chooseAll:{'1':false,'2':false,'3':false},
    totalPrice:{'1':0,'2':0,'3':0}
  },
  imgYu(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src
    var urls = []
    urls.push(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  chooseModule(e){
     console.log(e)
     var that = this
     var cate = e.currentTarget.dataset.cat
     var sort = e.currentTarget.dataset.sort
     var chooseModule = that.data.chooseModule
     
     if(!chooseModule[cate]){
       chooseModule[cate] = []
     }

     if(chooseModule[cate][sort]){
       chooseModule[cate][sort] = false
     }else{
       chooseModule[cate][sort] = true
     }
    
     that.getTotalPrice(cate)

    that.setData({
      chooseModule:chooseModule
    })

  },
  chooseAll(){
    var that = this
    var cate = that.data.status
    var chooseModule = that.data.chooseModule
    var chooseAll = that.data.chooseAll
    if(cate == 1){
       var moduleData = that.data.cabinet
    }else if(cate == 2){
      var moduleData = that.data.door
    }else if(cate == 3){
      var moduleData = that.data.front
    }

    chooseAll[cate] = !chooseAll[cate]
    if (!chooseModule[cate]) {
      chooseModule[cate] = []
    }

    for (var i in moduleData.module) {
      chooseModule[cate][moduleData.module[i]['sort_id']] = chooseAll[cate]
    }

    that.getTotalPrice(cate)

    that.setData({
      chooseModule: chooseModule,
      chooseAll: chooseAll
    })
    
  },
  getTotalPrice(cate){
    var that = this
    var totalPrice = that.data.totalPrice
    var chooseModule = that.data.chooseModule

    if (cate == 1) {
      var moduleData = that.data.cabinet
    } else if (cate == 2) {
      var moduleData = that.data.door
    } else if (cate == 3) {
      var moduleData = that.data.front
    }

    var price = 0
    for (var i in moduleData.module) {
      if (chooseModule[cate][moduleData.module[i]['sort_id']]){
        price = price + moduleData.module[i]['totalModulePrice']
      }
    }

    totalPrice[cate] = price

    that.setData({
      totalPrice: totalPrice
    })
  },
  getCel() {
    var that = this
    var cate = that.data.status
    var chooseModule = that.data.chooseModule

    if (cate == 1) {
      var moduleData = that.data.cabinet
    } else if (cate == 2) {
      var moduleData = that.data.door
    } else if (cate == 3) {
      var moduleData = that.data.front
    }
   
    if (!chooseModule[cate]){
      chooseModule[cate] = []
    }

    var sortData = ''
    for (var i in moduleData.module) {
      if (chooseModule[cate][moduleData.module[i]['sort_id']]) {
        sortData = sortData + moduleData.module[i]['sort_id']+','
      }
    }

    if(sortData != ''){
      wx.getStorage({
        key: 'userKey',
        success: function (res) {
          wx.request({
            url: app.globalData.api + '/Home/index/moduleToCart',
            data: {
              userId: res.data.id,
              thr_session: res.data.thr_session,
              sort: sortData,
              cate: cate
            },
            success: function (res1) {
              if(res.data){
                wx.showToast({
                  title: '加入购物车成功！',
                  icon: 'success',
                  duration: 1000
                })
              }else{
                wx.showToast({
                  title: '加入购物车失败！',
                  icon: 'none',
                  duration: 1000
                })
              }
            
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请选择需要报价！',
        icon: 'none',
        duration: 1000
      })
    }

  },
  changesta(e) {
    var sta = e.currentTarget.dataset.sta
    var self = this
    self.setData({
      status: sta,
    })
  },
  showCabDet(e){
    var self = this
    var sort = e.currentTarget.dataset.sort
    var cabinetShow = self.data.cabinetShow
    cabinetShow[sort] = !cabinetShow[sort]
    self.setData({
       cabinetShow:cabinetShow
    })
  },
  showDoorDet(e) {
    var self = this
    var sort = e.currentTarget.dataset.sort
    var doorShow = self.data.doorShow
    doorShow[sort] = !doorShow[sort]
    self.setData({
      doorShow: doorShow
    })
  },
  showfRODet(e) {
    var self = this
    var sort = e.currentTarget.dataset.sort
    var froShow = self.data.froShow
    froShow[sort] = !froShow[sort]
    self.setData({
      froShow: froShow
    })
  },
  removeModule(e){
    var self = this
    var key = e.currentTarget.dataset.key
    var cat = e.currentTarget.dataset.cat
    wx.showModal({
      title: '提示',
      content: '确认删除此报价吗？',
      success: function (e1) {
        if (e1.confirm) {
          wx.getStorage({
            key: 'userKey',
            success: function (res) {
              wx.request({
                url: app.globalData.api + '/Home/index/delModule',
                data: {
                  userId: res.data.id,
                  thr_session: res.data.thr_session,
                  sort: key + 1,
                  cat: cat
                },
                success: function (res1) {
                  console.log(res1)
                  if (res1.data) {
                    self.onLoad()
                    self.setData({
                      status: cat
                    })
                  } else {
                    wx.showToast({
                      title: '删除失败！',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    if (options){
      self.setData({
        status:options.sta
      })
    }
    wx.getStorage({
      key: 'userKey',
      success: function (res) {
        wx.request({
          url: app.globalData.api + '/Home/index/getModule',
          data: {
            userId: res.data.id,
            thr_session: res.data.thr_session
          },
          success: function (res1) {
            console.log(res1.data)
            self.setData({
              cabinet:res1.data.cabinet,
              door:res1.data.door,
              front:res1.data.front
            })
          }
        })
      }
    })
  },
  totalPrice() {
    var self = this
    var totalPrice = 0
    var cabinetShow = self.data.cabinetShow
    for (var i in cabinetShow) {
      if (cabinetShow[i].choose) {
        totalPrice = totalPrice + (cabinetShow[i].goods_price * cabinetShow[i].cart_number)
      }
    }
    self.setData({
      totalPrice: totalPrice
    })
  },
  chooseGoods: function (e) {
    var self = this
    var Data = self.data.Data
    var key = e.target.dataset.index
    if (Data[key].choose) {
      Data[key].choose = false
      self.setData({
        chooseAll: false
      })
    } else {
      Data[key].choose = true
    }
    self.setData({
      Data: Data
    })
    self.totalPrice()
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
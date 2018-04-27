const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://static.jiihome.com/views/default/skin/default/images/home/banner1.png?',
      'http://static.jiihome.com/views/default/skin/default/images/home/changjingbanner.png?',
      'http://static.jiihome.com/views/default/skin/default/images/home/changjingbanner.png?'
    ],
    indicatorDots: true,
    autoplay: false,
    circular: true,
    currentNum:0,
    duration: 500,
    goodsNum:1,
    share:false,
    mask: false, 
    generate:false,
    chooseDef:false,
  },
  onShare(){
    var self = this
    var share = !self.data.share
    self.setData({
      share:share,
    })
  },
  shareFri(){
    var self = this
    self.setData({
      mask: true,
      generate:true
    })
    wx.showLoading({
      title: '海报生成中...',
    })
    var goodsData = self.data.goodsData
    var goodsPrice = self.data.goodsPrice
    var basicprofile = '/image/icon.png';
    var xcxcode = app.globalData.api + '/home/index/get_prcode?id=' + goodsData.id;
    var imgPath = app.globalData.api + "/home/index/showPrImg?id=" + goodsData.id;
    if(goodsPrice.max_discount_price == '0'){
      if (goodsPrice.min_goods_price != goodsPrice.max_goods_price){
        var price = '￥' + goodsPrice.min_goods_price + '-' + goodsPrice.max_goods_price
      }else{
        var price = '￥' + goodsPrice.max_goods_price
      }
    }else{
      if (goodsPrice.min_discount_price != goodsPrice.max_discount_price) {
        var price = '￥' + goodsPrice.min_discount_price + '-' + goodsPrice.max_discount_price
      } else {
        var price = '￥' + goodsPrice.max_discount_price
      }
    }
    wx.downloadFile({
      url: xcxcode,
      success: function (sres) {
        xcxcode = sres.tempFilePath
        wx.downloadFile({
          url: imgPath,
          success: function (sres1) {
            imgPath = sres1.tempFilePath
            const ctx = wx.createCanvasContext('myCanvas');
            //填充背景  
            ctx.setFillStyle('#cccccc');
            ctx.fillRect(0, 0, 240, 360);
            ctx.setFillStyle('#ffffff');
            ctx.fillRect(1, 1, 238, 358);


            //绘制产品图  
            ctx.drawImage(imgPath, 2, 2, 236, 200);

            //绘制标题  
            ctx.setFontSize(16);
            ctx.setFillStyle('#000000');
            ctx.fillText(goodsData.goods_name, 10, 225);

            //绘制介绍产品  
            ctx.setFontSize(12);
            ctx.setFillStyle('#000000');
            ctx.fillText(price, 10, 250);

            //绘制一条虚线  

            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.setLineWidth(1);
            ctx.setLineDash([2, 4]);
            ctx.moveTo(10, 267);
            ctx.lineTo(230, 267);
            ctx.stroke();

            //绘制几和图标  
            ctx.drawImage(basicprofile, 10, 290, 30, 30);

            //绘制介绍  
            ctx.setFontSize(11);
            ctx.setFillStyle('#aaaaaa');
            ctx.fillText('长按扫码查看详情', 47, 298);
            ctx.fillText('分享自几和定制小程序', 47, 318);
            ctx.drawImage(xcxcode, 165, 275, 60, 60);

            ctx.draw();
            wx.hideLoading()
          },
          fail: function (fres) { }
        })
      },
      fail: function (fres) {

      }
    })
  },
  savetup: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 240,
      height: 360,
      canvasId: 'myCanvas',
      fileType: 'jpg',
      success: function (res) {
        //调取小程序当中获取图片  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，去发圈噻~',
              showCancel: false,
              confirmText: '好哒',
              confirmColor: '#72B9C3',
              success: function (res1) {
                if (res1.confirm) {
                  that.setData({
                    share: false,
                    mask: false,
                    generate: false
                  })
                }
              }
            })
          }
        })
      },
      fail: function (res) {
      }
    })
  },
  closeAll() {
    var self = this
    self.setData({
      share: false,
      mask: false,
      generate: false
    })
  },
  chooseAttr: function (event) {
    var id = event.target.dataset.id
    var attr = event.target.dataset.attr
    var tag = event.target.dataset.tag
    var self = this
    var chooseData = ''
    var attrColData = self.data.attrColData
    var attrNouniData = self.data.attrNouniData
    var goodsPic = self.data.goodsPicbeta
    var goodsNum = self.data.goodsNum
    if(tag == '2'){
      if (attrNouniData[attr][0].attr == id){
        for (var i in attrNouniData[attr]) {
          attrNouniData[attr][i]['attr'] = ''
        }
      }else{
        for (var i in attrNouniData[attr]) {
          attrNouniData[attr][i]['attr'] = id
        }
      }
      self.setData({
        attrNouniData: attrNouniData,
      })
    }else if(tag == '3'){
      if (attrColData[attr][0].attr == id) {
        for (var i in attrColData[attr]) {
          attrColData[attr][i]['attr'] = ''
        }
      } else {
        for (var i in attrColData[attr]) {
          attrColData[attr][i]['attr'] = id
        }
      }
      self.setData({
        attrColData: attrColData,
      })
    } else if (tag == '1'){
      var chooseDef = !self.data.chooseDef
      if(chooseDef){
        chooseData = '0'
      }
      self.setData({
        chooseDef: chooseDef
      })
    }

    for (var k in attrNouniData) {
      if (attrNouniData[k][0].attr != '') {
        chooseData = chooseData + ',' + attrNouniData[k][0].attr
      }
    }

    for (var k in attrColData) {
      if (attrColData[k][0].attr != '') {
        chooseData = chooseData + ',' + attrColData[k][0].attr
      }
    }
    wx.request({
      url: app.globalData.api + '/home/index/changeAttr',
      data: {
        goodsId: self.data.goodsData.id,
        goodsAttrId: chooseData,
      },
      success: function (res) {
        self.setData({
          attrColData: res.data.attrColData,
          attrNouniData: res.data.attrNouniData,
        })
        if(res.data.gnData != ''){
          var img = [{'img_src':res.data.gnData.img_src}]
          for (var i in goodsPic) {
            img.push(goodsPic[i])
          }
          self.setData({
            currentNum: 0,
            goodsPic:img,
            price: res.data.gnData,
          })
          if (goodsNum > parseInt(res.data.gnData.goods_number)) {
            self.setData({
              goodsNum: 1,
            })
          }
        }else{
           self.setData({
             price:'',
           })
        }
      }
    })
    
  },
  addNum() {
    var self = this
    var goodsNum = self.data.goodsNum
    var maxNum = self.data.price
    if (maxNum && (goodsNum < maxNum.goods_number)) {
      self.setData({
        goodsNum: ++goodsNum,
      })
    }
    if(!maxNum){
      self.setData({
        goodsNum: ++goodsNum,
      })
    }
  },
  minusNum() {
    var self = this
    var goodsNum = self.data.goodsNum

    if (goodsNum > 1) {
      self.setData({
        goodsNum: --goodsNum,
      })
    }
  },
  addCart(){
     var self = this
     var gnData = self.data.price
     var goodsId = self.data.goodsData.id
     var goodsNum = self.data.goodsNum
     var attrId = self.data.gnData.goods_attr_id
     if (gnData){
        wx.checkSession({
         success: function () {
           //session_key 未过期，并且在本生命周期一直有效
           self.addSure()
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
         self.addSure()
         }
        })  
     }else{
       wx.showToast({
         title: '请选择合适的规格',
         icon: 'none',
         duration: 2000
       })
     }
  },
  addSure(){
    var self = this
    var goodsId = self.data.goodsData.id
    var goodsNum = self.data.goodsNum
    if (self.data.gnData.goods_attr_id != '0'){
      var attrId = self.data.price.goods_attr_id
    }else{
      var attrId = self.data.gnData.goods_attr_id
    }
    wx.getStorage({
      key: 'userKey',
      success: function(res) {
        wx.request({
          url: app.globalData.api + '/Home/index/addCart',
          data: {
            userId: res.data.id,
            thr_session:res.data.thr_session,
            attrId: attrId,
            goodsId: goodsId,
            goodsNum: goodsNum
          },
          success:function(res1){
            if(res1.data.flag == '11'){
              wx.showToast({
                title: '添加购物车成功',
                icon: 'success',
                duration: 2000
              })
            } else if (res1.data.flag == '10'){
              wx.showToast({
                title: '添加购物车失败！',
                icon: 'none',
                duration: 2000
              })
            } else if (res1.data.flag == '20') {
              wx.showToast({
                title: '购物车已存在该商品！',
                icon: 'none',
                duration: 2000
              })
            } else if (res1.data.flag == '00') {
              wx.showToast({
                title: '商品库存不足！',
                icon: 'none',
                duration: 2000
              })
            } else if (res1.data.flag == '0') {
              wx.showToast({
                title: '网络连接状态错误！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    //获取商品详情
    wx.request({
      url: app.globalData.api + '/Home/index/getGoodsDetail',
      data: {
        id: options.goodsId
      },
      success: function (res) {
        console.log(res.data.gnData)
        console.log(res.data.goodsPrice)
        wx.setNavigationBarTitle({ title: res.data.goodsData.goods_name })
        self.setData({
          gnData: res.data.gnData,
          goodsData:res.data.goodsData,
          goodsPrice: res.data.goodsPrice,
          goodsPic: res.data.goodsPic,
          goodsPicbeta: res.data.goodsPic,
          goodsDesc: res.data.goodsdescData,
          attrUniData: res.data.attrUniData,
          attrNouniData: res.data.attrNouniData,
          attrColData: res.data.attrColData,
        })
        wx.hideLoading()
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
    var self = this
    var title = self.data.goodsData.goods_name
    var url = self.data.goodsPic[0].img_src
    return {
      title: title,
      imageUrl: url,
    }
  }
})
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:false,
    mask:false,
    generate:false,
    load:true
  },
  share(){
     var self = this 
     self.setData({
       share:true,
       mask:true
     })
  },
  closeShare(){
    var self = this
    self.setData({
      share: false,
      mask:false
    })
  },
  geneImg(){
    var self = this
    self.setData({
      share: false,
      generate: true
    })
    wx.showLoading({
      title: '海报生成中...',
    })
    var artBrief = self.data.artBrief

    var basicprofile = '/image/finger.png';
    var xcxcode = app.globalData.api + '/home/index/get_artcode?artId=' + artBrief.id;
    var imgPath = app.globalData.api + "/home/index/showArtImg?artId=" + artBrief.id;
    
    if (artBrief.article_brief.length > 18){
     var brief = artBrief.article_brief.substring(0, 15)+'...' 
    }else{
      var brief = artBrief.article_brief
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
            ctx.fillRect(0, 0, 240, 350);
            ctx.setFillStyle('#ffffff');
            ctx.fillRect(1, 1, 238, 348);
            ctx.setFillStyle('#ccc');
            ctx.fillRect(10, 20, 1, 20);

            //绘制分类  
            ctx.setFontSize(14);
            ctx.setFillStyle('#000000');
            ctx.fillText('设计', 15, 35);
           
            //绘制标题  
            ctx.setFontSize(10);
            ctx.setFillStyle('#000000');
            ctx.fillText(artBrief.article_name, 10, 90);

            //绘制产品图  
            ctx.drawImage(imgPath, 10, 100, 220, 128);

            //绘制二维码
            ctx.drawImage(xcxcode, 90, 258, 60, 60);

            //ctx.drawImage(basicprofile, 100, 333, 10, 10); 
            ctx.setFontSize(8)
            ctx.fillText('长按扫码查看', 97, 333);
            //绘制介绍  
/*  
            ctx.setFontSize(11);
            ctx.setFillStyle('#aaaaaa');
            ctx.fillText('长按扫码查看详情', 47, 298);
            ctx.fillText('分享自几和定制小程序', 47, 318);
            ctx.drawImage(xcxcode, 165, 275, 60, 60);
            */
            ctx.draw();   
            wx.hideLoading()
          },
          fail: function (fres) {}
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
      height: 350,
      canvasId: 'myCanvas',
      fileType:'jpg',
      success: function (res) {
        //调取小程序当中获取图片  
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '存图成功!',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              that.setData({
                share: false,
                mask: false,
                generate: false
              })
            }, 1000)
          }
        })
      },
      fail: function (res) {
      }
    })
  },
  closeAll(){
     var self = this
     self.setData({
       share: false,
       mask: false,
       generate: false
     })
  },
  imgYu(e){
    var self = this
    var articleData = self.data.articleData
    var src = e.currentTarget.dataset.src
    var urls = []
    for (var i in articleData){
      urls.push(articleData[i].img_src)
    }

    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({
        title: '加载中',
      })
      var self = this
      var artId = options.artId
      //获取设计文章
      wx.request({
        url: app.globalData.api + '/Home/index/getOneArt',
        data: {
          artId: artId
        },
        success: function (res) {
          wx.setNavigationBarTitle({ title: res.data.article_name })
          self.setData({
            artBrief:res.data
          })
        }
      })      
      //获取设计文章
      wx.request({
        url: app.globalData.api + '/Home/index/getArtiDesc',
        data:{
          artId:artId
        },
        success: function (res) {
          self.setData({
            goodsData:res.data.goodsData,
            articleData: res.data.artDescData,
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
    var artBrief = self.data.artBrief
    return {
      title: artBrief.article_name,
      imageUrl: artBrief.img_src,
    }
  }
})
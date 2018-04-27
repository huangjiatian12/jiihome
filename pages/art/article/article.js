const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:false,
    mask:false,
    generate:false
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

    var basicprofile = '/image/icon.png';
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
            ctx.fillRect(0, 0, 240, 360);
            ctx.setFillStyle('#ffffff');
            ctx.fillRect(1, 1, 238, 358);


            //绘制产品图  
            ctx.drawImage(imgPath, 2, 2, 236, 200);

            //绘制标题  
            ctx.setFontSize(16);
            ctx.setFillStyle('#000000');
            ctx.fillText(artBrief.article_name, 10, 225);

            //绘制介绍产品  
            ctx.setFontSize(12);
            ctx.setFillStyle('#6F6F6F');
            ctx.fillText(brief, 10, 250);

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
      height: 360,
      canvasId: 'myCanvas',
      fileType:'jpg',
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
  closeAll(){
     var self = this
     self.setData({
       share: false,
       mask: false,
       generate: false
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
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseData:{},
    chooseVal:{},
    addHide:{},
    minusShow:{},
    goodsImg:{},
    goodsAttrArr:{},
    chooseGoods:{},
    parData:{},
    extData:{},
    para:{},
    chooseCh:{},
    showGoods:false,
  },
  minusAttr(e){
    var self = this
    var attrName = e.currentTarget.dataset.index
    var chooseData = self.data.chooseData
    var attribute = self.data.attribute
    var chooseVal = self.data.chooseVal
    var addHide = self.data.addHide
    var minusShow = self.data.minusShow
    var num = attribute[attrName][2].length
    var nowVal = chooseData[attrName] - 1

    minusShow[attrName] = true
    if(nowVal == 0){
      minusShow[attrName] = false
    }
    
    addHide[attrName] = false
    chooseData[attrName] = nowVal
    chooseVal[attrName] = attribute[attrName][2][nowVal]
    self.setData({
      chooseData: chooseData,
      chooseVal: chooseVal,
      addHide: addHide,
      minusShow: minusShow
    })
    self.checkAttr()
  },
  addAttr(e){
    var self = this
    var attrName = e.currentTarget.dataset.index
    var chooseData = self.data.chooseData
    var attribute = self.data.attribute
    var chooseVal = self.data.chooseVal
    var addHide = self.data.addHide
    var minusShow = self.data.minusShow
    var num = attribute[attrName][2].length

    if (chooseData[attrName] != undefined){
      var nowVal = chooseData[attrName] + 1
      if (num > nowVal+1){
        addHide[attrName] = false
      }else{
        addHide[attrName] = true
      }
      minusShow[attrName] = true
      chooseData[attrName] = nowVal
      chooseVal[attrName] = attribute[attrName][2][nowVal]
      self.setData({
        chooseData: chooseData,
        chooseVal: chooseVal,
        addHide: addHide,
        minusShow: minusShow
      })
    }else{
       if(num > 1){
         
         if(num > 2){
           addHide[attrName] = false
         }else{
           addHide[attrName] = true
         }
         minusShow[attrName] = true
         chooseData[attrName] = 1
         chooseVal[attrName] = attribute[attrName][2][1]
         self.setData({
           chooseData: chooseData,
           chooseVal: chooseVal,
           addHide: addHide,
           minusShow: minusShow
         })
        
       }else{
         addHide[attrName] = true
         self.setData({
           addHide: addHide
         })
       }
    }
    self.checkAttr()
  },
  chooseAtt(e){
     var self = this
     var attrName = e.currentTarget.dataset.index
     var attrVal = e.currentTarget.dataset.val
     var valCh = e.currentTarget.dataset.valch
     var chooseData = self.data.chooseData
     var chooseCh = self.data.chooseCh
     var chooseVal = self.data.chooseVal
     var attribute = self.data.attribute
     chooseCh[attrName] = valCh
     chooseData[attrName] = attrVal
     self.setData({
       chooseCh: chooseCh,
       chooseData:chooseData,
     })
     
     self.checkAttr()
  },

  checkAttr(){
     var self = this
     var chooseData = self.data.chooseData
     var attribute = self.data.attribute
     var furData = self.data.furData
     var para = self.data.para
     var parData = self.data.parData
     var extData = self.data.extData
     var chooseVal = self.data.chooseVal
     var addHide = self.data.addHide
     var minusShow = self.data.minusShow
     var chooseData = self.data.chooseData
     var gatData = true
     var gatherAttr = ''
     for(var i in attribute){
       for(var p in attribute[i]){
         if (p == '1'){
           if (chooseData[i] != undefined){
             gatherAttr = gatherAttr + chooseData[i]+','
           }else{
             gatData = false
           }
         }else{
           var addName = i
           if (chooseData[i]) {
             gatherAttr = gatherAttr + chooseData[i] + ','
           } else {
             gatherAttr = gatherAttr + '0,'
           }
         }
       }
     }
    
     if(gatData){
       wx.request({
         url: app.globalData.api + '/Home/index/getFurModel',
         data: { furId: furData.id, gatAttr: gatherAttr },
         success: function (res) {
           if(!res.data){
             wx.showToast({
               title: '此搭配不存在，请重新选择',
               icon: 'none',
               duration: 1500
             })
             self.setData({
               furQuoId:'',
               furQuoImg:'',
               modelData: '',
               material: '',
               parameter:'',
               ext:'',
               gatherAttr: '',
             })
            }else{
             if (res.data.minVal){
               chooseVal[addName] = res.data.minVal
               chooseData[addName] = parseInt(res.data.minVal)
               if(res.data.minData == '2'){
                 minusShow[addName] = false;
               }else{
                 minusShow[addName] = true;
               }
               if(res.data.addData == '2'){
                 addHide[addName] = true;
               }else{
                 addHide[addName] = false;
               }
               self.setData({
                 chooseVal: chooseVal,
                 minusShow: minusShow,
                 addHide: addHide,
               })
             }
               self.setData({
                 furQuoId:res.data.furQuoId,
                 furQuoImg: res.data.furQuoImg,
                 modelData:res.data.modelData,
                 material:res.data.material,
                 parameter:res.data.parameter,
                 ext:res.data.ext,
                 gatherAttr: gatherAttr,
               })
              
               if(furData.id == '3'){
                 if(gatherAttr == '0,0,'){
                   para.H = 0.85
                   parData.H = 0.85
                   para.D = 0.6
                   parData.D = 0.6
                   self.setData({
                     para: para,
                     parData:parData
                   })
                 } else if (gatherAttr == '0,1,'){
                   para.H1 = 0.85
                   parData.H1 = 0.85
                   para.D1 = 0.6
                   parData.D1 = 0.6
                   para.H2 = 0.85
                   parData.H2 = 0.85
                   para.D2 = 0.6
                   parData.D2 = 0.6
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else if (gatherAttr == '0,2,') {
                   para.H1 = 0.85
                   parData.H1 = 0.85
                   para.D1 = 0.6
                   parData.D1 = 0.6
                   para.H2 = 0.85
                   parData.H2 = 0.85
                   para.D2 = 0.6
                   parData.D2 = 0.6
                   para.H3 = 0.85
                   parData.H3 = 0.85
                   para.D3 = 0.6
                   parData.D3 = 0.6
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else if (gatherAttr == '0,3,') {
                   para.H1 = 0.85
                   parData.H1 = 0.85
                   para.D1 = 0.6
                   parData.D1 = 0.6
                   para.H2 = 0.85
                   parData.H2 = 0.85
                   para.D2 = 0.6
                   parData.D2 = 0.6
                   para.H3 = 0.85
                   parData.H3 = 0.85
                   para.D3 = 0.6
                   parData.D3 = 0.6
                   para.H4 = 0.85
                   parData.H4 = 0.85
                   para.D4 = 0.6
                   parData.D4 = 0.6
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else if (gatherAttr == '1,0,') {
                   para.H = 2.4
                   parData.H = 2.4
                   para.D = 0.6
                   parData.D = 0.6
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else if (gatherAttr == '2,0,') {
                   para.H = 0.9
                   parData.H = 0.9
                   para.D = 0.35
                   parData.D = 0.35
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else if (gatherAttr == '3,0,') {
                   para.H = 0.85
                   parData.H = 0.85
                   para.D = 0.7
                   parData.D = 0.7
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else {
                   para = {}
                   parData = {}
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 }
               } else if (furData.id == '2'){
                 para.H = 2.4
                 parData.H = 2.4
                 para.D = 0.6
                 parData.D = 0.6
                 para.H1 = 2.4
                 parData.H1 = 2.4
                 para.D1 = 0.6
                 parData.D1 = 0.6
                 para.H2 = 2.4
                 parData.H2 = 2.4
                 para.D2 = 0.6
                 parData.D2 = 0.6
                 para.H3 = 2.4
                 parData.H3 = 2.4
                 para.D3 = 0.6
                 parData.D3 = 0.6
                 para.H4 = 2.4
                 parData.H4 = 2.4
                 para.D4 = 0.6
                 parData.D4 = 0.6
                 self.setData({
                   para: para,
                   parData: parData
                 })
               } else if (furData.id == '4') {
                 if (gatherAttr == '0,0,') {
                   para.H = 0.85
                   parData.H = 0.85
                   para.D = 0.6
                   parData.D = 0.6
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 } else {
                   para = {}
                   parData = {}
                   self.setData({
                     para: para,
                     parData: parData
                   })
                 }
               } else if (furData.id == '5') {
                 para.H = 2.4
                 parData.H = 2.4
                 para.D = 0.4
                 parData.D = 0.4
                 para.H1 = 2.4
                 parData.H1 = 2.4
                 para.D1 = 0.4
                 parData.D1 = 0.4
                 para.H2 = 2.4
                 parData.H2 = 2.4
                 para.D2 = 0.4
                 parData.D2 = 0.4
                   self.setData({
                     para: para,
                     parData: parData
                   })
               }

               var ext = res.data.ext
               for (var i in ext) {
                 for (var p in ext[i]) {
                   if (p == '3') {
                     if (ext[i][p][1] == 'kai') {
                       para['kai'] = 0
                       extData['kai'] = {}
                       extData['kai'][0] = 0
                     } else if (ext[i][p][1] == 'cao') {
                       para['cao'] = 1
                       extData['cao'] = {}
                       extData['cao'][0] = 1
                     } else if (ext[i][p][1] == 'tai') {
                       para['tai'] = 1
                       extData['tai'] = {}
                       extData['tai'][0] = 1
                     }
                     self.setData({
                       para: para,
                       extData: extData
                     })
                   }
                 }
               }

               if(furData.cate_id == '2'){
                 if (gatherAttr == '0,0,'){
                   //门套
                   self.setData({
                     widthLim:''
                   })
                 }else if (gatherAttr == '1,1,') {
                   //开门1扇
                   self.setData({
                     widthLim: '0<W≤1'
                   })
                 } else if (gatherAttr == '1,2,') {
                   //开门2扇
                   self.setData({
                     widthLim: '0.6≤W≤2'
                   })
                 } else if (gatherAttr == '2,1,') {
                   //木移门1扇
                   self.setData({
                     widthLim: '0<W≤1'
                   })
                 } else if (gatherAttr == '2,2,') {
                   //木移门2扇
                   self.setData({
                     widthLim: '1<W≤2'
                   })
                 } else if (gatherAttr == '2,3,') {
                   //木移门3扇
                   self.setData({
                     widthLim: '1.8≤W≤3'
                   })
                 } else if (gatherAttr == '2,4,') {
                   //木移门4扇
                   self.setData({
                     widthLim: '2.6≤W≤4'
                   })
                 } else if (gatherAttr == '3,1,') {
                   //玻璃移门1扇
                   self.setData({
                     widthLim: '0<W≤1'
                   })
                 } else if (gatherAttr == '3,2,') {
                   //玻璃移门2扇
                   self.setData({
                     widthLim: '1<W≤2'
                   })
                 } else if (gatherAttr == '3,3,') {
                   //玻璃移门3扇
                   self.setData({
                     widthLim: '1.8≤W≤3'
                   })
                 } else if (gatherAttr == '3,4,') {
                   //玻璃移门4扇
                   self.setData({
                     widthLim: '2.6≤W≤4'
                   })
                 } else if (gatherAttr == '4,2,') {
                   //折叠门2扇
                   self.setData({
                     widthLim: '0.9≤W≤1.8'
                   })
                 } else if (gatherAttr == '4,3,') {
                   //折叠门3扇
                   self.setData({
                     widthLim: '1.4≤W≤2.7'
                   })
                 } else if (gatherAttr == '4,4,') {
                   //折叠门4扇
                   self.setData({
                     widthLim: '1.8≤W≤4'
                   })
                 } else if (gatherAttr == '4,5,') {
                   //折叠门5扇
                   self.setData({
                     widthLim: '2.3≤W≤5'
                   })
                 }
               }
            }
         }
       })
     }
  },
  goodsDetail(e){
    var self = this
    var goodsId = e.currentTarget.dataset.id
    var goodsTag = e.currentTarget.dataset.pr
    
    //获取商品详情
    wx.request({
      url: app.globalData.api + '/Home/index/getGoodsDetail',
      data: {
        id: goodsId
      },
      success: function (res) {
        self.setData({
          goodsPrice:res.data.goodsPrice,
          goodsData: res.data.goodsData,
          gnData: res.data.gnData,
          attrColData: res.data.attrColData,
          attrNouniData: res.data.attrNouniData,
          attrUniData: res.data.attrUniData,
          goodsTag:goodsTag,
          showGoods:true,
          mask:true,
        })
      }
    })
  },
  closeGoods(){
    var self = this
    self.setData({
      price: '',
      attrColData: '',
      attrNouniData: '',
      chooseDef:'',
      showGoods: false,
      mask: false,
    })
  },
  imgYu(e) {
    var src = e.currentTarget.dataset.src
    var urls = []
    urls.push(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this 
    var furId = options.furId
    wx.request({
      url: app.globalData.api + '/Home/index/getFurAttr',
      data:{furId:furId},
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.furData.fur_name,
        })
        self.setData({
          furData: res.data.furData,
          attribute:res.data.attribute
        })
        if(res.data.attribute.length == '0'){
          wx.request({
            url: app.globalData.api + '/Home/index/getFurModel',
            data: { furId: res.data.furData.id, gatAttr: '0' },
            success: function (res1) {
                self.setData({
                  furQuoId:res1.data.furQuoId,
                  modelData: res1.data.modelData,
                  material: res1.data.material,
                  parameter: res1.data.parameter,
                  ext: res1.data.ext,
                })
            }
          })
        }else{
          self.checkAttr()
        }     
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
  chooseAttr: function (event) {
    var id = event.target.dataset.id
    var attr = event.target.dataset.attr
    var tag = event.target.dataset.tag
    var self = this
    var chooseData = ''
    var goodsId = self.data.goodsData.id
    var attrColData = self.data.attrColData
    var attrNouniData = self.data.attrNouniData
    var goodsTag = self.data.goodsTag
    var goodsImg = self.data.goodsImg
    var goodsAttrArr = self.data.goodsAttrArr
    var chooseGoods = self.data.chooseGoods
    
    if (tag == '2') {
      if (attrNouniData[attr][0].attr == id) {
        for (var i in attrNouniData[attr]) {
          attrNouniData[attr][i]['attr'] = ''
        }
      } else {
        for (var i in attrNouniData[attr]) {
          attrNouniData[attr][i]['attr'] = id
        }
      }
      self.setData({
        attrNouniData: attrNouniData,
      })
    } else if (tag == '3') {
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
    } else if (tag == '1') {
      var chooseDef = !self.data.chooseDef
      if (chooseDef) {
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
        goodsId: goodsId,
        goodsAttrId: chooseData,
      },
      success: function (res) {
        self.setData({
          attrColData: res.data.attrColData,
          attrNouniData: res.data.attrNouniData,
        })
        if (res.data.gnData != '') {   
          if(!goodsImg[goodsTag]){
            goodsImg[goodsTag] = {}
          }
          if (!goodsAttrArr[goodsTag]){
            goodsAttrArr[goodsTag] = {}
          }
          goodsImg[goodsTag][goodsId] = res.data.gnData.img_src
          goodsAttrArr[goodsTag][goodsId] = res.data.gnData.id
          self.setData({
            price: res.data.gnData,
            goodsImg:goodsImg,
          })
          if(chooseGoods[goodsTag]){
            if (chooseGoods[goodsTag][0]){
              chooseGoods[goodsTag][1] = res.data.gnData.id
              self.setData({
                chooseGoods: chooseGoods
              })
            }
          }
        } else {
          self.setData({
            price: '',
          })
        }

      }
    })
  },
  chooseGoods(e) {
    var self = this
    var goodsId = e.currentTarget.dataset.id
    var goodsTag = e.currentTarget.dataset.pr
    var goodsAttrArr = self.data.goodsAttrArr
    var chooseGoods = self.data.chooseGoods

    chooseGoods[goodsTag] = {}
    chooseGoods[goodsTag][0] = goodsId
    if (goodsAttrArr[goodsTag]){
      if (goodsAttrArr[goodsTag][goodsId]){
        chooseGoods[goodsTag][1] = goodsAttrArr[goodsTag][goodsId]
      }
    }
    
    self.setData({
      chooseGoods: chooseGoods
    })

  },
  changePara(e){
     var self = this
     var parData = self.data.parData
     var para = self.data.para
     var cate = self.data.furData.cate_id
     var gatherAttr = self.data.gatherAttr
     var key = e.currentTarget.dataset.key
     var val = e.detail.value
     var reg = /^\d+(\.\d+)?$/;
     if(!reg.test(val)){
       wx.showToast({
         title: '输入参数必须为数字类型，且为正数！',
         icon: 'none',
         duration: 1500
       })
       para[key] = ''
       self.setData({
         para: para
       })
     }else{
        if(cate == '2'){
          if (key == 'H') {
            if (val > 2.4) {
              wx.showToast({
                title: '参数H必须小于等于2.4',
                icon: 'none',
                duration: 1500
              })
              para[key] = ''
              parData[key] = ''
              self.setData({
                parData: parData,
                para: para
              })
            } else {
              para[key] = val
              parData[key] = val
              self.setData({
                parData: parData,
                para: para
              })
            }
          } else if (key == 'W') {
            if (gatherAttr == '1,1,') {
              //开门1扇
              if(val<=1){
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              }else{
                wx.showToast({
                  title: '参数W必须 0<W≤1',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '1,2,') {
              //开门2扇
              if (0.6 <= val <= 2){
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 0.6≤W≤2',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '2,1,') {
              //木移门1扇
              if (0 <= val <= 1) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 0<W≤1',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '2,2,') {
              //木移门2扇
              if (1 < val <= 2) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1<W≤2',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '2,3,') {
              //木移门3扇
              if (1.8 <= val <= 3) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1.8≤W≤3',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '2,4,') {
              //木移门4扇
              if (2.6 <= val <= 4) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 2.6≤W≤4',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '3,1,') {
              //玻璃移门1扇
              if (0 < val <= 2) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 0<W≤1',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '3,2,') {
              //玻璃移门2扇
              if (1 < val <= 2) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1<W≤2',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '3,3,') {
              //玻璃移门3扇
              if (1.8 <= val <= 3) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1.8≤W≤3',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '3,4,') {
              //玻璃移门4扇
              if (2.6 <= val <= 4) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 2.6≤W≤4',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '4,2,') {
              //折叠门2扇
              if (0.9 <= val <= 1.8) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 0.9≤W≤1.8',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '4,3,') {
              //折叠门3扇
              if (1.4 <= val <= 2.7) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1.4≤W≤2.7',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '4,4,') {
              //折叠门4扇
              if (1.8 <= val <= 4) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 1.8≤W≤4',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            } else if (gatherAttr == '4,5,') {
              //折叠门5扇
              if (2.3 <= val <= 5) {
                para[key] = val
                parData[key] = val
                self.setData({
                  parData: parData,
                  para: para
                })
              } else {
                wx.showToast({
                  title: '参数W必须 2.3≤W≤5',
                  icon: 'none',
                  duration: 1500
                })
                para[key] = ''
                parData[key] = ''
                self.setData({
                  parData: parData,
                  para: para
                })
              }
            }else{
              para[key] = val
              parData[key] = val
              self.setData({
                parData: parData,
                para: para
              })
            }
          }else{
            para[key] = val
            parData[key] = val
            self.setData({
              parData: parData,
              para: para
            })
          }   
        }else{
          para[key] = val
          parData[key] = val
          self.setData({
            parData: parData,
            para: para
          })
        }
     }
  },
  changeSpace(e){
    var self = this
    var val = e.detail.value
    self.setData({
      space:val
    })
  },
  changeCheck(e){
    var self = this
    var extData = self.data.extData
    var name = e.target.dataset.name
    var key = e.target.dataset.key
    var val = e.target.dataset.val
    if (!extData[key]){
      extData[key] = {}
    }
    if (extData[key][name]){
      delete(extData[key][name])
    }else{
      extData[key][name] = val
    }
    self.setData({
      extData:extData
    })

  },
  changeRadio(e){
    var self = this
    var extData = self.data.extData
    var name = e.target.dataset.name
    var key = e.target.dataset.key
    var val = e.target.dataset.val

    extData[key] = {}
    extData[key][name] = val
    self.setData({
      extData: extData
    })
  },
  changeInput(e){
    var self = this
    var key = e.target.dataset.key
    var val = e.detail.value
    var para = self.data.para
    var extData = self.data.extData
    var reg = /^\d+(\.\d+)?$/;
    if (!reg.test(val)) {
      wx.showToast({
        title: '输入参数必须为数字类型，且为非负数！',
        icon: 'none',
        duration: 1500
      })
      para[key] = ''
      self.setData({
        para: para
      })
      delete (extData[key])
    }else{
      extData[key] = {}
      extData[key][0] = val
    }

  },
  submit(){
    var self = this
    var sub = true
    var reg = /^\d+(\.\d+)?$/;
    var space = self.data.space
    var furQuoId = self.data.furQuoId
    var furId = self.data.furData.id
    var cateId = self.data.furData.cate_id
    var extData = self.data.extData
    var parData = self.data.parData
    var chooseGoods = self.data.chooseGoods
    var material = self.data.material
    var parameter = self.data.parameter
    var ext = self.data.ext
    var chooseCh = self.data.chooseCh
    //检测材料是否选择
    for(var o in material){
      if (!chooseGoods[o]){
        for (var p in material[o]){
          wx.showToast({
            title: '请选择'+p+'材料',
            icon: 'none',
            duration: 1500
          })
          break
        }
        sub = false
        break
      }
    }

    //检测参数输入合法性
    if(sub){
      for (var i in parameter) {
        if (!reg.test(parData[parameter[i]])) {
          wx.showToast({
            title: '图示参数必须为数字类型，且为正数！',
            icon: 'none',
            duration: 1500
          })
          sub = false
          break
        }
      }
    }

    //检测家具位置是否输入
    if(sub){
      if(!space){
        wx.showToast({
          title: '请输入家具所在位置！',
          icon: 'none',
          duration: 1500
        })
        sub = false
      }
    }
   
    //检测扩展属性合法性
    if(sub){
      for(var i in ext){
        for(var p in ext[i]){
          if(p == '3'){
            if (!extData[ext[i][p][1]] || !reg.test(extData[ext[i][p][1]][0])){
               wx.showToast({
                 title: ext[i][p][0]+'必须为数字类型，且为非负数！',
                 icon: 'none',
                 duration: 1500
               })
               sub = false
               break 
             }
          }
        }
        if(!sub){
          break
        }
      }
    }
    //提交到服务器
    if(sub){
      var extStr = JSON.stringify(extData)
      var parStr = JSON.stringify(parData)
      var goodsStr = JSON.stringify(chooseGoods)
      chooseCh = JSON.stringify(chooseCh)
      wx.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          wx.getStorage({
            key: 'userKey',
            success: function (res) {
              wx.request({
                url: app.globalData.api + '/Home/index/addWxModule',
                data: {
                  furId: furId, furQuoId: furQuoId, space: space, extData: extStr, parData: parStr, chooseGoods: goodsStr, chooseCh:chooseCh,userId: res.data.id,thr_session: res.data.thr_session},
                success: function (res1) {
                  if(res1.data){
                    wx.redirectTo({
                      url: '/pages/my/quote/myQuote/myQuoe?sta='+cateId,
                    })
                  }else{
                    wx.showToast({
                      title: '添加失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              })
            }
          }) 
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
                    wx.request({
                      url: app.globalData.api + '/Home/index/addWxModule',
                      data: {
                        furId: furId, furQuoId: furQuoId, space: space, extData: extStr, parData: parStr, chooseGoods: goodsStr, userId: res1.data.id, thr_session: res1.data.thr_session
                      },
                      success: function (res2) {
                        if (res2.data) {
                          wx.redirectTo({
                            url: '/pages/my/quote/myQuote/myQuoe?sta='+cateId,
                          })
                        } else {
                          wx.showToast({
                            title: '添加失败',
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  }
})
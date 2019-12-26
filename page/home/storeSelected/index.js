// page/home/storeSelected/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    mainCur: 0,
    verticalNavTop: 0,
    districtList: [],
    load: true,
    options: null, //对应onLoad中的options
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('storeSelected index.js', options, app.globalData.orderSubmit);
    this.setData({
      options: options
    });
    wx.setNavigationBarTitle({
      title: options.title,
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/store/list',
      data: {
        city: options.adcode
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res1 => {
      console.log('storeSelected index.js /rentalcars/wechat/store/list success', res1);
      this.setData({
        districtList: res1.data,
        tabCur: res1.data[0].county,
        mainCur: res1.data[0].county,
        verticalNavTop: (res1.data[0].county - 1) * 50
      });
    }, err1 => {
      console.log('storeSelected index.js /rentalcars/wechat/store/list failure', err1);
    });
    //获取车辆分类标签信息
    // app.httpInterceptor({
    //   url: app.globalData.baseUrl + '/rentalcars/wechat/district/children/' + options.adcode,
    //   header: {
    //     'content-type': 'application/json',
    //     'token': app.globalData.token
    //   },
    //   method: 'GET'
    // }).then(res => {
    //   console.log('storeSelected index.js onLoad /district/children/{code} success', res);
    //   let tempDistrictList = [];
    //   for (let i = 0; i < res.data.length; i++) {
    //     let tempItem = {
    //       district: null,
    //       storeList: []
    //     }
    //     tempItem.district = res.data[i];
    //     tempDistrictList.push(tempItem);
    //     app.httpInterceptor({
    //       url: app.globalData.baseUrl + '/rentalcars/wechat/store/list',
    //       data: {
    //         county: res.data[i].code
    //       },
    //       header: {
    //         'content-type': 'application/json',
    //         'token': app.globalData.token
    //       },
    //       method: 'GET'
    //     }).then(res1 => {
    //       console.log('storeSelected index.js /rentalcars/wechat/store/list success', res1);
    //       tempDistrictList.length > 0 && tempDistrictList[i].storeList.push(...res1.data);
    //       if (i === res.data.length - 1) {
    //         tempDistrictList = tempDistrictList.filter(item => item.storeList.length > 0);
    //         if (tempDistrictList.length > 0) {
    //           this.setData({
    //             districtList: tempDistrictList,
    //             tabCur: tempDistrictList[0].district.id,
    //             mainCur: tempDistrictList[0].district.id,
    //             verticalNavTop: (tempDistrictList[0].district.id - 1) * 50
    //           });
    //         } else {
    //           this.setData({
    //             districtList: tempDistrictList
    //           });
    //         }
    //       }
    //     }, err => {
    //       console.log('storeSelected index.js /rentalcars/wechat/store/list failure');
    //     });
    //   };
    //   // if (res.data.length > 0) {
    //   //   this.setData({
    //   //     tabCur: res.data[0].id,
    //   //     mainCur: res.data[0].id,
    //   //     verticalNavTop: (res.data[0].id - 1) * 50
    //   //   });
    //   // }
    // }, err => {
    //   console.log('storeSelected index.js onLoad /rentalcars/wechat/vehicle/tag/all failure', err);
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // tab切换
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.county,
      mainCur: e.currentTarget.dataset.county,
      verticalNavTop: (e.currentTarget.dataset.county - 1) * 50
    })
  },
  // 页面右边内容滚动事件回调
  verticalMain(e) {
    // console.log('storeSelected index.js verticalMain', e);
    let that = this;
    let districtList = this.data.districtList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < districtList.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + districtList[i].county);
        view.fields({
          size: true
        }, data => {
          districtList[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          districtList[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        districtList: districtList
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < districtList.length; i++) {
      if (scrollTop > districtList[i].top && scrollTop < districtList[i].bottom) {
        that.setData({
          verticalNavTop: (districtList[i].county - 1) * 50,
          tabCur: districtList[i].county
        })
        return false
      }
    }
  },
  // 选择车辆回调
  handleSelectedItem: function(e) {
    console.log('storeSelected index.js handleSelectedItem', e);
    let targetPages = getCurrentPages().filter(item => item.route === 'page/home/index');
    let subItemTemp = e.currentTarget.dataset.subItem;
    targetPages[0][this.data.options.from + 'Id'] = subItemTemp.id;
    targetPages[0]['repaySiteId'] = subItemTemp.id;
    targetPages[0].setData({ //改变首页的地址选择
      [this.data.options.from]: subItemTemp.name,
      repaySite: subItemTemp.name
    }, () => {
      wx.navigateBack({
        delta: 1 // 表示返回到上一个页面（如果值为2表示回退到上上一个页面）
      });
    });
  }
})
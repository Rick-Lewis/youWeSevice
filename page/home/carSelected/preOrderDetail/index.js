// page/home/carSelected/preOrderDetail/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    checked: false, // 协议复选框，默认为不选
    visible: false,
    preOrder: null, //基本费用
    baseUrl: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log('preOrderDetail index.js onLoad', options, app.globalData.orderSubmit);
    this.setData({
      orderSubmit: app.globalData.orderSubmit,
      baseUrl: app.globalData.baseUrl
    });
    let temp = {
      time_start: '' + app.globalData.orderSubmit.fetchTime.day.year + '-' + app.globalData.orderSubmit.fetchTime.day.month + '-' + app.globalData.orderSubmit.fetchTime.day.day + ' ' + app.globalData.orderSubmit.fetchTime.time.text + ':00',
      time_end: '' + app.globalData.orderSubmit.repayTime.day.year + '-' + app.globalData.orderSubmit.repayTime.day.month + '-' + app.globalData.orderSubmit.repayTime.day.day + ' ' + app.globalData.orderSubmit.repayTime.time.text + ':00',
      days: app.globalData.orderSubmit.duration.days,
      model_id: app.globalData.orderSubmit.carDetail.id,
      store_pick_up: app.globalData.orderSubmit.fetchSite.id,
      store_drop_off: app.globalData.orderSubmit.repaySite.id
    };
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/preview',
      data: temp,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('preOrderDetail index.js onLoad /rentalcars/wechat/order/rental/preview success', res);
      this.setData({
        preOrder: res.data
      });
      if (res.data.vehicle_count <= 0){
        wx.showToast({
          title: '无可用车辆',
          icon: 'none'
        });
      }
    }, err => {
      console.log('preOrderDetail index.js onLoad /rentalcars/wechat/order/rental/preview failure', res);
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },
  // 勾选协议事件回调
  handleCheckBoxChange: function({
    detail = {}
  }) {
    this.setData({
      checked: detail.current
    });
  },
  // 协议点击回调
  handleProtocolClick: function() {
    console.log('preOrderDetail index.js handleProtocolClick');
    wx.navigateTo({
      url: '/page/web/web',
    });
  },
  // 车辆详情
  handleSelectedItem: function(e) {
    console.log('preOrderDetail index.js handleSelectedItem', e);
    wx.navigateTo({
      url: '/page/home/carSelected/carDetail/index?id=' + app.globalData.orderSubmit.carDetail.id,
    });
  },
  // 立即预定
  handlePayment: function() {
    console.log('preOrderDetail index.js handlePayment');
    if (this.data.checked) {
      if (app.globalData.isPhoneAuth) {
        let temp = {
          time_start: '' + app.globalData.orderSubmit.fetchTime.day.year + '-' + app.globalData.orderSubmit.fetchTime.day.month + '-' + app.globalData.orderSubmit.fetchTime.day.day + ' ' + app.globalData.orderSubmit.fetchTime.time.text + ':00',
          time_end: '' + app.globalData.orderSubmit.repayTime.day.year + '-' + app.globalData.orderSubmit.repayTime.day.month + '-' + app.globalData.orderSubmit.repayTime.day.day + ' ' + app.globalData.orderSubmit.repayTime.time.text + ':00',
          days: app.globalData.orderSubmit.duration.days,
          model_id: app.globalData.orderSubmit.carDetail.id,
          store_pick_up: app.globalData.orderSubmit.fetchSite.id,
          store_drop_off: app.globalData.orderSubmit.repaySite.id
        };
        app.httpInterceptor({
          url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/create',
          data: temp,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': app.globalData.token
          },
          method: 'POST'
        }).then(res => {
          console.log('preOrderDetail index.js onLoad /rentalcars/wechat/order/rental/create success', res);
          if (res.data.code === 0) {
            if (!!res.data.data.timeStamp && !!res.data.data.nonceStr && !!res.data.data.package && !!res.data.data.paySign && !!res.data.data.signType) {
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                paySign: res.data.data.paySign,
                signType: res.data.data.signType,
                success: res => {
                  console.log('preOrderDetail index.js onLoad requestPayment success', res);
                  wx.showLoading();
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/page/order/index',
                    }, () => {
                      wx.hideLoading();
                    });
                  }, 1500);
                },
                fail: err => {
                  console.log('preOrderDetail index.js onLoad requestPayment fail', err);
                  wx.switchTab({
                    url: '/page/order/index',
                  });
                }
              });
            } else {
              app.httpInterceptor({
                url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/pay',
                data: {
                  order_no: res.data.data.order_no
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'token': app.globalData.token
                },
                method: 'GET'
              }).then(res => {
                console.log('order index.js onLoad /rentalcars/wechat/order/rental/pay success', res);
                if (res.data.code === 0) {
                  wx.requestPayment({
                    timeStamp: res.data.data.paySign.timeStamp,
                    nonceStr: res.data.data.paySign.nonceStr,
                    package: res.data.data.paySign.package,
                    paySign: res.data.data.paySign.paySign,
                    signType: res.data.data.paySign.signType,
                    success: res => {
                      console.log('preOrderDetail index.js onLoad requestPayment success', res);
                      wx.showLoading();
                      setTimeout(() => {
                        wx.switchTab({
                          url: '/page/order/index',
                        }, () => {
                          wx.hideLoading();
                        });
                      }, 1500);
                    },
                    fail: err => {
                      console.log('preOrderDetail index.js onLoad requestPayment fail', err);
                      wx.switchTab({
                        url: '/page/order/index',
                      });
                    }
                  });
                } else {
                  wx.showToast({
                    title: res.data.data,
                  });
                }
              }, err => {
                console.log('order index.js onLoad /rentalcars/wechat/order/rental/pay failure', res);
              });
            }
          } else {
            wx.showToast({
              title: res.data.data,
            });
          }
        }, err => {
          console.log('preOrderDetail index.js onLoad /rentalcars/wechat/order/rental/create failure', res);
        });
      } else {
        wx.navigateTo({
          url: '/page/myZone/phoneAuth/index?from=preOrderDetail',
        });
      }
    }
    // else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请勾选同意《租车服务合同》',
    //     showCancel: false,
    //     confirmText: '我知道了'
    //   });
    // }
  },
  // 取车须知
  fetchNotice: function() {
    this.setData({
      visible: true
    });
    // wx.showModal({
    //   showCancel: false,
    //   title: '取车须知',
    //   content: '1、需下单会员本人取车2、取车时请携带：二代身份证、驾驶证',
    //   confirmText: '我知道了',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定');
    //     } else if (res.cancel) {
    //       console.log('用户点击取消');
    //     }
    //   }
    // });
  },
  handleOk: function(){
    this.setData({
      visible: false
    });
  }
})
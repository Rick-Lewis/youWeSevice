// page/order/orderDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    ORDER_STATUS: {
      // '-1': '已取消',
      // '0': '待支付',
      // '1': '待取车',
      // '2': '退款中',
      // '3': '进行中',
      // '4': '已完成'
    },
    comment: null,
    baseUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('orderDetail index.js onLoad', options);
    this.setData({
      baseUrl: app.globalData.baseUrl
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/status',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/status', res);
      let temp = {};
      res.data.forEach(item => temp[item.status + ''] = item.name);
      this.setData({
        ORDER_STATUS: temp
      });
    }, err => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/status failure', err);
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/detail/' + options.orderNo,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/detail/{orderno} success', res);
      this.setData({
        orderDetail: res.data
      });
      if (res.data.order.comment_id) {
        app.httpInterceptor({
          url: app.globalData.baseUrl + '/rentalcars/wechat/order/comment/' + res.data.order.comment_id,
          header: {
            'content-type': 'application/json',
            'token': app.globalData.token
          },
          method: 'GET'
        }).then(res => {
          console.log('orderDetail index.js onLoad /rentalcars/wechat/order/comment/{comment_id} success', res);
          this.setData({
            comment: res.data
          });
        }, err => {
          console.log('orderDetail index.js onLoad /rentalcars/wechat/order/comment/{comment_id} failure', err);
        });
      }
    }, err => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/detail/{orderno} failure', err);
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  handlePayment: function () {
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/pay',
      data: {
        order_no: this.data.orderDetail.order.order_no
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/pay success', res);
      if (res.data.code === 0) {
        wx.requestPayment({
          timeStamp: res.data.data.paySign.timeStamp,
          nonceStr: res.data.data.paySign.nonceStr,
          package: res.data.data.paySign.package,
          paySign: res.data.data.paySign.paySign,
          signType: res.data.data.paySign.signType,
          success: res => {
            console.log('orderDetail index.js onLoad requestPayment success', res);
            wx.navigateBack();
          },
          fail: err => {
            console.log('orderDetail index.js onLoad requestPayment fail', err);
          }
        });
      } else {
        wx.showToast({
          title: res.data.data,
        });
      }
    }, err => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/pay failure', res);
    });
  },
  handleCancel: function () { 
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/cancel',
      data: {
        order_no: this.data.orderDetail.order.order_no
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/cancel success', res);
      if (res.data.code === 0) {
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.data.message,
        });
      }
    }, err => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/cancel failure', res);
    });
  }
})
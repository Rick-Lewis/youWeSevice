// page/order/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    tabList: [{
      key: 0,
      name: 'tab0',
      title: '全部订单'
    }, {
      key: 1,
      name: 'tab1',
      title: '进行中'
    }, {
      key: 2,
      name: 'tab2',
      title: '已完成'
    }, {
      key: 3,
      name: 'tab3',
      title: '已取消'
    }],
    orderList: [],
    ORDER_STATUS: {
      // '-1': '已取消',
      // '0': '待支付',
      // '1': '待取车',
      // '2': '退款中',
      // '3': '进行中',
      // '4': '已完成'
    },
    baseUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('order index.js onLoad', options);
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
      console.log('order index.js onLoad /rentalcars/wechat/order/status', res);
      let temp = {};
      res.data.forEach(item => temp[item.status + ''] = item.name);
      this.setData({
        ORDER_STATUS: temp
      });
    }, err => {
      console.log('order index.js onLoad /rentalcars/wechat/order/status failure', err);
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
    let statusTemp = this.handleSwitchStatus(this.data.current);
    let temp = {
      pageIndex: 1,
      pageSize: 20
    };
    if (statusTemp){
      temp = Object.assign({}, temp, {
        status: statusTemp
      });
    }
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/page',
      data: temp,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('order index.js onLoad /rentalcars/wechat/order/rental/page success', res);
      this.setData({
        orderList: res.data.dataSource
      });
    }, err => {
      console.log('order index.js onLoad /rentalcars/wechat/order/rental/page failure', err);
    });
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
  handleOrderSelect: function(e) {
    console.log('order index.js handleOrderSelect', e);
    wx.navigateTo({
      url: '/page/order/orderDetail/index?orderNo=' + e.currentTarget.dataset.orderNo,
    });
  },
  handleTabChange: function(e) {
    console.log('order index.js handleTabChange', e);
    let statusTemp = this.handleSwitchStatus(e.detail.key);
    let temp = {
      pageIndex: 1,
      pageSize: 20
    };
    if (statusTemp) {
      temp = Object.assign({}, temp, {
        status: statusTemp
      });
    }
    this.setData({
      current: e.detail.key
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/page',
      data: temp,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('order index.js onLoad /rentalcars/wechat/order/rental/page success', res);
      this.setData({
        orderList: res.data.dataSource
      });
      wx.hideLoading();
    }, err => {
      console.log('order index.js onLoad /rentalcars/wechat/order/rental/page failure', res);
      wx.hideLoading();
      this.setData({
        orderList: []
      });
      wx.showToast({
        title: '操作失败',
      });
    });
  },
  // handlePayment: function(e) {
  //   app.httpInterceptor({
  //     url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/pay',
  //     data: {
  //       order_no: e.currentTarget.dataset.orderNo
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'token': app.globalData.token
  //     },
  //     method: 'GET'
  //   }).then(res => {
  //     console.log('order index.js onLoad /rentalcars/wechat/order/rental/pay success', res);
  //     if (res.data.code === 0) {
  //       wx.requestPayment({
  //         timeStamp: res.data.data.paySign.timeStamp,
  //         nonceStr: res.data.data.paySign.nonceStr,
  //         package: res.data.data.paySign.package,
  //         paySign: res.data.data.paySign.paySign,
  //         signType: res.data.data.paySign.signType,
  //         success: res => {
  //           console.log('order index.js onLoad requestPayment success', res);
  //           let statusTemp = this.handleSwitchStatus(this.data.current);
  //           let temp = {
  //             pageIndex: 1,
  //             pageSize: 20
  //           };
  //           if (statusTemp) {
  //             temp = Object.assign({}, temp, {
  //               status: statusTemp
  //             });
  //           }
  //           wx.showLoading({
  //             title: '加载中...',
  //             mask: true
  //           });
  //           app.httpInterceptor({
  //             url: app.globalData.baseUrl + '/rentalcars/wechat/order/rental/page',
  //             data: temp,
  //             header: {
  //               'content-type': 'application/json',
  //               'token': app.globalData.token
  //             },
  //             method: 'GET'
  //           }).then(res => {
  //             console.log('order index.js onLoad /rentalcars/wechat/order/rental/page success', res);
  //             this.setData({
  //               orderList: res.data.dataSource
  //             });
  //             wx.hideLoading();
  //           }, err => {
  //             console.log('order index.js onLoad /rentalcars/wechat/order/rental/page failure', res);
  //             wx.hideLoading();
  //           });
  //         },
  //         fail: err => {
  //           console.log('order index.js onLoad requestPayment fail', err);
  //         }
  //       });
  //     } else {
  //       wx.showToast({
  //         title: res.data.data,
  //       });
  //     }
  //   }, err => {
  //     console.log('order index.js onLoad /rentalcars/wechat/order/rental/pay failure', res);
  //   });
  // },
  handleEvaluate: function(e) {
    console.log('order index.js handleEvaluate', e);
    wx.navigateTo({
      url: '/page/order/rate/index?orderNo=' + e.currentTarget.dataset.orderNo,
    });
  },
  handleSwitchStatus: function(val){
    let result = '';
    switch (val) {
      case '0':
        result = '';
        break;
      case '1':
        result = '3';
        break;
      case '2':
        result = '4';
        break;
      case '3':
        result = '-1';
        break;
    }
    return result;
  }
})
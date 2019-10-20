// page/order/orderDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeArray: [],
    startIndex: [0, 0],
    endIndex: [0, 0],
    duration: {
      days: 0,
      hours: 0,
      minutes: 0
    },
    orderDetail: null,
    ORDER_STATUS: {
      '-1': '已取消',
      '0': '未支付',
      '1': '待取车',
      '2': '进行中',
      '3': '已完成'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('orderDetail index.js onLoad', options);
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
    }, err => {
      console.log('orderDetail index.js onLoad /rentalcars/wechat/order/rental/detail/{orderno} failure', err);
    });
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
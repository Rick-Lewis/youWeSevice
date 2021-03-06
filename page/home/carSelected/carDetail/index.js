// page/home/carSelected/carDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '',
    modelDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      baseUrl: app.globalData.baseUrl
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/model/' + options.id,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carDetail index.js onLoad /wechat/vehicle/model/{id} success', res);
      this.setData({
        modelDetail: res.data
      });
    }, err => {
      console.log('carDetail index.js onLoad /wechat/vehicle/model/{id} failure', err);
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

  },
  // 预定详情
  handleReserveCar: function(){
    wx.navigateTo({
      url: '/page/home/carSelected/preOrderDetail/index',
    });
  }
})
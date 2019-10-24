// page/myZone/phoneAuth/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {

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
  // 获取用户手机号回调
  handleGetPhoneNumber: function(e) {
    console.log('phoneAuth index.js handleGetPhoneNumber', e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      app.globalData.isPhoneAuth = true;
      wx.navigateBack();
      //获取用户信息
      app.httpInterceptor({
        url: app.globalData.baseUrl + '/rentalcars/wechat/info/user',
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        method: 'GET'
      }).then(res => {
        console.log('phoneAuth index.js onLoad /rentalcars/wechat/info/user success', res);
        app.globalData.userInfo = res.data.data;
      }, err => {
        console.log('phoneAuth index.js onLoad /rentalcars/wechat/info/user failure', err);
      });
    }
  }
})
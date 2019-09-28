// page/home/carSelected/preOrderDetail/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    checked: false
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
  handleCheckBoxChange: function({
    detail = {}
  }) {
    this.setData({
      checked: detail.current
    });
  },
  // 立即预定
  handlePayment: function() {
    console.log('preOrderDetail index.js handlePayment');
    wx.requestPayment({
      timeStamp: new Date().getTime().toString(),
      nonceStr: Math.random().toString(),
      package: '',
      signType: '',
      paySign: '',
    });
  }
})
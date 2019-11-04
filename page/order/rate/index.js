// page/order/rate/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    starIndex: 0,
    value: '',
    orderNo: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log('rate index.js onLoad options', options);
    this.setData({
      orderNo: options.orderNo
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  onChange(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex': index
    })
  },
  bindinput(e){
    console.log('rate index.js bindinput ', e);
    this.setData({
      value: e.detail.value
    });
  },
  bindFormSubmit(){
    console.log('rate index.js bindFormSubmit', this.data);
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/order/comment/add',
      data: {
        order_no: this.data.orderNo,
        grade: parseInt(this.data.starIndex),
        content: this.data.value
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'POST'
    }).then(res => {
      console.log('rate index.js bindFormSubmit');
      if(res.data.code === 0){
        wx.showToast({
          title: '提交成功',
          success: function(){
            wx.navigateBack();
          }
        });
      }else{
        wx.showToast({
          title: '提交失败',
          success: function () {
            wx.navigateBack();
          }
        });
      }
    }, err => {
      console.log('rate index.js bindFormSubmit');
      wx.showToast({
        title: '提交失败',
        success: function () {
          wx.navigateBack();
        }
      });
    });
  }
})
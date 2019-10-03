// page/myZone/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserInfoAuth: false, //是否授权用户信息
    isPhoneAuth: false, //是否授权手机号
    userInfo: null //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('myZone index onLoad', options, app.globalData);
    this.setData({
      isPhoneAuth: app.globalData.isPhoneAuth
    });
    wx.getUserInfo({
      success: res => {
        app.globalData.isUserInfoAuth = true;
        this.setData({
          isUserInfoAuth: app.globalData.isUserInfoAuth,
          userInfo: res.userInfo
        });
      },
      fail: err => {}
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
    console.log('myZone index onLoad', app.globalData);
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
  // 获取用户信息回调
  getUserInfo: function(e) {
    console.log('myZone index.js getUserInfo', e);
    if (e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.isUserInfoAuth = true;
      this.setData({
        isUserInfoAuth: app.globalData.isUserInfoAuth,
        userInfo: e.detail.userInfo
      });
      // let dataTemp = JSON.stringify({
      //   encryptedData: e.detail.encryptedData,
      //   iv: e.detail.iv,
      //   signature: e.detail.signature,
      //   userInfo: Object.assign({}, e.detail.userInfo)
      // });
      //保存用户信息
      app.httpInterceptor({
        url: app.globalData.baseUrl + '/rentalcars/wechat/sync/user',
        data: e.detail,
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        method: 'POST'
      }).then(res => {
        console.log('myZone index.js onLoad /rentalcars/wechat/sync/user success', res);
      }, err => {
        console.log('myZone index.js onLoad /rentalcars/wechat/sync/user failure', err);
      });
    }
  },
  // 联系客服
  conCusService: function() {
    wx.makePhoneCall({
      phoneNumber: '15921833510'
    });
  },
  // 手机号授权
  // handlePhoneAuth: function() {
  //   wx.navigateTo({
  //     url: '/page/myZone/phoneAuth/index',
  //   });
  // },
  // 获取用户手机号回调
  handleGetPhoneNumber: function(e) {
    console.log('phoneAuth index.js handleGetPhoneNumber', e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      app.httpInterceptor({
        url: app.globalData.baseUrl + '/rentalcars/wechat/sync/telephone',
        data: e.detail,
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        method: 'POST'
      }).then(res => {
        console.log('myZone index.js onLoad /rentalcars/wechat/sync/telephone success', res);
        app.globalData.isPhoneAuth = true;
        this.setData({
          isPhoneAuth: app.globalData.isPhoneAuth
        });
      }, err => {
        console.log('myZone index.js onLoad /rentalcars/wechat/sync/telephone failure', err);
      });
    }
  }
})
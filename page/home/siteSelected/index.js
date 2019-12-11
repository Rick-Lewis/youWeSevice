// page/home/siteSelected/index.js
const app = getApp();
import {
  cities as origSities
} from '../citySelected/city';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, //对应onLoad中的options
    sites: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('siteSelected index.js onLoad', options, app.globalData.orderSubmit);
    wx.setNavigationBarTitle({
      title: options.title,
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let adcodeTemp = options.adcode;
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/store/list',
      data: {
        city: adcodeTemp
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('siteSelected index.js /rentalcars/wechat/store/list success', res);
      this.setData({
        sites: res.data,
        options: options
      });
    }, err => {
      console.log('siteSelected index.js /rentalcars/wechat/store/list failure');
    });
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
  // 选择门店
  handleSelectedItem: function(e) {
    console.log('siteSelected index.js handleSelectedItem', e);
    let targetPages = getCurrentPages().filter(item => item.route === 'page/home/index');
    let subItemTemp = e.currentTarget.dataset.subItem;
    targetPages[0][this.data.options.from + 'Id'] = subItemTemp.id;
    targetPages[0]['repaySiteId'] = subItemTemp.id;
    targetPages[0].setData({ //改变首页的地址选择
      [this.data.options.from]: subItemTemp.name,
      repaySite: subItemTemp.name
    }, () => {
      // app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
      //   [this.data.options.from]: Object.assign({}, app.globalData.orderSubmit[this.data.options.from], {
      //     site: subItemTemp.name,
      //     id: subItemTemp.id
      //   })
      // });
      wx.navigateBack({
        delta: 1 // 表示返回到上一个页面（如果值为2表示回退到上上一个页面）
      });
    });
  },
  handleCall: function(e) {
    console.log('siteSelected index.js handleCall', e);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phoneNumber,
    });
  }
})
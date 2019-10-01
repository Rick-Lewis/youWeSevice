// page/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    tabList: [{
      key: 0,
      name: 'tab0',
      title: '待付款'
    }, {
      key: 1,
      name: 'tab1',
      title: '已付款'
    }, {
      key: 2,
      name: 'tab2',
      title: '已完成'
    }, {
      key: 3,
      name: 'tab3',
      title: '全部'
    }],
    orderList: [1,2,3]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  handleOrderSelect: function() {
    wx.navigateTo({
      url: '/page/order/orderDetail/index',
    });
  },
  handleTabChange: function(e) {
    console.log('order index.js handleTabChange', e);
    this.setData({
      current: e.detail.key
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    setTimeout(() => {
      let randomTemp = Math.round(Math.random() * 10);
      let temp = [];
      for(let i = 0; i < randomTemp; i++){
        temp.push(i);
      }
      this.setData({
        orderList: temp
      }, () => {
        wx.hideLoading();
      });
    }, 2000);
  }
})
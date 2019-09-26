// page/home/carSelected/index.js
const app = getApp();
import {
  cars as origCars
} from '../carSelected/car';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    carList: [],
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('carSelected index.js', options);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let origCarsTemp = origCars.map((item, index) => Object.assign({}, item, {
      id: index
    }));
    this.setData({
      carList: origCarsTemp
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
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    // console.log('carSelected index.js VerticalMain', e);
    let that = this;
    let carList = this.data.carList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < carList.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + carList[i].id);
        view.fields({
          size: true
        }, data => {
          carList[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          carList[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        carList: carList
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < carList.length; i++) {
      if (scrollTop > carList[i].top && scrollTop < carList[i].bottom) {
        that.setData({
          VerticalNavTop: (carList[i].id - 1) * 50,
          TabCur: carList[i].id
        })
        return false
      }
    }
  },
  handleSelectedItem: function(e) {
    console.log('carSelected index.js handleSelectedItem', e);
    wx.navigateTo({
      url: '/page/home/carSelected/carDetail/index',
    });
  }
})
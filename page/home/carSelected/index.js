// page/home/carSelected/index.js
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
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    sites: [],
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('siteSelected index.js', options);
    wx.setNavigationBarTitle({
      title: options.title,
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let storeSite = new Array(26);
    let words = [];
    for (let i = 0; i < 26; i++) {
      words[i] = String.fromCharCode(65 + i);
    }
    words.forEach((item, index) => {
      storeSite[index] = {
        id: index,
        key: item,
        list: []
      }
    });
    origSities.forEach((item) => {
      let firstName = item.pinyin.substring(0, 1);
      let index = words.indexOf(firstName);
      storeSite[index].list.push({
        name: item.name,
        key: firstName
      });
    });
    this.setData({
      sites: storeSite,
      options: options
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
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
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    console.log('siteSelected index.js VerticalMain', e);
    let that = this;
    let sites = this.data.sites;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < sites.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + sites[i].id);
        view.fields({
          size: true
        }, data => {
          sites[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          sites[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        sites: sites
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < sites.length; i++) {
      if (scrollTop > sites[i].top && scrollTop < sites[i].bottom) {
        that.setData({
          VerticalNavTop: (sites[i].id - 1) * 50,
          TabCur: sites[i].id
        })
        return false
      }
    }
  },
  handleSelectedItem: function (e) {
    console.log('siteSelected index.js handleSelectedItem', e);
    let targetPages = getCurrentPages().filter(item => item.route === 'page/home/index');
    targetPages[0].setData({ //改变首页的地址选择
      [this.data.options.from]: !e.currentTarget.dataset.subItem ? e.detail.name : e.currentTarget.dataset.subItem.name
    }, () => {
      wx.navigateBack({
        delta: 1 // 表示返回到上一个页面（如果值为2表示回退到上上一个页面）
      });
    });
  }
})
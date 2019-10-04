// page/home/citySelected/index.js
import {
  cities as origCities
} from './city';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, //对应onLoad中的options
    origCities: [], //未分类的城市列表
    cities: [], //按字母分类的城市列表
    listCur: '', //选择的字母（放大效果显示）
    words: [], //字母表
    hidden: true //选择的字母是否显示，默认不显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('citySelected index.js options', options, app.globalData.orderSubmit);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let storeCity = new Array(22);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/city/all',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('citySelected index.js /rentalcars/wechat/city/all success', res);
      res.data.forEach((item) => {
        let firstName = item.pinyin.substring(0, 1).toUpperCase();
        let index = words.indexOf(firstName);
        storeCity[index].list.push(Object.assign({}, item, {
          key: firstName
        }));
      });
      this.setData({
        origCities: origCities,
        cities: storeCity,
        words: words,
        options: options
      })
    }, err => {
      console.log('citySelected index.js /rentalcars/wechat/city/all failure', err);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('citySelected index.js onReady');
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
      console.log('citySelected index.js onReady boundingClientRect');
      that.setData({
        boxTop: res.top
      })
    }).exec(function(res) {
      console.log('citySelected index.js onReady exec');
    });
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
      console.log('citySelected index.js onReady .indexes boundingClientRect');
      that.setData({
        barTop: res.top
      })
    }).exec(function(res) {
      console.log('citySelected index.js onReady .indexes exec');
      wx.hideLoading();
    });
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
  //获取文字信息
  getCur(e) {
    console.log('citySelected index.js getCur', e);
    this.setData({
      hidden: false,
      listCur: this.data.words[e.target.id],
    })
  },

  setCur(e) {
    console.log('citySelected index.js setCur', e);
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    console.log('citySelected index.js tMove', e);
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.words[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    console.log('citySelected index.js tStart');
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    console.log('citySelected index.js tEnd');
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    console.log('citySelected index.js indexSelect', e);
    let that = this;
    let barHeight = this.data.barHeight;
    let words = this.data.words;
    let scrollY = Math.ceil(words.length * e.detail.y / barHeight);
    for (let i = 0; i < words.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: words[i],
          movableY: i * 20
        })
        return false
      }
    }
  },
  //选择地址
  handleSelectedItem: function(e) {
    console.log('citySelected index.js handleSelectedItem', e);
    let targetPages = getCurrentPages().filter(item => item.route === 'page/home/index');
    let subItemTemp = e.currentTarget.dataset.subItem;
    targetPages[0][this.data.options.from + 'Adcode'] = subItemTemp.code
    targetPages[0].setData({ //改变首页的地址选择
      [this.data.options.from]: subItemTemp.name
    }, () => {
      // app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
      //   [this.data.options.from]: Object.assign({}, app.globalData.orderSubmit[this.data.options.from], {
      //     district: subItemTemp.name,
      //     adcode: subItemTemp.code
      //   })
      // });
      wx.navigateBack({
        delta: 1 // 表示返回到上一个页面（如果值为2表示回退到上上一个页面）
      });
    });
  }
})
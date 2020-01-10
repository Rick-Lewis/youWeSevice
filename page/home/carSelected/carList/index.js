// page/home/carSelected/carList/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    carList: [],
    baseUrl: '',
    currentCategory: '全部',
    categoryList: [],
    currentBrand: '全部',
    brandList: [],
    currentPrice: '全部',
    priceList: [{
      name: '全部',
      priceLower: '',
      priceUpper: ''
    }, {
      name: '0-150',
      priceLower: '0',
      priceUpper: '150'
    }, {
      name: '150-200',
      priceLower: '150',
      priceUpper: '200'
    }, {
      name: '200-250',
      priceLower: '200',
      priceUpper: '250'
    }, {
      name: '250-300',
      priceLower: '250',
      priceUpper: '300'
    }, {
      name: '300-350',
      priceLower: '300',
      priceUpper: '350'
    }, {
      name: '350-400',
      priceLower: '350',
      priceUpper: '400'
    }],
    maskVisible: false,
    ani1: null,
    sort: 'desc',
    queryStr: '', //过滤车型的基本条件
    sortQueryStr: '', //排序过滤车型的条件
    otherQueryStr: '' //其他过滤车型的条件
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      baseUrl: app.globalData.baseUrl,
      queryStr: '?store_id=' + options.store_id + '&start_time=' + options.start_time + '&end_time=' + options.end_time
    });
    //获取车辆分类标签信息
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/model/list?store_id=' + options.store_id + '&start_time=' + options.start_time + '&end_time=' + options.end_time,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carList index.js onLoad /wechat/vehicle/model/list success', res);
      this.setData({
        carList: res.data
      });
    }, err => {
      console.log('carList index.js onLoad /wechat/vehicle/model/list failure', err);
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/category/list',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carList index.js onLoad /wechat/vehicle/category/list success', res);
      this.setData({
        categoryList: [{
          name: '全部',
          id: -2
        }, ...res.data]
      });
    }, err => {
      console.log('carList index.js onLoad /wechat/vehicle/category/list failure', err);
    });
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/brand/list',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carList index.js onLoad /wechat/vehicle/brand/list success', res);
      this.setData({
        brandList: [{
          name: '全部',
          id: -2
        }, ...res.data]
      });
    }, err => {
      console.log('carList index.js onLoad /wechat/vehicle/brand/list failure', err);
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    wx.hideLoading();
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
  // 选择车辆回调
  handleSelectedItem: function(e) {
    console.log('carSelected index.js handleSelectedItem', e);
    if (e.currentTarget.dataset.subItem.num > 0) {
      app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
        carDetail: e.currentTarget.dataset.subItem
      });
      wx.navigateTo({
        url: '/page/home/carSelected/preOrderDetail/index',
      });
    } else {
      wx.showToast({
        title: '无可用车辆',
        icon: 'none'
      });
    }
  },
  // 筛选
  handleFilter: function() {
    var animation1 = wx.createAnimation();
    if (this.data.maskVisible) {
      animation1.translateY(-473).step();
    } else {
      animation1.translateY(0).step();
    }
    this.setData({
      maskVisible: !this.data.maskVisible,
      ani1: animation1.export()
    });
  },
  // 价格排序
  priceSort: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    console.log('carList index.js handleFilterConfirm');
    let strTemp = this.data.queryStr;
    let sortStrTemp = '&sortField=standard_price&sortOrder=' + this.data.sort;
    strTemp = strTemp + this.data.otherQueryStr + sortStrTemp;
    //获取车辆分类标签信息
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/model/list' + strTemp,
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carList index.js onLoad /wechat/vehicle/model/list success', res);
      this.setData({
        carList: res.data
      });
      wx.hideLoading();
    }, err => {
      console.log('carList index.js onLoad /wechat/vehicle/model/list failure', err);
      wx.hideLoading();
    });
    this.setData({
      sortQueryStr: sortStrTemp
    });
  },
  // 筛选选择
  handleRadioChange: function(e) {
    console.log('carList index.js handleRadioChange', e, this.data.categoryList);
    switch (e.currentTarget.dataset.from) {
      case 'category':
        this.setData({
          currentCategory: e.detail.value
        });
        break;
      case 'brand':
        this.setData({
          currentBrand: e.detail.value
        });
        break;
      case 'price':
        this.setData({
          currentPrice: e.detail.value
        });
        break;
    }
  },
  // 筛选确定
  handleFilterConfirm: function() {
    this.handleFilter();
    setTimeout(() => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      console.log('carList index.js handleFilterConfirm');
      let strTemp = this.data.queryStr;
      let temp1 = null;
      if (this.data.currentCategory && this.data.currentCategory !== '全部') {
        temp1 = this.data.categoryList.find(item => item.name === this.data.currentCategory);
        strTemp = strTemp + '&category_id=' + temp1.id;
      }
      if (this.data.currentBrand && this.data.currentBrand !== '全部') {
        temp1 = this.data.brandList.find(item => item.name === this.data.currentBrand);
        strTemp = strTemp + '&brand_id=' + temp1.id;
      }
      if (this.data.currentPrice && this.data.currentPrice !== '全部') {
        temp1 = this.data.priceList.find(item => item.name === this.data.currentPrice);
        strTemp = strTemp + '&price_lower=' + temp1.priceLower + '&price_upper=' + temp1.priceUpper;
      }
      strTemp = strTemp + this.data.sortQueryStr;
      //获取车辆分类标签信息
      app.httpInterceptor({
        url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/model/list' + strTemp,
        header: {
          'content-type': 'application/json',
          'token': app.globalData.token
        },
        method: 'GET'
      }).then(res => {
        console.log('carList index.js onLoad /wechat/vehicle/model/list success', res);
        this.setData({
          carList: res.data
        });
        wx.hideLoading();
      }, err => {
        console.log('carList index.js onLoad /wechat/vehicle/model/list failure', err);
        wx.hideLoading();
      });
    }, 500);
  },
  handleReset: function() {
    this.setData({
      currentCategory: '全部',
      currentBrand: '全部',
      currentPrice: '全部'
    });
  }
})
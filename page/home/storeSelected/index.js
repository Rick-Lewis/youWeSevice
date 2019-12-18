// page/home/storeSelected/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    mainCur: 0,
    verticalNavTop: 0,
    carList: [],
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('carSelected index.js', options, app.globalData.orderSubmit);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    //获取车辆分类标签信息
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/vehicle/model/list',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('carSelected index.js onLoad /rentalcars/wechat/vehicle/tag/all success', res);
      let carList = [];
      for (let i = 0; i < res.data.length; i++) {
        if (carList.length === 0) { // 写入第一个元素
          let carItem = {
            category_name: '',
            list: []
          }
          carItem.category_name = res.data[i].category_name;
          carItem.list.push(res.data[i]);
          carList.push(carItem);
        } else {
          let indexTemp = carList.findIndex(item => item.category_name === res.data[i].category_name);
          if (indexTemp !== -1) {
            carList[indexTemp].list.push(res.data[i]);
          } else {
            let carItem = {
              category_name: '',
              list: []
            }
            carItem.category_name = res.data[i].category_name;
            carItem.list.push(res.data[i]);
            carList.push(carItem);
          }
        }
      };
      this.setData({
        carList: carList
      });
    }, err => {
      console.log('carSelected index.js onLoad /rentalcars/wechat/vehicle/tag/all failure', err);
    });
    // let origCarsTemp = origCars.map((item, index) => Object.assign({}, item, {
    //   id: index
    // }));
    // this.setData({
    //   carList: origCarsTemp
    // });
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
  // tab切换
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      mainCur: e.currentTarget.dataset.id,
      verticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  // 页面右边内容滚动事件回调
  verticalMain(e) {
    // console.log('carSelected index.js verticalMain', e);
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
          verticalNavTop: (carList[i].id - 1) * 50,
          tabCur: carList[i].id
        })
        return false
      }
    }
  },
  // 选择车辆回调
  handleSelectedItem: function (e) {
    console.log('carSelected index.js handleSelectedItem', e);
    app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
      carDetail: e.currentTarget.dataset.subItem
    });
    wx.navigateTo({
      url: '/page/home/carSelected/preOrderDetail/index',
    });
  }
})
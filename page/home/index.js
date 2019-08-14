// page/home/index.js
Page({
  keys: 'SGXBZ-6X3K6-NYLSF-MALZD-QC6PK-BABOS',
  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log('home index.js onLoad wx.getLocation success', res);
        this.getDistrict(res.latitude, res.longitude);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  getDistrict: function(latitude, longitude) {
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${this.keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        console.log('home index.js getDistrict success', res);
        // 省
        let province = res.data.result.address_component.province;
        // 市
        let city = res.data.result.address_component.city;
        // 区
        let district = res.data.result.address_component.district;
        this.setData({
          region: [province, city, district]
        })
      }
    })
  },
  handleSelectCar: function(e){
    console.log('home index.js handleSelectCar', e);
  }
})
// page/home/index.js
Page({
  keys: 'SGXBZ-6X3K6-NYLSF-MALZD-QC6PK-BABOS',
  weeks: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  /**
   * 页面的初始数据
   */
  data: {
    region: [], //用户所在的[省, 市, 区]
    fetchCity: '请选择城市', //用户设置的取车城市
    fetchSite: '请选择门店', //用户设置的取车门店
    repayCity: '请选择城市', //用户设置的还车城市
    repaySite: '请选择门店', //用户设置的还车门店
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
    }],
    modalVisible: false, //选择时间模态框显示与否，true为显示
    timeArray: [],
    startIndex: [0, 0],
    endIndex: [0,0],
    duration: {
      days: 0,
      hours: 0,
      minutes: 0
    },
    current: 'carRental',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log('home index.js onLoad wx.getLocation success', res);
        this.getDistrict(res.latitude, res.longitude);
      }
    });
    let temp = this.initTimeArray();
    this.setData({
      timeArray: temp
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
  //将坐标转换成地址
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
        this.setData({ //初始化相关信息为用户当前所在地址
          region: [province, city, district],
          fetchCity: city,
          repayCity: city
        })
      }
    })
  },
  //选择去送车地址
  handleSelectSite: function(e) {
    console.log('home index.js handleSelectCar', e);
    switch (e.currentTarget.dataset.name) {
      case 'fetchCity':
        wx.navigateTo({
          url: '/page/home/citySelected/index?from=fetchCity',
        });
        break;
      case 'fetchSite':
        wx.navigateTo({
          url: '/page/home/siteSelected/index?from=fetchSite&title=' + this.data.fetchCity,
        });
        break;
      case 'repayCity':
        wx.navigateTo({
          url: '/page/home/citySelected/index?from=repayCity',
        });
        break;
      case 'repaySite':
        wx.navigateTo({
          url: '/page/home/siteSelected/index?from=repaySite&title=' + this.data.repayCity,
        });
        break;
    }
  },
  //去选车
  handleSelectCar: function(e) {
    console.log('home index.js handleSelectCar', e);
    wx.navigateTo({
      url: '/page/home/carSelected/index',
    });
  },
  //初始化租车日期选择组件数据
  initTimeArray: function() {
    console.log('home index.js initTimeArray');
    let today = new Date();
    let dateTemp = [],
      timeTemp = [],
      result = [];
    for (let i = 0; i < 60; i++) { //未来60天日期的初始化
      let someday = new Date(); //每次循环初始化，保证未来第i天都是相对于当前日期
      someday.setDate(today.getDate() + i); //未来第i天
      let yearTemp = someday.getFullYear();
      let monthTemp = someday.getMonth() + 1;
      let dayTemp = someday.getDate();
      let weekTemp = this.weeks[someday.getDay()];
      let textTemp = ('0' + monthTemp).slice(-2) + '月' + ('0' + dayTemp).slice(-2) + '日 ';
      dateTemp.push({
        year: yearTemp,
        month: monthTemp,
        day: dayTemp,
        week: weekTemp,
        text: textTemp
      })
    }
    result.push(dateTemp);
    for (let i = 8; i < 22; i++) { //初始化时间
      for (let j = 0; j < 2; j++) {
        let hourTemp = i;
        let minuteTemp = j * 30;
        let textTemp = ('0' + hourTemp).slice(-2) + ':' + ('0' + minuteTemp).slice(-2);
        timeTemp.push({
          hour: hourTemp,
          minute: minuteTemp,
          text: textTemp
        });
      }
    }
    result.push(timeTemp);
    return result;
  },
  bindStartPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startIndex: e.detail.value
    }, () => {
      let startTemp = Object.assign({}, this.data.timeArray[0][this.data.startIndex[0]], this.data.timeArray[1][this.data.startIndex[1]]);
      let endTemp = Object.assign({}, this.data.timeArray[0][this.data.endIndex[0]], this.data.timeArray[1][this.data.endIndex[1]]);
      let temp = this.calcDuration(startTemp, endTemp);
      this.setData({
        duration: temp
      })
    });
  },
  bindStartMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  bindEndPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endIndex: e.detail.value
    }, () => {
      let startTemp = Object.assign({}, this.data.timeArray[0][this.data.startIndex[0]], this.data.timeArray[1][this.data.startIndex[1]]);
      let endTemp = Object.assign({}, this.data.timeArray[0][this.data.endIndex[0]], this.data.timeArray[1][this.data.endIndex[1]]);
      let temp = this.calcDuration(startTemp, endTemp);
      this.setData({
        duration: temp
      })
    });
  },
  bindEndMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  calcDuration: function(start, end){
    console.log('home index.js calcDuration', start, end);
    let result =  {
      days: 0,
      hours: 0,
      minutes: 0
    };
    let startDate = new Date(start.year, start.month, start.day);
    let endDate = new Date(end.year, end.month, end.day);
    let durTimestamp = (endDate.getTime() - startDate.getTime()) / 1000 + (Number(end.hour * 3600) + Number(end.minute * 60) - (Number(start.hour * 3600) + Number(start.minute * 60)));
    let daysTemp = parseInt(durTimestamp / (3600 * 24));
    let hoursTemp = parseInt((durTimestamp - daysTemp * 3600 *24)/3600);
    let minutesTemp = parseInt((durTimestamp - daysTemp * 3600 * 24 - hoursTemp * 3600) / 60);
    result = Object.assign({}, result, {
      days: daysTemp,
      hours: hoursTemp,
      minutes: minutesTemp
    });
    return result;
  },
  handleChange({ detail }) {
    console.log('home index.js handleChange detail', detail);
    this.setData({
      current: detail.key
    });
  }
})
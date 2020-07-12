// page/home/index.js
const app = getApp();
Page({
  keys: 'SGXBZ-6X3K6-NYLSF-MALZD-QC6PK-BABOS',
  weeks: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  fetchDistrictAdcode: '', // 取车地区码
  repayDistrictAdcode: '', // 还车地区码
  fetchSiteId: '', // 取车门店码
  repaySiteId: '', // 还车门店码
  /**
   * 页面的初始数据
   */
  data: {
    // region: [], // 用户所在的[省, 市, 区]
    fetchDistrict: '请选择城市', //用户设置的取车城市
    fetchSite: '请选择门店', //用户设置的取车门店
    repayDistrict: '请选择城市', //用户设置的还车城市
    repaySite: '请选择门店', //用户设置的还车门店
    swiperList: [],
    modalVisible: false, //选择时间模态框显示与否，true为显示
    timeArray: [], //日期picker组件数据源
    startIndex: [0, 4], //开始时间选中的picker组件对应的下标
    endIndex: [2, 4], //结束时间选中的picker组件对应的下标
    duration: { //租车时间
      days: 2,
      hours: 0,
      minutes: 0
    },
    current: 'carRental',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取用户信息
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/banner/list',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('home index.js onLoad /rentalcars/wechat/banner/list success', res);
      this.setData({
        swiperList: res.data
      });
    }, err => {
      console.log('home index.js onLoad /rentalcars/wechat/banner/list failure', err);
    });
    //获取用户信息
    app.httpInterceptor({
      url: app.globalData.baseUrl + '/rentalcars/wechat/info/user',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      method: 'GET'
    }).then(res => {
      console.log('home index.js onLoad /rentalcars/wechat/info/user success', res);
      app.globalData.userInfo = res.data.data;
      if (!!app.globalData.userInfo.telephone) {
        app.globalData.isPhoneAuth = true;
      }
      if (!!app.globalData.userInfo.nickName) {
        app.globalData.isUserInfoAuth = true;
      }
    }, err => {
      console.log('home index.js onLoad /rentalcars/wechat/info/user failure', err);
    });
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log('home index.js onLoad wx.getLocation success', res);
        this.getDistrict(res.latitude, res.longitude);
      }
    });
    let temp = this.initTimeArray();
    let indexTemp = this.initTimeIndex(temp);
    let indexTemp1 = this.data.startIndex[0];
    let indexTemp2 = this.data.endIndex[0];
    if (indexTemp === -1) {
      indexTemp = this.data.startIndex[1];
    }
    app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
      fetchTime: {
        day: temp[0][indexTemp1],
        time: temp[1][indexTemp]
      },
      repayTime: {
        day: temp[0][indexTemp2],
        time: temp[1][indexTemp]
      }
    });
    this.setData({
      timeArray: temp,
      baseUrl: app.globalData.baseUrl,
      startIndex: [indexTemp1, indexTemp],
      endIndex: [indexTemp2, indexTemp]
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
        let province = res.data.result.ad_info.province;
        // 市
        let city = res.data.result.ad_info.city;
        // 区
        let district = res.data.result.ad_info.city;
        // this.fetchDistrictAdcode = res.data.result.ad_info.adcode;
        // this.repayDistrictAdcode = res.data.result.ad_info.adcode;
        app.httpInterceptor({
          url: app.globalData.baseUrl + '/rentalcars/wechat/district/city/' + res.data.result.ad_info.adcode,
          header: {
            'content-type': 'application/json',
            'token': app.globalData.token
          },
          method: 'GET'
        }).then(res => {
          console.log('home index.js onLoad /rentalcars/wechat/district/city/{code} success', res);
          this.fetchDistrictAdcode = res.data.code;
          this.repayDistrictAdcode = res.data.code;
        }, err => {
          console.log('home index.js onLoad /rentalcars/wechat/district/city/{code} failure', err);
        });
        if (district) {
          this.setData({ //初始化相关信息为用户当前所在地址
            // region: [province, city, district],
            fetchDistrict: district,
            repayDistrict: district
          });
        }
      }
    })
  },
  //选择取送车地址
  handleSelectSite: function(e) {
    console.log('home index.js handleSelectCar', e);
    switch (e.currentTarget.dataset.name) {
      case 'fetchDistrict':
        wx.navigateTo({
          url: '/page/home/citySelected/index?from=fetchDistrict',
        });
        break;
      case 'fetchSite':
        if (!this.data.fetchDistrict || this.data.fetchDistrict === '请选择城市') {
          wx.showToast({
            title: '请选择城市',
            icon: 'none'
          });
          return;
        }
        // wx.navigateTo({
        //   url: '/page/home/siteSelected/index?from=fetchSite&title=' + this.data.fetchDistrict + '&adcode=' + this.fetchDistrictAdcode,
        // });
        wx.navigateTo({
          url: '/page/home/storeSelected/index?from=fetchSite&title=' + this.data.fetchDistrict + '&adcode=' + this.fetchDistrictAdcode,
        });
        break;
      case 'repayDistrict':
        // wx.navigateTo({
        //   url: '/page/home/citySelected/index?from=repayDistrict',
        // });
        break;
      case 'repaySite':
        // wx.navigateTo({
        //   url: '/page/home/siteSelected/index?from=repaySite&title=' + this.data.repayDistrict + '&adcode=' + this.repayDistrictAdcode,
        // });
        break;
    }
  },
  //立即选车
  handleSelectCar: function(e) {
    console.log('home index.js handleSelectCar', e);
    if (this.data.fetchDistrict && this.data.fetchDistrict !== '请选择城市' && this.data.repayDistrict && this.data.repayDistrict !== '请选择城市' && this.data.fetchSite && this.data.fetchSite !== '请选择门店' && this.data.repaySite && this.data.repaySite !== '请选择门店' && (this.data.duration.days >= 0 && this.data.duration.hours >= 0 && this.data.duration.minutes >= 0) && !(this.data.duration.days === 0 && this.data.duration.hours === 0 && this.data.duration.minutes === 0)) { // 表单选择完成
      let nowTemp = new Date();
      if (nowTemp.getFullYear() === this.data.timeArray[0][this.data.startIndex[0]].year && (nowTemp.getMonth() + 1) === this.data.timeArray[0][this.data.startIndex[0]].month && nowTemp.getDate() === this.data.timeArray[0][this.data.startIndex[0]].day) { //当天
        let sum = nowTemp.getHours() * 100 + nowTemp.getMinutes();
        let selSum = this.data.timeArray[1][this.data.startIndex[1]].hour * 100 + this.data.timeArray[1][this.data.startIndex[1]].minute;
        if (sum + 200 < 2130 && selSum - sum < 200) { //当前时间后2个小时小于9点半且选择的时间与当前的时间间隔小于2小时，提示
          wx.showToast({
            title: '租车开始时间应早于当前时间2小时',
            icon: 'none'
          });
          return;
        }
      }
      if (this.data.duration.days >= 29) {
        wx.showToast({
          title: '租车时间不能大于29天',
          icon: 'none'
        });
        return;
      }
      app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
        fetchDistrict: {
          district: this.data.fetchDistrict,
          adcode: this.fetchDistrictAdcode
        },
        fetchSite: {
          site: this.data.fetchSite,
          id: this.fetchSiteId
        },
        repayDistrict: {
          district: this.data.repayDistrict,
          adcode: this.repayDistrictAdcode
        },
        repaySite: {
          site: this.data.repaySite,
          id: this.repaySiteId
        },
        fetchTime: {
          day: this.data.timeArray[0][this.data.startIndex[0]],
          time: this.data.timeArray[1][this.data.startIndex[1]]
        },
        repayTime: {
          day: this.data.timeArray[0][this.data.endIndex[0]],
          time: this.data.timeArray[1][this.data.endIndex[1]]
        },
        duration: this.data.duration
      });
      let startTimeTemp = '' + this.data.timeArray[0][this.data.startIndex[0]].year + '-' + this.data.timeArray[0][this.data.startIndex[0]].month + '-' + this.data.timeArray[0][this.data.startIndex[0]].day + ' ' + this.data.timeArray[1][this.data.startIndex[1]].text;
      let endTimeTemp = '' + this.data.timeArray[0][this.data.endIndex[0]].year + '-' + this.data.timeArray[0][this.data.endIndex[0]].month + '-' + this.data.timeArray[0][this.data.endIndex[0]].day + ' ' + this.data.timeArray[1][this.data.endIndex[1]].text;
      wx.navigateTo({
        url: '/page/home/carSelected/carList/index?store_id=' + this.fetchSiteId + '&start_time=' + startTimeTemp + '&end_time=' + endTimeTemp,
      });
    } else {
      if (!this.data.fetchDistrict || this.data.fetchDistrict === '请选择城市' || !this.data.repayDistrict || this.data.repayDistrict === '请选择城市') {
        wx.showToast({
          title: '请选择相应的城市信息',
          icon: 'none'
        });
      } else if (!this.data.fetchSite || this.data.fetchSite === '请选择门店' || !this.data.repaySite || this.data.repaySite === '请选择门店') {
        wx.showToast({
          title: '请选择相应的门店信息',
          icon: 'none'
        });
      } else if ((this.data.duration.days === 0 && this.data.duration.hours === 0 && this.data.duration.minutes === 0) || (this.data.duration.days < 0 || this.data.duration.hours === 0 && this.data.duration.minutes === 0)) {
        wx.showToast({
          title: '选择的时间需要大于0',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: '请填写相关信息',
          icon: 'none'
        });
      }
    }
    // wx.navigateTo({
    //   url: '/page/home/carSelected/index',
    // });
  },
  //初始化租车日期选择组件数据
  initTimeArray: function() {
    console.log('home index.js initTimeArray');
    let today = new Date();
    let tenToday = new Date(new Date(new Date().toLocaleDateString()).getTime() + (21.5 - 2) * 60 * 60 * 1000); //当天21点30
    let dateTemp = [],
      timeTemp = [],
      result = [],
      i = 0,
      sum = 60; //可选天数
    if (today > tenToday) { //晚于当天结束前两小时，从下一天开始计算时间
      i = 1;
      sum = sum + i;
    }
    for (; i < sum; i++) { //未来60天日期的初始化
      let someday = new Date(); //每次循环初始化，保证未来第i天都是相对于当前日期
      someday.setDate(today.getDate() + i); //未来第i天
      let yearTemp = someday.getFullYear();
      let monthTemp = ('0' + (someday.getMonth() + 1)).slice(-2);
      let dayTemp = ('0' + someday.getDate()).slice(-2);
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
  // 开始时间选择
  bindStartPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth() + 1;
    let nowDate = now.getDate();
    let selectedYear = parseInt(this.data.timeArray[0][e.detail.value[0]].year);
    let selectedMonth = parseInt(this.data.timeArray[0][e.detail.value[0]].month);
    let selectedDay = parseInt(this.data.timeArray[0][e.detail.value[0]].day);
    if (selectedYear === nowYear && selectedMonth === nowMonth && selectedDay === nowDate) { //选择的时间要大于当前时间
      let nowHours = now.getHours();
      let nowMinutes = now.getMinutes();
      let total = nowHours * 60 + nowMinutes;
      let selectedTimes = this.data.timeArray[1][e.detail.value[1]];
      let selectedTotal = selectedTimes.hour * 60 + selectedTimes.minute;
      if (selectedTotal < total) {
        wx.showToast({
          title: '选择的开始时间不能早于当前时间',
          icon: 'none'
        });
        return;
      }
    }
    //租期大于29天
    if ((e.detail.value[1] >= this.data.endIndex[1] && (e.detail.value[0] + 29) < this.data.endIndex[0]) || (e.detail.value[1] < this.data.endIndex[1] && (e.detail.value[0] + 28) < this.data.endIndex[0])) {
      wx.showToast({
        title: '租车时间应小于30天',
        icon: 'none'
      });
      return;
    }
    //开始时间大于结束时间，结束时间往后+2
    if (e.detail.value[0] > this.data.endIndex[0]) {
      this.setData({
        endIndex: [e.detail.value[0] + 2, e.detail.value[1]]
      });
    } else if (e.detail.value[0] === this.data.endIndex[0] && e.detail.value[1] >= this.data.endIndex[1]) {
      this.setData({
        endIndex: [e.detail.value[0] + 2, e.detail.value[1]]
      });
    }
    this.setData({
      startIndex: e.detail.value
    }, () => {
      let startTemp = Object.assign({}, this.data.timeArray[0][this.data.startIndex[0]], this.data.timeArray[1][this.data.startIndex[1]]);
      let endTemp = Object.assign({}, this.data.timeArray[0][this.data.endIndex[0]], this.data.timeArray[1][this.data.endIndex[1]]);
      let temp = this.calcDuration(startTemp, endTemp);
      this.setData({
        duration: temp
      });
    });
  },
  bindStartMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column === 0 && e.detail.value === 0) { //不允许选择当前时间之前的时间
    }
  },
  // 结束时间选择
  bindEndPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //租期大于29天
    if ((e.detail.value[1] <= this.data.startIndex[1] && (e.detail.value[0] - 29) > this.data.startIndex[0]) || (e.detail.value[1] > this.data.startIndex[1] && (e.detail.value[0] - 28) > this.data.startIndex[0])) {
      wx.showToast({
        title: '租车时间应小于30天',
        icon: 'none'
      });
      return;
    }
    if (e.detail.value[0] < this.data.startIndex[0] && e.detail.value[1] < this.data.startIndex[1]){
      wx.showToast({
        title: '选择的结束时间不能早于开始时间',
        icon: 'none'
      });
      return;
    }
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
  bindEndMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  // 计算时间间隔
  calcDuration: function(start, end) {
    console.log('home index.js calcDuration', start, end);
    let result = {
      days: 0,
      hours: 0,
      minutes: 0
    };
    let startDate = new Date(start.year, start.month, start.day);
    let endDate = new Date(end.year, end.month, end.day);
    let durTimestamp = (endDate.getTime() - startDate.getTime()) / 1000 + (Number(end.hour * 3600) + Number(end.minute * 60) - (Number(start.hour * 3600) + Number(start.minute * 60)));
    let daysTemp = parseInt(durTimestamp / (3600 * 24));
    let hoursTemp = parseInt((durTimestamp - daysTemp * 3600 * 24) / 3600);
    let minutesTemp = parseInt((durTimestamp - daysTemp * 3600 * 24 - hoursTemp * 3600) / 60);
    result = Object.assign({}, result, {
      days: daysTemp,
      hours: daysTemp === 0 ? hoursTemp : Math.abs(hoursTemp),
      minutes: daysTemp === 0 && hoursTemp === 0 ? minutesTemp : Math.abs(minutesTemp)
    });
    return result;
  },
  // tab切换
  handleChange({
    detail
  }) {
    console.log('home index.js handleChange detail', detail);
    this.setData({
      current: detail.key
    });
  },
  handleToWeb(e) {
    console.log('home index.js handleToWeb', e);
    wx.navigateTo({
      url: '/page/web/web?url=' + e.currentTarget.dataset.item,
    });
  },
  initTimeIndex(val) { //租车时间限制，当前之后两小时
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let result;
    if (minutes / 30 > 1) { //大于30分钟，则默认小时+1
      result = val[1].findIndex(item => item.hour === (hours + 3) && item.minute === 0);
    } else {
      result = val[1].findIndex(item => item.hour === (hours + 2) && item.minute === 30);
    }
    return result;
  }
})
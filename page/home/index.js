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
    timeStartArray: [], //日期picker组件数据源
    startConfig: null,
    timeEndArray: [], //日期picker组件数据源
    endConfig: null,
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
    this.init();
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
  init: function(startConfig, endConfig){
    let timeStartTemp;
    if (startConfig){
      timeStartTemp = this.initTimeArray(startConfig);
    }else{
      timeStartTemp = this.initTimeArray();
    }
    
    let indexTempStart = this.initTimeIndex(timeStartTemp);
    let indexTemp1 = this.data.startIndex[0];
    if (indexTempStart === -1) {
      indexTempStart = this.data.startIndex[1];
    }
    let indexTemp2 = this.data.endIndex[0];
    let tempStr = timeStartTemp[0][indexTemp2].year + '-' + timeStartTemp[0][indexTemp2].month + '-' + timeStartTemp[0][indexTemp2].day;
    let timeEndTemp;
    if (endConfig) {
      timeEndTemp = this.initTimeArray(Object.assign({}, { date: tempStr, isBeginFromNextDay: true }, endConfig));
    } else {
      timeEndTemp = this.initTimeArray({ date: tempStr, isBeginFromNextDay: true });
    }
    let indexTempEnd = timeEndTemp[1].length - (timeStartTemp[1].length - indexTempStart)
    app.globalData.orderSubmit = Object.assign({}, app.globalData.orderSubmit, {
      fetchTime: {
        day: timeStartTemp[0][indexTemp1],
        time: timeStartTemp[1][indexTempStart]
      },
      repayTime: {
        day: timeEndTemp[0][indexTemp2],
        time: timeEndTemp[1][indexTempEnd]
      }
    });

    this.setData({
      timeStartArray: timeStartTemp,
      timeEndArray: timeEndTemp,
      baseUrl: app.globalData.baseUrl,
      startIndex: [indexTemp1, indexTempStart],
      endIndex: [indexTemp2, indexTempEnd]
    });
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
    if (this.data.fetchDistrict && this.data.fetchDistrict !== '请选择城市' && this.data.repayDistrict && this.data.repayDistrict !== '请选择城市' && this.data.fetchSite && this.data.fetchSite !== '请选择门店' && this.data.repaySite && this.data.repaySite !== '请选择门店') { // 表单选择完成
      // let nowTemp = new Date();
      // if (nowTemp.getFullYear() === this.data.timeArray[0][this.data.startIndex[0]].year && (nowTemp.getMonth() + 1) === this.data.timeArray[0][this.data.startIndex[0]].month && nowTemp.getDate() === this.data.timeArray[0][this.data.startIndex[0]].day) { //当天
      //   let sum = nowTemp.getHours() * 100 + nowTemp.getMinutes();
      //   let selSum = this.data.timeArray[1][this.data.startIndex[1]].hour * 100 + this.data.timeArray[1][this.data.startIndex[1]].minute;
      //   if (sum + 200 < 2130 && selSum - sum < 200) { //当前时间后2个小时小于9点半且选择的时间与当前的时间间隔小于2小时，提示
      //     wx.showToast({
      //       title: '租车开始时间应早于当前时间2小时',
      //       icon: 'none'
      //     });
      //     return;
      //   }
      // }
      // if (this.data.duration.days >= 29) {
      //   wx.showToast({
      //     title: '租车时间不能大于29天',
      //     icon: 'none'
      //   });
      //   return;
      // }
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
          day: this.data.timeStartArray[0][this.data.startIndex[0]],
          time: this.data.timeStartArray[1][this.data.startIndex[1]]
        },
        repayTime: {
          day: this.data.timeEndArray[0][this.data.endIndex[0]],
          time: this.data.timeEndArray[1][this.data.endIndex[1]]
        },
        duration: this.data.duration
      });
      let startTimeTemp = '' + this.data.timeStartArray[0][this.data.startIndex[0]].year + '-' + this.data.timeStartArray[0][this.data.startIndex[0]].month + '-' + this.data.timeStartArray[0][this.data.startIndex[0]].day + ' ' + this.data.timeStartArray[1][this.data.startIndex[1]].text;
      let endTimeTemp = '' + this.data.timeEndArray[0][this.data.endIndex[0]].year + '-' + this.data.timeEndArray[0][this.data.endIndex[0]].month + '-' + this.data.timeEndArray[0][this.data.endIndex[0]].day + ' ' + this.data.timeEndArray[1][this.data.endIndex[1]].text;
      wx.navigateTo({
        url: '/page/home/carSelected/carList/index?store_id=' + this.fetchSiteId + '&time_start=' + startTimeTemp + '&time_end=' + endTimeTemp,
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
      } 
      // else if ((this.data.duration.days === 0 && this.data.duration.hours === 0 && this.data.duration.minutes === 0) || (this.data.duration.days < 0 || this.data.duration.hours === 0 && this.data.duration.minutes === 0)) {
      //   wx.showToast({
      //     title: '选择的时间需要大于0',
      //     icon: 'none'
      //   });
      // } 
      else {
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
  initTimeArray: function (options) { //date = 'xxxx-xx-xx'
    console.log('home index.js initTimeArray', options);
    let startHour = (options && options.startHour) || 8, startMinute = (options && options.startMinute) || 0, endHour = (options && options.endHour) || 22, endMinute = (options && options.endMinute) || 0;
    let today = new Date();
    let endToday = new Date(new Date(new Date().toLocaleDateString()).getTime() + (endHour + (endMinute/60) - 2) * 60 * 60 * 1000); //当天endTime
    let dateTemp = [],
      timeTemp = [],
      result = [],
      i = 0,
      sum = 60; //可选天数
    if ((options && options.isBeginFromNextDay) || today > endToday) { //当前时间晚于当天结束前两小时，从下一天开始计算时间
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
    let startHourTemp = startMinute < 30 ? startHour : (startHour + 1);
    let startMinuteTemp = startMinute < 30 && startMinute > 0 ? 1 : 0;
    if (options && options.date && new Date(options.date).toDateString() === new Date().toDateString() && today < endToday) { //当前时间早于结束时间前两小时
      startHourTemp = today.getMinutes() < 30 ? today.getHours() : (today.getHours() + 1);
      startMinuteTemp = today.getMinutes() < 30 && today.getMinutes() > 0 ? 1 : 0;
    } else if (options && !options.date && today < endToday){
      startHourTemp = today.getMinutes() < 30 ? today.getHours() : (today.getHours() + 1);
      startMinuteTemp = today.getMinutes() < 30 && today.getMinutes() > 0 ? 1 : 0;
    }
    for (let i = startHourTemp; i <= endHour; i++) { //初始化时间
      for (let j = i === startHourTemp ? startMinuteTemp : 0; j < (i === endHour ? 1 : 2); j++) {
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
    let dateObj = this.data.timeStartArray[0][e.detail.value[0]];
    let timeObj = this.data.timeStartArray[1][e.detail.value[1]];
    let startTimestamp = new Date(dateObj.year + '-' + dateObj.month + '-' + dateObj.day + ' ' + timeObj.text).getTime();
    let timestampTemp = 29 * 24 * 60 * 60 * 1000 * 1000;

    dateObj = this.data.timeEndArray[0][this.data.endIndex[0]];
    timeObj = this.data.timeEndArray[1][this.data.endIndex[1]];
    let endTimestamp = new Date(dateObj.year + '-' + dateObj.month + '-' + dateObj.day + ' ' + timeObj.text).getTime();
    if (startTimestamp > endTimestamp) {
      wx.showToast({
        title: '选择的开始时间需早于结束时间',
        icon: 'none'
      });
      return;
    }
    
    //租期大于29天
    if (endTimestamp - startTimestamp > timestampTemp) {
      wx.showToast({
        title: '租车时间应小于30天',
        icon: 'none'
      });
      return;
    }
    //开始时间大于结束时间，结束时间往后+2
    // if (e.detail.value[0] > this.data.endIndex[0]) {
    //   this.setData({
    //     endIndex: [e.detail.value[0] + 2, e.detail.value[1]]
    //   });
    // } else if (e.detail.value[0] === this.data.endIndex[0] && e.detail.value[1] >= this.data.endIndex[1]) {
    //   this.setData({
    //     endIndex: [e.detail.value[0] + 2, e.detail.value[1]]
    //   });
    // }
    this.setData({
      startIndex: e.detail.value
    }, () => {
      let startTemp = Object.assign({}, this.data.timeStartArray[0][this.data.startIndex[0]], this.data.timeStartArray[1][this.data.startIndex[1]]);
      let endTemp = Object.assign({}, this.data.timeStartArray[0][this.data.endIndex[0]], this.data.timeStartArray[1][this.data.endIndex[1]]);
      let temp = this.calcDuration(startTemp, endTemp);
      this.setData({
        duration: temp
      });
    });
  },
  bindStartMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column === 0) {
      let temp = this.data.timeStartArray[e.detail.column][e.detail.value];
      let tempStr = temp.year + '-' + temp.month + '-' + temp.day;
      let tempTimeArray = this.initTimeArray(Object.assign({}, { date: tempStr}, this.data.startConfig));
      this.setData({
        timeStartArray: tempTimeArray
      })
    }
  },
  // 结束时间选择
  bindEndPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let dateObj = this.data.timeEndArray[0][e.detail.value[0]];
    let timeObj = this.data.timeEndArray[1][e.detail.value[1]];
    let endTimestamp = new Date(dateObj.year + '-' + dateObj.month + '-' + dateObj.day + ' ' + timeObj.text).getTime();
    let timestampTemp = 29 * 24 * 60 * 60 * 1000 * 1000;
    
    dateObj = this.data.timeStartArray[0][this.data.startIndex[0]];
    timeObj = this.data.timeStartArray[1][this.data.startIndex[1]];
    let startTimestamp = new Date(dateObj.year + '-' + dateObj.month + '-' + dateObj.day + ' ' + timeObj.text).getTime();
    if (endTimestamp <= startTimestamp){
      wx.showToast({
        title: '选择的结束时间需晚于开始时间',
        icon: 'none'
      });
      return;
    }
    //租期大于29天
    if (endTimestamp - startTimestamp > timestampTemp) {
      wx.showToast({
        title: '租车时间应小于30天',
        icon: 'none'
      });
      return;
    }
    this.setData({
      endIndex: e.detail.value
    }, () => {
      let startTemp = Object.assign({}, this.data.timeEndArray[0][this.data.startIndex[0]], this.data.timeEndArray[1][this.data.startIndex[1]]);
      let endTemp = Object.assign({}, this.data.timeEndArray[0][this.data.endIndex[0]], this.data.timeEndArray[1][this.data.endIndex[1]]);
      let temp = this.calcDuration(startTemp, endTemp);
      this.setData({
        duration: temp
      })
    });
  },
  bindEndMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column === 0) {
      let temp = this.data.timeEndArray[e.detail.column][e.detail.value];
      let tempStr = temp.year + '-' + temp.month + '-' + temp.day;
      let tempTimeArray = this.initTimeArray(Object.assign({}, { date: tempStr, isBeginFromNextDay: true }, this.data.endConfig));
      this.setData({
        timeEndArray: tempTimeArray
      })
    }
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
const config = require('./config');

App({
  onLaunch(opts) {
    console.log('App Launch', opts);
    this.login();
  },
  onShow(opts) {
    console.log('App Show', opts);
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    wxCode: '',
    httpQueue: [],
    baseUrl: 'https://39.108.148.236',
    token: '',
    orderSubmit: null, //订车数据
    isPhoneAuth: false, //是否授权手机号
    isUserInfoAuth: false //是否授权用户信息
  },
  // http拦截器
  httpInterceptor: function (obj) {
    let promise = new Promise((resolve, rejected) => {
      let objTemp = Object.assign({}, obj, {
        success: function (res) {
          console.log('app httpInterceptor promise success', res);
          if (res.data.code === -1) { //认证失效，刷新请求
            this.globalData.accessToken = '';
            this.globalData.httpQueue.push(objTemp);
            // 登录
            wx.login({
              success: res1 => {
                // 发送 res1.code 到后台换取 openId, sessionKey, unionId
                // console.log('onLaunch wx.login success', res1);
                this.globalData.wxCode = res1.code;
                this.httpInterceptor({
                  url: this.globalData.baseUrl + '/rentalcars/wechat/login',
                  data: {
                    code: this.globalData.wxCode
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'GET'
                }).then(res2 => {
                  if (res2.data.code === 0) {
                    this.globalData.accessToken = res2.data.data;
                    for (let i = 0; i < this.globalData.httpQueue.length; i++) {
                      app.httpInterceptor(this.globalData.httpQueue[i]).then(res => {
                        resolve(res);
                      }, err => {
                        rejected(err);
                      });
                    }
                  } else {
                    rejected(res2);
                  }
                }, err1 => {
                  rejected(err1);
                });
              }
            });
          } else {
            resolve(res);
          }
        }.bind(this),
        fail: function (err) {
          console.log('app httpInterceptor promise fail', err);
          rejected(err);
        }
      });
      wx.request(objTemp);
    });
    return promise;
  },
  login(){
    wx.login({
      success: res => {
        if(res.code){
          this.globalData.wxCode = res.code;
          this.httpInterceptor({
            url: this.globalData.baseUrl + '/rentalcars/wechat/login',
            data: {
              code: this.globalData.wxCode
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET'
          }).then(res => {
            console.log('app.js login success', res);
            this.globalData.token = res.data.data
            wx.switchTab({
              url: '/page/home/index',
            });
          }, err => {
            console.log('app.js login failure', err);
            wx.switchTab({
              url: '/page/home/index',
            });
          });
        }
      }
    });
  }
})

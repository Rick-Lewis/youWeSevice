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
    hasLogin: false,
    wxCode: '',
    httpQueue: [],
    baseUrl: 'http://39.108.148.236:8080'
  },
  // http拦截器
  httpInterceptor: function (obj) {
    let promise = new Promise((resolve, rejected) => {
      let objTemp = Object.assign({}, obj, {
        success: function (res) {
          console.log('app httpInterceptor promise success', res);
          resolve(res);
        }.bind(this),
        fail: function (err) {
          console.log('app httpInterceptor promise fail', err);
          if (err.code === 1) { //认证失效，刷新请求
            this.globalData.accessToken = '';
            this.globalData.httpQueue.push(objTemp);
            // 登录
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // console.log('onLaunch wx.login success', res);
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
                }).then(res1 => {
                  if (res1.data.code === 0) {
                    this.globalData.accessToken = res1.data.data;
                    this.globalData.trackInfo.userInfo = res1.data.data;
                    for (let i = 0; i < this.globalData.httpQueue.length; i++) {
                      wx.request(this.globalData.httpQueue[i]);
                    }
                  } else {
                    rejected(res1);
                  }
                }, err1 => {
                  rejected(err1);
                });
              }
            });
          } else {
            rejected(err);
          }
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
            // wx.reLaunch({
            //   url: '/page/home/index',
            // });
          }, err => {
            console.log('app.js login failure', err);
          });
        }
      }
    });
  }
})

const config = require('./config');

App({
  onLaunch(opts) {
    console.log('App Launch', opts);
  },
  onShow(opts) {
    console.log('App Show', opts);
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    hasLogin: false,
    openid: null
  }
})

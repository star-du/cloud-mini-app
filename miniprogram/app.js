//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'cloud-miniapp-96177b'
      })
    }

    this.globalData = {
      openid : 0,
      isAdmin : 0,
      formFormid : 0,
      adminName : ""
    }
  }
})

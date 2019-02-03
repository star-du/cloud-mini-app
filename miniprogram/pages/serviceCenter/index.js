const app = getApp();
Page({
  data: {},
  onLoad() {
    console.log(app.globalData.openid)
    if (app.globalData.openid === 0) {
      wx.showModal({
        title: '请先登录',
        content: '未登录无法填表',
      })
    }
  }
})

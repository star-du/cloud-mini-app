// pages/progressCheck/progressCheck/.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    progressList: [],
    examState: ["审批中", "审批中", "未通过", "通过"],
  },
  onLoad: function(options) {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // get openid
    const openid = app.loginState.openid;
    console.log(openid);
    if (!(/[0-9A-Za-z_-]{28}/.test(openid))){
      // invalid openid
      wx.showToast({
        title: "无效访问",
        icon: "none",
        mask: true,
        duration: 3000,
        complete() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 3100);
        }
      });
      return;
    }
    // 获取db数据
    db.collection("forms").where({
      _openid: openid
    }).get({
      success(e) {
        console.log(e);
        PAGE.setData({
          progressList: e.data || []
        });
        // console.log(PAGE.data);
      },
      fail: console.error
    });
  }
})
//index.js
wx.cloud.init();
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    exam: [{
      num: null,
      text: "未审批"
    }, {
      num: null,
      text: "撤回"
    }, {
      num: null,
      text: "未通过"
    }, {
      num: null,
      text: "通过"
    }]
  },
  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      });
      return;
    }
    console.log('adminName:',app.globalData.adminName);
    console.log(app.globalData.isAdmin);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              });
            }
          })
        }
      }
    });

    // 获取各状态的数量
    for (let i = 0; i < this.data.exam.length; i++) {
      this.updateNumber(i);
    }
  },
  updateNumber: function (flag) {
    const PAGE = this;
    db.collection('forms').where({
      exam: flag
    }).count({
      success(res) {
        console.log(flag + " : " + res.total);
        PAGE.setData({
          ["exam[" + flag + "].num"]: res.total
        });
      }
    });
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  // 链接至 listApproval
  tapToApproval: function (e) {
    // console.log(e);
    let data = e.currentTarget.dataset;
    if (this.data.exam[data.flag].num) {
      console.log("navigateTo", data);
      wx.navigateTo({
        url: '../listApproval/listApproval?flag=' + data.flag
      });
    }
  },
  /* 用户下拉动作刷新 */
  onPullDownRefresh: function () {
    const PAGE = this;
    Promise.resolve().then(() => {
      for (let i = 0; i < PAGE.data.exam.length; i++) {
        PAGE.updateNumber(i);
      }
    }).then(() => { console.log("DONE"); wx.stopPullDownRefresh(); });
  }
})
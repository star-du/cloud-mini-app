// miniprogram/pages/serviceHall/serviceHall.js
wx.cloud.init();
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    avatarUrl: "../../assets/user-unlogin.png",
    exam: [{ num: null, text: "未审批" }, { num: null, text: "撤回" }, { num: null, text: "未通过" }, { num: null, text: "已通过" }]
  },
  onLoad: function () {
    this.setData(app.loginState);
    // 获取用户信息
    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo
          wx.getUserInfo({ success(r) { that.setData(r.userInfo); } })
        }
      }
    });
    // 获取各状态的数量
    if (app.loginState.isAdmin) {
      for (let i = 0; i < this.data.exam.length; i++)
        this.updateNumber(i);
    }
  },
  userLogin: function () {
    const that = this;
    function _getUserInfo() {
      wx.getUserInfo({
        success(res) {
          that.setData({
            hasUserInfo: true,
            userInfo: res.userInfo
          })
        }
      })
    }
    if (app.loginState.isLogin === false) {
      wx.login({ success: _getUserInfo })
    } else {
      _getUserInfo()
    }

    wx.cloud.callFunction({
      name: "login",
      data: {},
      success(res) {
        console.log("[login] call success", res.result);
        wx.showToast({
          title: "登录成功",
          icon: "success",
          duration: 2000
        });
        app.loginState = res.result;
        app.loginState.isLogin = true;
        that.setData(app.loginState);
        _getUserInfo();
      },
      fail: err => {
        console.error("[login] call failed", err);
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        });
        app.loginState = {
          isLogin: false,
          isAdmin: undefined,
          openid: undefined
        };
        that.setData(app.loginState);
      }
    });
  },
  /** 链接至教室申请/进度查询 **/
  navToBorrow: function (e) {
    // console.log(e);
    const data = e.currentTarget.dataset;
    if (this.data.isLogin) {
      console.log("navigateTo", data.url);
      wx.navigateTo(data);
    }
    else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
    }
  },
  /** 链接至 listApproval **/
  navToApproval: function (e) {
    // console.log(e);
    const data = e.currentTarget.dataset;
    if (this.data.exam[data.flag].num) {
      console.log("navigateTo", data);
      wx.navigateTo({
        url: '../listApproval/listApproval?flag=' + data.flag
      });
    }
  },
  /** 更新符合条件的审批的数量 **/
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
  }
})
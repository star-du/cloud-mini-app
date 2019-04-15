// pages/facilities/index.js
const app = getApp();
const db = wx.cloud.database();
let callLoginCnt = 0; // count times of calling Page.callCloudLogin

Page({
  data: {
    avatarUrl: "../../assets/user-unlogin.png",
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
      text: "已通过"
    }]
  },
  /**
   * 加载页面
   */
  onLoad: function() {
    this.checkLogin();
    // 获取用户信息
    this.getUserInfo();
    // 若为管理员, 获取各状态的数量
    if (this.isUserAdmin()) {
      this.updateNumber();
    }
  },
  /** 
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    Promise.all([this.checkLogin(), this.getUserInfo()])
      .then(() => {
        wx.stopPullDownRefresh({
          complete() {
            console.log("[onPullDownRefresh] Finish refreshing.");
          }
        });
        return true;
      });
  },
  /** 
   * 点击登录按钮
   */
  userLogin: function() {
    if (app.loginState.isLogin === false) {
      wx.login({
        success: this.getUserInfo
      });
      this.callCloudLogin(true);
    }
  },
  /** 
   * 检查是否有授权并获取 userInfo 
   */
  getUserInfo: function() {
    const that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已授权,可以直接调用 getUserInfo
          wx.getUserInfo({
            success(r) {
              console.log("[getUserInfo] seccess.");
              that.setData(r.userInfo);
            }
          });
        } else {
          console.log("No auth to 'scope.userInfo'.");
        }
      }
    });
  },
  /** 链接至教室申请/进度查询 */
  navToBorrow: function(e) {
    // console.log(e);
    const data = e.currentTarget.dataset;
    if (this.data.isLogin) {
      console.log("navigateTo", data.url);
      wx.navigateTo(data);
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
    }
  },
  /** 链接至 listApproval */
  navToApproval: function(e) {
    // console.log(e);
    const data = e.currentTarget.dataset;
    if (this.data.exam[data.idx].num && data.urlget.length > 0) {
      console.log("navigateTo", data);
      wx.navigateTo({
        url: '../approval/listApproval?' + data.urlget
      });
    }
  },
  /** 
   * 更新符合条件的审批的数量
   */
  updateNumber: function() {
    function updateSingle(flag, page) {
      return db.collection("forms").where({
        exam: flag
      }).count().then(res => {
        console.log(flag + " : " + res.total);
        page.setData({
          ["exam[" + flag + "].num"]: res.total
        });
      });
    }
    let arr = [];
    for (let i = 0; i < this.data.exam.length; i++)
      arr.push(updateSingle(i, this));
    return Promise.all(arr);
  },
  /** 检查用户登录状态 */
  checkLogin: function() {
    const that = this;
    wx.checkSession({
      success(res) {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("[checkSession] Has session.");
        if (callLoginCnt++ >= 3) {
          console.warn("Call cloud function [login]:", callLoginCnt);
          let promise1 = new Promise(function(resolve, reject) {
            setTimeout(() => {
              that.callCloudLogin(false);
              resolve("Promise done " + callLoginCnt);
            }, 40 * callLoginCnt * callLoginCnt);
          });
          promise1.then(console.log);
          promise1();
        } else {
          that.callCloudLogin(false);
        }
      },
      fail() {
        console.log("[checkSession] User not log in.");
        that.updateUserInfo({
          isLogin: false
        });
      }
    });
  },
  /** 
   * 更新全局变量 app.loginState
   */
  updateUserInfo: function(obj) {
    const that = this;
    return Promise.resolve().then(() => {
      app.loginState = obj;
      that.setData(obj);
      return that;
    });
  },
  /** 检查用户是否是管理员 */
  isUserAdmin: function() {
    if (app.loginState && typeof app.loginState === "object")
      return app.loginState.isLogin && app.loginState.isAdmin;
    else
      return false;
  },
  /** 调用云函数登录并修改页面状态 */
  callCloudLogin: function(isShowToast) {
    const that = this;
    wx.cloud.callFunction({
      name: "login",
      data: {}
    }).then((res) => {
      console.log("[login] call success", res.result);
      if (isShowToast)
        wx.showToast({
          title: "登录成功",
          icon: "success"
        });
      res.result.isLogin = true;
      that.updateUserInfo(res.result).then(() => {
        that.getUserInfo();
        // 如果是管理员,获取各状态的数量
        if (that.isUserAdmin()) {
          that.updateNumber();
        }
      });
    }).catch(err => {
      console.error("[login] call failed", err);
      if (isShowToast) {
        wx.showToast({
          title: "登录失败",
          icon: "none",
          duration: 2000
        });
      }
      that.updateUserInfo({
        isLogin: false
      });
    });
  }
})
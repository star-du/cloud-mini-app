// miniprogram/pages/materialsIndex/materialsIndex.js
/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
借用入口被禁用！
修改完成后注意修改！
位于navToBorrow！
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
const app = getApp();
const db = wx.cloud.database();

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
      text: "已借出"
    }, {
      num: null,
      text: "待归还"
    }, {
      num: null,
      text: "已归还"
    }],
    examNewMaterials: [{
      num: null,
      text: "未审批"
    }, {
      num: null,
      text: "已审批"
    }],
    bigItems: [{
        name: "物资查询及借用",
        url: "borrowThings",
        icon: "../../assets/borrowClassroom.png"
      },
      {
        name: "表单状态",
        url: "../progressCheck/progressCheck?type=materials",
        icon: "../../assets/progressCheck.png"
      },
      {
        name: "新增仓库物资",
        url: "addThings",
        icon: "../../assets/plus.png"
      }
    ]
  },

  // 用于验证是否能跳转的一系列条件语句
  navToBorrow: function(e) {
    const data = e.currentTarget.dataset;
    if (1) {
      console.log("navTo", data.url)
      //wx.navigateTo(data);
      //物资清点中，暂时禁用借用入口
      wx.showToast({
        title: '开发中！',
        icon: 'loading'
      })
    } else {

    }
  },

  // navReturn : function (e) {
  //   const data = e.currentTarget.dataset;
  //   if (1){
  //     console.log("navTo",data.url)
  //     wx.navigateTo(data);
  //   } else {

  //   }
  // },

  navAdd: function(e) {
    const data = e.currentTarget.dataset;
    if (1) {
      console.log("navTO", data.url)
      wx.navigateTo(data);
    } else {

    }
  },

  navRemove: function(e) {
    const data = e.currentTarget.dataset;
    if (1) {
      console.log("navTO", data.url)
      wx.navigateTo(data);
    } else {

    }
  },

  navAdmin: function(e) {
    const data = e.currentTarget.dataset;
    if (1) {
      console.log("navTO", data.url)
      wx.navigateTo(data);
    } else {

    }
  },

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

  userLogin: function() {
    if (app.loginState.isLogin === false) {
      wx.login({
        success: this.getUserInfo
      });
      this.callCloudLogin(true);
    }
  },

  checkLogin: function() {
    const that = this;
    wx.checkSession({
      success: (res) => {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("[checkSession] Has session.");
        that.callCloudLogin(false);
      },
      fail: () => {
        console.log("[checkSession] User isn't logged in.");
        that.updateUserInfo({
          isLogin: false
        });
      }
    });
  },
  /** 更新全局变量 app.loginState */
  updateUserInfo: function(obj) {
    const that = this;
    return Promise.resolve().then(function() {
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
      let R = res.result;
      R.isLogin = true;
      that.updateUserInfo(R).then(() => {
        that.getUserInfo();
        // 如果是管理员,获取各状态的数量
        if (that.isUserAdmin()) {
          that.updateNumber();
          that.updateNewMaterials();
          console.log(that.data)
        }
        that.showRedDot();
      });
    }).catch((err) => {
      console.error("[login] call failed", err);
      if (isShowToast) {
        wx.showToast({
          title: "登录失败",
          icon: 'none',
          duration: 2000
        });
      }
      that.updateUserInfo({
        isLogin: false
      });
    });
  },

  /** 
   * 更新符合条件的审批的数量
   */
  updateNumber: function() {
    function updateSingle(flag, page) {
      return db.collection("formsForMaterials").where({
        exam: flag
      }).count().then(res => {
        // console.log( page.data.exam[flag].text + " : " + res.total);
        // console.log(res);
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

  /**
   * 更新新增物资的审批数量
   */
  updateNewMaterials: function() {
    function updateSingle(flag, page) {
      return db.collection("addNewMaterials").where({
        exam: flag
      }).count().then(res => {
        // console.log( page.data.exam[flag].text + " : " + res.total);
        // console.log(res);
        page.setData({
          ["examNewMaterials[" + flag + "].num"]: res.total
        });
      });
    }

    let arr = [];
    for (let i = 0; i < this.data.examNewMaterials.length; i++)
      arr.push(updateSingle(i, this));
    return Promise.all(arr);
  },

  /** 链接至 listApproval */
  navToApproval: function(e) {
    // console.log(e);
    const data = e.currentTarget.dataset;
    // if (this.data.exam[data.idx].num && data.urlget.length > 0) {
    // NOTE: DEBUG 阶段去掉了判断审批数不为零的限制
    if (data.urlget.length > 0) {
      console.log("navigateTo", data);
      wx.navigateTo({
        url: '../approval/listApproval?' + data.urlget
      });
    }
  },

  /**
   *红点渲染函数，用于提醒归还物资 
   */
  showRedDot: function() {
    db.collection("formsForMaterials").where({
      _openid: app.loginState.openid,
      exam: 3
    }).get().then(res => {
      console.log(res)
      if (res.data.length)
        wx.showTabBarRedDot({
          index: 1,
          success: function() {
            console.log("redDOT!")
          }
        })
      else console.log('no need for reddot')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkLogin();
    // 获取用户信息
    this.getUserInfo();

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

  }
})
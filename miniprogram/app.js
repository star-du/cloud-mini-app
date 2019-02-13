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

    const that = this;
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        wx.cloud.callFunction({
          name: "login",
          data: {},
          success(res) {
            console.log("[login] call success", res.result);
            that.loginState = res.result;
            that.loginState.isLogin = true;
          },
          fail(err) {
            console.error("[login] call failed", err);
            that.loginState = { isLogin: false };
          }
        });
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log("[Launch app] User isn't logged in.");
        that.loginState = { isLogin: false };
      }
    });
  }
})

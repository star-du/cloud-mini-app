// pages/approval/exportApproval.js
const app = getApp();
const QRCode = require("../../../assets/qrcode")();
// console.log(QRCode);

Page({
  data: {
    userList: [],
    showAddInput: false,
    newToken: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.loginState.isSuper) {
      wx.switchTab({
        url: "../index"
      });
      return;
    }
    this.setData(app.loginState);
  },

  tapShowAddToken() {
    this.setData({
      showAddInput: !this.data.showAddInput
    });
  },
  inputToken(e) {
    this.setData({
      newToken: e.detail.value
    });
  },

  /**
   * 按下绑定/设置键
   */
  tapUserBind(e) {
    const dataset = e.currentTarget.dataset;
    if (!this.data.userList[dataset.idx])
      return false;

    let user = this.data.userList[dataset.idx];
    const that = this;
    console.info("user", user);

    if (user.openid) {
      // 已绑定
      wx.showActionSheet({
        itemList: ["重新绑定", "删除记录"],
        success(res) {
          console.log(res.tapIndex);
          switch (res.tapIndex) {
            case 0:
            case 1:
              // 0, 1都需要先删除用户信息
              console.log("[delete openid]", user.openid);
              wx.cloud.callFunction({
                name: "operateForms",
                data: {
                  caller: "superRemoveUser",
                  collection: "adminInfo",
                  operate: "remove",
                  filter: {
                    openid: user.openid
                  }
                }
              }).then(resRm => {
                if (!resRm.result.err && resRm.result.removed === 1) {
                  wx.showToast({
                    title: "Done",
                    icon: "success",
                    duration: 2000
                  });

                  // 用户删除成功后更新 userList
                  switch (res.tapIndex) {
                    case 0:
                      // 清空list
                      user.name = user.openid = user.tel = "";
                      user.isAdmin = false;
                      that.setData({
                        userList: that.data.userList
                      });
                      that.cloudSetUserlist();
                      break;
                    case 1:
                      // 删去list
                      that.data.userList.splice(dataset.idx, 1);
                      that.setData({
                        userList: that.data.userList
                      });
                      that.cloudSetUserlist();
                      break;
                    default:
                  }
                  return;
                } else {
                  wx.showToast({
                    title: "Error",
                    icon: "none",
                    duration: 2000
                  });
                }
              })
            default:
          }
        },
        fail(err) {
          console.error(err);
        }
      });

    } else {
      // 未绑定
      const getRandKey = (token) => {
        return this.data.openid + "," +
          token + "," + Math.max(Math.floor(token * Math.random()), 10240);
      };

      user.key = getRandKey(user.token);
      user.isAdmin = true;
      console.info("key", user.key);
      this.cloudSetUserlist(function() {
        // render QR code
        QRCode.init("canvas", {
          text: user.key,
          correctLevel: QRCode.QRErrorCorrectLevel.H,
          color: {
            '0': 'rgb(0, 147, 233)',
            '1': 'rgb(26, 173, 25)'
          },
          background: "#fefeff",
          type: "round",
          width: 300,
          height: 300
        });
      });
    }
  },

  /** 
   * 添加记录
   */
  tapAddToken() {
    const v = this.data.newToken;
    console.info(v);
    if (v && v.length === 6 && this.data.userList.length < 4) {
      let list = this.data.userList;
      list.push({
        token: v,
        key: "",
        tel: "",
        name: "",
        openid: "",
        isAdmin: true
      });
      this.cloudSetUserlist(() => {
        this.setData({
          userList: list,
          newToken: "",
          showAddInput: false
        });
      });
      return;
    }
  },

  /** set userList */
  cloudSetUserlist(cb) {
    const uList = this.data.userList;
    wx.cloud.callFunction({
        name: "operateForms",
        data: {
          caller: "superReadUser",
          collection: "adminInfo",
          operate: "read",
          filter: {
            openid: this.data.openid
          },
          field: {
            openid: true
          }
        }
      }).then(getres => {
        console.log(getres);
        if (getres.result.data && getres.result.data[0]) {
          const dat = getres.result.data[0];
          // console.log("dat", dat);
          /** @notice 'userList' stores in 'tokens', use: update: { tokens: ... }*/
          wx.cloud.callFunction({
            name: "operateForms",
            data: {
              caller: "superUpdateUser",
              collection: "adminInfo",
              docID: dat._id,
              isDoc: true,
              operate: "update",
              update: {
                tokens: uList
              }
            }
          }).then(res => {
            console.log(res);
            if (!res.result.err && res.result.updated === 1) {
              // ok
              wx.showToast({
                title: "OK",
                icon: "success",
                duration: 2000
              });
              return cb ? cb() : Promise.resolve(); // callback function
            } else {
              // error
              wx.showToast({
                title: "错误",
                icon: "none",
                duration: 2000
              });
            }
          });
        }
      })
      .catch(err => {
        console.error(err)
      });
  }
});
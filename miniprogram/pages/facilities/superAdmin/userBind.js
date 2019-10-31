// facilities/superAdmin/userBind.js
const app = getApp();

Page({
  data: {
    scanKey: "",
    keys: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      scanKey: options.code,
      keys: options.code.split(",")
    });
    this.setData(app.loginState);
  },

  submit(e) {
    const formData = e.detail.value;
    console.log("formData", formData);
    if (formData.token !== this.data.keys[1]) {
      wx.showToast({
        title: "验证码错误",
        icon: "none",
        duration: 2000
      });
      return false;
    }
    if (!formData.name) {
      wx.showToast({
        title: "未填写完整",
        icon: "none",
        duration: 2000
      });
      return false;
    }

    wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "bindUser",
        collection: "adminInfo",
        operate: "bindUser",
        filter: {
          superOpenid: this.data.keys[0],
          key: this.data.scanKey
        },
        update: {
          name: formData.name,
          tel: formData.tel
        }
      }
    }).then(res => {
      if (!res.result.err && res.result.updated === 1) {
        wx.showToast({
          title: "绑定成功",
          icon: "success",
          duration: 2000
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 3000);
      } else {
        wx.showToast({
          title: "错误",
          icon: "none",
          duration: 2000
        });
      }
    });
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})
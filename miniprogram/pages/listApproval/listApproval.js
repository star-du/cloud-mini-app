// pages/listApproval/listApproval.js
const db = wx.cloud.database();

Page({
  data: {
    progressList: [],
    examState: ["未审批", "撤回", "未通过", "通过"],
    flag: null
  },
  onLoad: function(options) {
    // check url get
    const obj = this.getUrl(options);
    if (obj === false) {
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
    } else {
      this.fetchDatabase();
    }
  },
  getUrl: function(options) {
    const last = function(day) {
      let d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
    };
    let obj = {};
    let x = Number(options.flag);
    if (!isNaN(x) && x >= 0) obj.exam = x;

    // eventDate : yyyy-MM-dd
    // x = Number(options.expireEvent);
    // if (!isNaN(x)) obj.eventDate = db.command.gte(last(x));
    
    x = Number(options.expireSubmit);
    if (!isNaN(x)) {
      obj.submitDate = db.command.gte(last(x));
      this.setData({
        expire: x + "天"
      });
    } else {
      this.setData({
        expire: "所有时间"
      });
    }
    console.log("[getUrl]", obj);
    this.setData({
      filter: obj
    });
    return Object.keys(obj).length > 0 ? obj : false;
  },
  fetchDatabase: function() {
    if (!this.data.filter) return;
    const PAGE = this; // 使得get回调函数可以访问this.setData
    console.log("database filter", this.data.filter);
    // 获取db数据
    db.collection('forms').where(this.data.filter).get()
      .then(e => {
        console.log(e);
        let x = e.data || [];
        for (let i = 0; i < x.length; i++)
          x[i].eventDate = getApp()._toDateStr(new Date(x[i].eventDate));
        PAGE.setData({
          progressList: x
        });
      }).catch(err => {
        console.error(err);
        wx.showToast({
          title: "刷新失败",
          icon: "none",
          mask: true
        });
      });
  },
  /* 用户下拉动作刷新 */
  onPullDownRefresh: function() {
    const PAGE = this;
    Promise.resolve()
      .then(() => {
        PAGE.fetchDatabase();
      })
      .then(() => {
        console.log("DONE");
        wx.stopPullDownRefresh();
      });
  }
})
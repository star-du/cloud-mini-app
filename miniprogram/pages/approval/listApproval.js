// pages/listApproval/listApproval.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    total: -1,
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
      this.getTotal().then(() => {
        this.fetchDatabase(0);
      });
    }
  },
  /**
   * getUrl()
   * @param {Object} options 传入的get对象(options)
   */
  getUrl: function(options) {
    const last = (day) => {
      const d = new Date();
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
  /**
   * getTotal
   * 获取所有 filter 数据的个数
   */
  getTotal: function() {
    if (!this.data.filter) return this;
    const that = this;
    return db.collection("forms").where(this.data.filter).count()
      .then(res => {
        console.log("[getTotal]", res);
        that.setData({
          total: res.total
        });
        if (!res.total) {
          wx.showToast({
            title: "无数据",
            icon: "none",
            mask: true,
            duration: 1200
          });
        }
        return res.total;
      });
  },
  /**
   * fetchDatabase
   * 获取数据库数据
   * @warning limit最大值为20
   */
  fetchDatabase: function(skipNum = 0) {
    if (!this.data.filter || this.data.total <= this.data.progressList.length) return;
    const that = this; // 使得get回调函数可以访问this.setData
    console.log("[fetchDatabase]filter", this.data.filter);
    // 获取db数据
    let u = db.collection("forms").where(this.data.filter);
    if (skipNum) u = u.skip(skipNum);
    return u.get().then(e => {
      console.log(e);
      let x = e.data;
      if (x.length) {
        for (let i = 0; i < x.length; i++)
          x[i].eventDate = app._toDateStr(new Date(x[i].eventDate));
        that.setData({
          progressList: that.data.progressList.concat(x)
        });
      } else {
        wx.showToast({
          title: "加载已完成",
          icon: "none",
          mask: true,
          duration: 1500
        });
      }
    }).catch(err => {
      console.error(err);
      wx.showToast({
        title: "刷新失败",
        icon: "none",
        mask: true
      });
    });
  },
  /**
   * 用户下拉动作刷新
   */
  onPullDownRefresh: function() {
    const that = this;
    Promise.resolve()
      .then(that.fetchDatabase)
      .then(wx.stopPullDownRefresh);
  },
  /**
   * 触底加载更多
   */
  onReachBottom: function() {
    const len = this.data.progressList.length
    if (this.data.total > 0 && this.data.total >= len) {
      if (this.data.total === len) {
        wx.showToast({
          title: "加载已完成",
          icon: "none",
          mask: true,
          duration: 1500
        });
        return this;
      }
      else return this.fetchDatabase(len);
    }
  }
})
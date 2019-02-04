// miniprogram/pages/listApproval.js
//初始化数据库
wx.cloud.init();
const db = wx.cloud.database();

function toDate(d) {
  d = new Date(d);
  return d.getFullYear().toString().substr(2) + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

Page({
  data: {
    progressList: [],
    examState: ["未审批", "撤回", "未通过", "通过"],
    flag: null
  },
  onLoad: function (options) {
    // check url get
    const flag = Number(options.flag);
    if (isNaN(flag)) {
      wx.showToast({
        title: "无效访问",
        icon: "none",
        mask: true,
        duration: 3000,
        complete() { setTimeout(() => { wx.navigateBack({ delta: 1 }); }, 3200); }
      });
    }
    else {
      this.setData({ flag: flag });
      this.fetchDatabase();
    }
  },
  fetchDatabase: function () {
    if (this.data.flag === null) { return; }
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    let dt = new Date();
    dt = new Date(dt.getFullYear(), dt.getMonth() - 1, dt.getDate());
    // console.log("A month ago:", dt);
    db.collection('forms').where({
      submitDate: db.command.gte(dt),
      exam: this.data.flag
    }).get({
      success(e) {
        console.log(e);
        let x = e.data || [];
        for (let i = 0; i < x.length; i++) {
          x[i].eventDate = toDate(x[i].eventDate);
        }
        PAGE.setData({ progressList: x });
      },
      fail(e) {
        console.error(e);
        wx.showToast({
          title: "刷新失败",
          icon: "none",
          mask: true
        });
      }
    });
  },
  /* 用户下拉动作刷新 */
  onPullDownRefresh: function () {
    const PAGE = this;
    Promise.resolve()
      .then(() => { PAGE.fetchDatabase(); })
      .then(() => { console.log("DONE"); wx.stopPullDownRefresh(); });
  }
})
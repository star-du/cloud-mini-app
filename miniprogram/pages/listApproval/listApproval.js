// miniprogram/pages/listApproval.js
//初始化数据库
wx.cloud.init();
const db = wx.cloud.database();

Page({
  data: {
    progressList: [],
    examState: ["未审批", "撤回", "未通过", "通过"]
  },
  onLoad: function (options) {
    // check url get
    const flag = Number(options.flag);
    if(isNaN(flag)){
      wx.showToast({
        title: "无效访问",
        icon: "none",
        mask: true,
        duration: 3000,
        complete() { setTimeout(() => { wx.navigateBack({ delta: 1 }); }, 3200); }
      });
      return;
    }
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    let dt = new Date();
    dt = new Date(dt.getFullYear(), dt.getMonth() - 1, dt.getDate());
    // console.log("A month ago:", dt);
    db.collection('forms').where({
      submitDate: db.command.gte(dt),
      exam: flag
    }).get({
      success(e) {
        // console.log(e);
        PAGE.setData({
          progressList: e.data || []
        });
        // console.log(PAGE.data);
      },
      fail: console.error
    });
  }
})
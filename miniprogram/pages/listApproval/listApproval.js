// miniprogram/pages/listApproval.js
//初始化数据库
wx.cloud.init();
const db = wx.cloud.database();

Page({
  data: {
    progressList: []
  },
  onLoad: function(options) {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    let dt = new Date();
    dt = new Date(dt.getFullYear(), dt.getMonth() - 1, dt.getDate());
    // console.log("A month ago:", dt);
    db.collection('forms').where({
      submitDate: db.command.gte(dt),
      done: Boolean(Number(options.isPass))
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
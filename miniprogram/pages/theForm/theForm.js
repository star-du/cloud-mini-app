wx.cloud.init();
const db = wx.cloud.database();

Page({
  data: {
    examState: ["未审批", "撤回", "未通过", "通过"],
    progressList: []
  },

  onLoad: function(options) {
    const PAGE = this;
    console.log("options:" + options.formid);
    db.collection('forms').where({
      formid: Number(options.formid)
    }).get({
      success(e) {
        PAGE.setData({
          progressList: e.data || []
        })
      },
      fail: console.error
    });
  }
})
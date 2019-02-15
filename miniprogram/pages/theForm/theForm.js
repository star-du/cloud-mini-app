wx.cloud.init();
const db=wx.cloud.database();

Page({
  data:{
    progressList:[]
  },

  onLoad : function (options) {
    const PAGE =  this;
    console.log("options:"+options.formid);
    db.collection('forms').where({
      formid : Number(options.formid)
    }).get({
      success (e) {
        PAGE.setData({
          progressList: e.data || []
        })
      },
      fail: console.error
    });
  }
})
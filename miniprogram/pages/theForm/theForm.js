wx.cloud.init();
const db=wx.cloud.database();

Page({
  data:{
    progressList:[]
  },

  onLoad : function (options) {
    function getFormid () {
      let app = getApp();
      let Formid = app.globalData.formFormid
      return Formid
    }
    console.log('theForm界面得到的globalData.formFormid是'+getFormid())
    const PAGE = this;
    db.collection('forms').where({
      formid : Number(getFormid())
    }).get({
      success (e) {
        PAGE.setData({
          progressList : e.data 
        });
        console.log(PAGE.data);
      },
      fail: console.error
    })
  }
})
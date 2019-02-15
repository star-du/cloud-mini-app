wx.cloud.init();
const db = wx.cloud.database();
const forms = db.collection('forms');

Page({
  data:{
    progressList: []
  },
  
  onLoad: function (options) {
    //openid的getter
    function getOpenid() {
      let app = getApp();
      let openid = app.globalData.openid

      return openid;
    }

    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    console.log(getOpenid());
    db.collection('forms').where({
      _openid: getOpenid()
    }).get({
      success(e) {
        console.log(e, e.data);
        PAGE.setData({
          progressList: e.data || []
        });
        console.log(PAGE.data);
      },
      fail: console.error
    });
  }




})
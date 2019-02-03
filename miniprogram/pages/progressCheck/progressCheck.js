// miniprogram/pages/listApproval.js

//初始化数据库
wx.cloud.init();

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progressList: [],
    examState: ["未审批", "撤回", "未通过", "通过"],
    status:''
  },


  onLoad: function (options) {
    //openid的getter
    function getOpenid(){
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
  },

  //撤回表单
  cancel:function(){
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
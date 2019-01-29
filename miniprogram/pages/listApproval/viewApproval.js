// miniprogram/pages/listApproval/viewApproval.js
const base64 = require("images/base64");
wx.cloud.init();
const db = wx.cloud.database();

Page({
  data: {
    icon: base64.icon20
  },
  onLoad: function (options) {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    db.collection('forms').where({
      _id : options.id
    }).get({
      success(e) {
        console.log(e.data);
        if(e.data&&e.data.length===1){
          let x = e.data[0];
          x.submitDate = x.submitDate.toLocaleDateString();
          PAGE.setData({
            appr: x || {}
          });
          console.log(PAGE.data);
        }
      },
      fail: console.error
    });
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
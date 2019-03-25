// miniprogram/pages/materialsIndex/materialsIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 用于验证是否能跳转的一系列条件语句
  navToBorrow : function (e) {
    const data = e.currentTarget.dataset;
    if (1){
      console.log("navTo",data.url)
      wx.navigateTo(data);
    } else {

    }
  },

  // navReturn : function (e) {
  //   const data = e.currentTarget.dataset;
  //   if (1){
  //     console.log("navTo",data.url)
  //     wx.navigateTo(data);
  //   } else {
      
  //   }
  // },

  navAdd : function (e) {
    const data = e.currentTarget.dataset;
    if (1){
      console.log("navTO",data.url)
      wx.navigateTo(data);
    } else {
      
    }
  },

  navRemove : function (e) {
    const data = e.currentTarget.dataset;
    if (1){
      console.log("navTO",data.url)
      wx.navigateTo(data);
    } else {
      
    }
  },

  navAdmin : function (e) {
    const data = e.currentTarget.dataset;
    if (1){
      console.log("navTO",data.url)
      wx.navigateTo(data);
    } else {
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
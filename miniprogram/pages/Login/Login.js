// miniprogram/pages/Login/Login.js

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
};

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  userLogin: function(){
    wx.cloud.callFunction({
      name:'login',
      data:{},
      success: res => {
        app.globalData.opid = res.result.openid;
        console.log(res.result.openid);
        wx.navigateTo({
          url:'../borrowClassroom/borrowClassroom',
        });
      },
      fail: res => {
        console.error(err)
      }
    })
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
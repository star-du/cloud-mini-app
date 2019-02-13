// miniprogram/pages/navigator/navigator.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enter:[
      {
        name:'borrowClassroom',
        name_zh:'教室借用'
      },
      {
        name:'progressCheck',
        name_zh: '进度查询'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//如果是管理员，则渲染审批界面**存在bug，用户点击过快时，尚未同步数据库而已开始鉴权，导致管理员用户仍无法渲染出审批**
    
    const isAdmin = app.globalData.isAdmin;
    let enter = this.data.enter;
    enter.push({
      name: 'admin',
      name_zh: '审批'
    });
    if(isAdmin){
      this.setData({enter})
    }
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
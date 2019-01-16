// miniprogram/pages/test.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getResult:"1"

  },

  testFunction() {
    wx.cloud.callFunction({
      name: 'test',
      data: {
        a: 1,
        b: 2
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        console.log('callFunction test result: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [test] 调用失败：', err)
      }
    })
  },
  onAdd: function () {
    
    db.collection('test').add({
      data: {
        title:"Demo",
        content:"New year's concert"

      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          itemId: res._id,
          content:"New year's concert"
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onGet: ()=>{
    db.collection('test').where({
    _openid: 'user-open-id',
  })
    .get({
      success(res) {
      // res.data 是包含以上定义的两条记录的数组
      wx.showToast({
        title: '查询记录成功',
      })

        console.log(res.data["0"].content)
        this.setData({
        content:"a"
        //TODO:Why can't I setdata??
      })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
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
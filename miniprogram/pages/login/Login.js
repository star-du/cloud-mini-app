// miniprogram/pages/login/login.js
const app = getApp();
wx.cloud.init();

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  userLogin: function () {
    const that = this

    function _getUserInfo() {
      wx.getUserInfo({
        success(res) {
          that.setData({
            hasUserInfo: true,
            userInfo: res.userInfo
          })
        }
      })
    }

    function getOpenid() {
      let app = getApp();
      let openid = app.globalData.openid

      return openid;
    }

    if (app.globalData.hasLogin === false) {
      wx.login({
        success: _getUserInfo
      })
    } else {
      _getUserInfo()
    }


    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        //console.log(app.globalData.openid)
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })

        // 鉴定是否是管理员
        db.collection('adminInfo').where({
          openid: getOpenid()
        }).get({
          success(e) {
            console.log(e, e.data);
            //console.log(e.data.length);
            if (e.data.length != 0){
            app.globalData.isAdmin=1;
            app.globalData.adminName=e.data[0].name;
            console.log('admin ',app.globalData.adminName,' 登录');
          }
          },
          fail: console.error
        });

        setTimeout(function(){//定时器，别去，原因看navigator.js的注释
          //console.log(app.globalData.adminName);
          wx.navigateTo({ //登录后跳转到办事大厅
          url: '../navigator/navigator',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })}
        ,2000)
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '登录失败',
          icon: 'fail',
          duration: 2000
        })
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
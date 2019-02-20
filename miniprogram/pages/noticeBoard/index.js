//index.js
const db = wx.cloud.database();
const forms = db.collection('forms');

function toDate(d) {
  return d instanceof Date ? d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() : "";
}

const app = getApp()
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    text: app.globalData.rule,
    showIndex: 0,
    listData: [
      { "code": "", "time": "", "association": "", "responser": "", "tel": "" }],
    date: "2019-01-01",

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.setData({
      listData: [
        { "code": "", "time": "", "association": "", "responser": "", "tel": "" }]
    })
    db.collection('forms').where({
      exam: db.command.eq(3),
      eventDate: this.data.date
    }).get({
      success: res => {
        const length = res.data.length
        for (let i = 0; i <= length; ++i) {
          console.log("第" + (i + 1) + "个活动" + '\t' + "活动名称：" + res.data[i].event.name + '\t' + "协会：" + res.data[i].event.association + '\t' + "活动内容：" + res.data[i].event.content + '\t' + "负责人：" + res.data[i].event.responser),
            this.setData({
              listData: this.data.listData.concat([
                { "code": res.data[i].classroomNumber, "time": res.data[i].eventTime1 + '\t' + "~" + res.data[i].eventTime2, "association": res.data[i].event.association, "responser": res.data[i].event.responser, "tel": res.data[i].event.tel }])
            })
        }
      },
    })
  },


  onLoad: function () {
    //console.log(toDate(new Date()));
    this.setData({
      listData: [
        { "code": "", "time": "", "association": "", "responser": "", "tel": "" }],
        date: toDate(new Date())
    })

    db.collection('forms').where({
      exam: db.command.eq(3),
      eventDate: this.data.date
    }).get({
      success: res => {
        const length = res.data.length
        for (let i = 0; i <= length; ++i) {
          console.log("第" + (i + 1) + "个活动" + '\t' + "活动名称：" + res.data[i].event.name + '\t' + "协会：" + res.data[i].event.association + '\t' + "活动内容：" + res.data[i].event.content + '\t' + "负责人：" + res.data[i].event.responser),
            this.setData({
              listData: this.data.listData.concat([
                { "code": res.data[i].classroomNumber, "time": res.data[i].eventTime1 + '\t' + "~" + res.data[i].eventTime2, "association": res.data[i].event.association, "responser": res.data[i].event.responser, "tel": res.data[i].event.tel }])
            })
        }
      },
    })
  },
  panel: function (e) {
    if (e.currentTarget.dataset.index != this.data.showIndex) {
      this.setData({
        showIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex: 0  
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})

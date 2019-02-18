//index.js
const db = wx.cloud.database();
const forms = db.collection('forms');


var rule = '\n1、请至少提前两天准备好活动策划。在Hust社联场地借用小程序上申请借用教室，并将策划电子版以“36号楼教室借用＋协会名称＋日期”的方式命名发送至秘书部公邮mishu@hustau.com。审批情况可在小程序上查询，通过者可将确认单打印；\n2、使用教室的当天须将教室借用确认单打印成纸质版（双面打印）交至36号楼1楼社联值班室，并在教室借用表上进行借用登记；\n3、建议申请前先查询教室是否空闲，查询方式：Hust社联场地借用小程序-公告版； \n4、房间钥匙放置于36号楼1楼社联值班室内，教室使用结束后请将门锁好并把钥匙放回原位；\n5、普通教室须有活动负责人陪同使用并保证器材设备完好，活动结束后请将教室清理干净、桌椅归位，如发现教室卫生及器材损坏问题将影响未来二次借用，谢谢配合；\n6、如有任何疑问，请联系36号楼教室借用负责人 白依萱：13621381497。'
const app = getApp()
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    text: rule,
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

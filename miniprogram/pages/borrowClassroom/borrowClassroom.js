//初始化数据库
wx.cloud.init();
const app = getApp();

const db = wx.cloud.database();

const forms = db.collection('forms');
const formid = db.collection('formid');

const date = new Date();

Page({
  data: {
    formid :0,
    index: 0,
    date: "2019-01-01",
    classroom: [
      201,202,203,204,205,206,207,208
    ],
  },

  onLoad() {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    const _ = db.command;
    db.collection('formid').where({
      name:'latest_id'
    }).get({
      success(e) {
        console.log(e, e.data);
        PAGE.setData({
          formid: e.data[0].formid
        });
        console.log(PAGE.data);
      },
      fail: console.error
    });
  },

  /*在线填表页面点击报名的函数*/
  submit: function(e) {
    const formsData = e.detail.value;
    const PAGE = this;
    forms.add({
      data: {
        openid: app.globalData.openid,
        _id: PAGE.formid,
        eventName: formsData["eventName"],
        attendNumber: formsData["attendNumber"],
        eventDate: formsData["eventDate"],
        eventTime1: formsData["eventTime1"],
        eventTime2: formsData["eventTime2"],
        classroomNumber: formsData["classroomNumber"],
        eventContent: formsData["eventContent"],
        eventResponser: formsData["eventResponser"],
        submitDate: date,
        exam: 0 //0代表未审核 1代表已审核通过 2代表未审核通过
      }
    }).then(
      res => {
        console.log(res)
        let newid=this.formid+1;
        db.collection('formid').doc('latest_id').update({

          data: {
            formid: newid
          },
          success(res) {
            console.log(res.data)
          }
        })
      }
    )

  },

  /*活动日期picker改变的函数*/
  bindDateChange: function(e) {
    console.log("picker_date发送选择改变，携带值为", e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /*活动时间picker改变的函数1*/
  bindTimeChange1: function(e) {
    console.log("picker_time1发送选择改变，携带值为", e.detail.value)
    this.setData({
      time1: e.detail.value
    })
  },

  /*活动时间picker改变的函数2*/
  bindTimeChange2: function(e) {
    console.log("picker_time2发送选择改变，携带值为", e.detail.value)
    this.setData({
      time2: e.detail.value
    })
  },

  bindClassroomChange: function(e) {
    console.log('picker_classroom发生改变，值为：',e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }

});
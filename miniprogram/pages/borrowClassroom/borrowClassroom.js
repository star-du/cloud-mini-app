 //初始化数据库
wx.cloud.init();

 const db = wx.cloud.database();

 const forms = db.collection('forms');

 const date = new Date();
Page({
  data:{
    index:0,
    date:"2019-01-01"
  },
  
  /*在线填表页面点击报名的函数*/
  submit:function (e) {
    let formsData = e.detail.value;
    forms.add({
      data: {
        associationName: formsData["associationName"],
        eventName: formsData["eventName"],
        attendNumber: formsData["attendNumber"],
        eventDate: formsData["eventDate"],
        eventTime1: formsData["eventTime1"],
        eventTime2: formsData["eventTime2"],
        classroomNumber: formsData["classroomNumber"],
        eventContent: formsData["eventContent"],
        eventResponser: formsData["eventResponser"],
        submitDate: date,
        done: false
      }
    }).then(
      res => {
        console.log(res)
      }
    )
  },

  /*活动日期picker改变的函数*/
  bindDateChange:function (e) {
    console.log("picker_date发送选择改变，携带值为",e.detail.value)
    this.setData({
      date:e.detail.value
    })
  },

  /*活动时间picker改变的函数1*/
  bindTimeChange1:function (e) {
    console.log("picker_time1发送选择改变，携带值为", e.detail.value)
    this.setData({
      time1: e.detail.value
    })
  },

   /*活动时间picker改变的函数2*/
  bindTimeChange2: function (e) {
    console.log("picker_time2发送选择改变，携带值为", e.detail.value)
    this.setData({
      time2: e.detail.value
    })
  }
});




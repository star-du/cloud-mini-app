//初始化数据库
wx.cloud.init();

const db = wx.cloud.database();

const forms = db.collection('forms');

const date = new Date();

Page({
  data: {
    index: 0,
    date: "2019-01-01",
    classroomNumber:"请选择",
    range:["请选择","201","202","203","204","205","206","207","208"]
  },


  /*在线填表页面点击报名的函数*/
  submit: function(e) {
    let form=e.detail.value
    if (form["classroomNumber"]!=="请选择") {
      wx.showModal({
        title: '提交成功',
        content: '请耐心等待审核结果',
      })
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
    }
    else {
      wx.showModal({
        title: '提交失败',
        content: '请检查表单填写是否正确',
      })
    }
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

  /*借用教室picker改变的函数*/
  bindNumberChange: function (e) {
    console.log("picker_classroomNumber发生选择改变，携带值为",20+e.detail.value)
    this.setData({
      classroomNumber:20+e.detail.value
    })
  } 
});
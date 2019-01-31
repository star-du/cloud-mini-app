//初始化数据库
wx.cloud.init();
const app = getApp();

const db = wx.cloud.database();

const forms = db.collection('forms');
const formid = db.collection('formid');

const date = new Date();

const judge = /\d{11}/

Page({
  data: {
    index: 0,
    date: "2019-01-01",
    classroomNumber:"请选择",
    range:["请选择","201","202","203","204","205","206","207","208"]
  },

  onLoad() {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    const _ = db.command;
    /*
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
    });*/
  },

  /*在线填表页面点击报名的函数*/
  submit: function(e) {
    const formsData = e.detail.value;
    const PAGE = this;
    

    //TODO:仿照hustauEntrance:join-us中对不同错误给出不同提示
    if ((formsData["classroomNumber"] == "请选择") || !(judge.test(formsData["responserPhone"])) || (formsData["classroomNumber"] == "200")) {
      wx.showModal({
        title: "提交失败",
        content: "请检查表单填写是否正确",
        showCancel: false,
        confirmText: "回去修改"
      });
      return;
  }
    
    db.collection('forms')
    .orderBy('formid', 'desc')
    .get({
      success(res) {
        const maxFormid = res.data[0].formid;
        console.log("The existing maximum formid is: ",maxFormid);
        forms.add({
          data: {
            openid: app.globalData.openid,
            formid: maxFormid +1,
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
          },
              success(res) {
                console.log("Successfully add to db!")
                wx.showModal({
                  title: '提交成功',
                  content: '请耐心等待审核结果',
              })
              }
            })
      }
    })
    
   
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
  },


  /*借用教室picker改变的函数*/
  bindNumberChange: function (e) {
    console.log("picker_classroomNumber发生选择改变，携带值为",20+e.detail.value)
    this.setData({
      classroomNumber:20+e.detail.value
    })
  } 
});
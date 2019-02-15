wx.cloud.init();
const db=wx.cloud.database();
const forms=db.collection('forms');
const APP=getApp();

Page({
  data:{
    progressList: []
  },

  submit: function (e) {
    const PAGE=this;
    const Userinput=e.detail.value["input"]
    console.log("用户输入了"+Userinput)
    APP.globalData={
      formFormid:Userinput
    }
    console.log(APP.globalData['formFormid'])
    wx.navigateTo({
      url: '../theForm/theForm',
    })
  }
})
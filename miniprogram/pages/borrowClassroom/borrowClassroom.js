Page({
  data:{
    index:0,
    date:"2019-01-01"
  },

  /*在线填表页面点击报名的函数*/
  submit:function (e) {
    
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
})
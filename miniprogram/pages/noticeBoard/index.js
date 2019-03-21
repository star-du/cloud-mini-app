// pages/noticeBoard/index.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    date: app._toDateStr(new Date(), true),
    listData: [],
    showIndex: 0,
    text: app.globalData.rule
  },
  onLoad: function() {
    this.updateTable();
  },
  bindDateChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    if (e.detail.value !== this.data.date) {
      this.setData({
        date: e.detail.value,
        listData: []
      });
      this.updateTable();
    }
  },
  /** get database */
  updateTable: function() {
    const that = this;
    db.collection("forms").where({
      exam: 3,
      eventDate: this.data.date
    }).get().then(res => {
      let arr = [];
      for (let i = 0; i < res.data.length; ++i) {
        console.log("活动" + (i + 1) + ":", res.data[i]);
        arr.push({
          association: res.data[i].event.association,
          room: res.data[i].classroomNumber,
          time: res.data[i].eventTime1 + '\t' + "~" + res.data[i].eventTime2,
          responser: res.data[i].event.responser,
          tel: res.data[i].event.tel
        });
      }
      that.setData({
        listData: arr
      });
    });
  },
  panel: function(e) {
    if (e.currentTarget.dataset.index != this.data.showIndex) {
      this.setData({
        showIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        showIndex: 0
      })
    }
  }
})
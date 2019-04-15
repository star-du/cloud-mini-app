//规范日期显示格式：
// if ((new Date().getMonth() + 1) < 10 && new Date().getDate() < 10) var date = new Date().getFullYear() + '-' + '0' + (new Date().getMonth() + 1) + '-' + '0' + new Date().getDate();
// if ((new Date().getMonth() + 1) >= 10 && new Date().getDate() >= 10) var date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
// if ((new Date().getMonth() + 1) < 10 && new Date().getDate() >= 10) var date = new Date().getFullYear() + '-' + '0' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
// if ((new Date().getMonth() + 1) >= 10 && new Date().getDate() < 10) var date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + '0' + new Date().getDate();
var account = new Array();

const db = wx.cloud.database();
const app = getApp();
var today = app._toDateStr(new Date(),true);

Page({
  data: {
    validStartingDate: app._toDateStr(new Date(),true),
    validEndingDate: app._toDateStr(new Date().setDate(new Date().getDate()+14), true), //14 days after today
    date1: today, //借用时间
    date2: today,
    itemname: [],
    itemcount: [],
  },

  onLoad: function (options) {
    const PAGE = this
    this.setData({
      itemname: options.itemname,
      itemcount: options.itemcount,
      itemId: options.itemId
    })
    account[0] = options.itemcount;
  },
  bindDateChange1: function (e) {
    this.setData({
      date1: e.detail.value,
    })
  },
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value,
    })
  },
  //检查合法性:
  check: function (e) {
    var contents = e.detail.value;
    console.log(contents);
    //若 部门/协会名称 为空：
    if (contents["association"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写部门/协会名称",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 借用人姓名 为空：
    if (contents["name"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写借用人姓名",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 联系电话 为空：
    if (contents["phoneNumber"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写您的联系电话",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 联系电话 少于11位：
    if (contents["phoneNumber"].length < 11) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请重新填写您的联系电话",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 学号 为空：
    if (contents["studentId"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写您的学号",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 院系班级 为空：
    if (contents["class"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写院系班级",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 物资借用数量 为空：
    if (contents["quantity"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写物资借用数量",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 物资借用数量 大于剩余数量，或等于零：
    if (contents["quantity"] > account[0] || contents["account"] == 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请重新填写物资借用数量",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 归还日期 小于 借用日期：
    if (contents["eventTime2"] < contents["eventTime1"]) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请重新选择日期",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //若 借用用途 为空：
    if (contents["description"].length === 0) {
      wx.showModal({
        title: "信息不完整或有错误",
        content: "请填写借用用途",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
//提交申请表单
    db.collection("formsForMaterials").add({
      data: {
        association: contents["association"],
        class: contents["class"],
        description: contents["description"],
        eventTime1: contents["eventTime1"],
        eventTime2: contents["eventTime2"],
        itemName: contents["itemName"],
        name: contents["name"],
        phoneNumber: contents["phoneNumber"],
        quantity: contents["quantity"],
        studentId: contents["studentId"],
        exam: 0 //exam status
      }
    }).then(() => {
      wx.showToast({
        title: '提交成功！',
        success: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      });
      //让库存减一（还没写
    })
  }
})
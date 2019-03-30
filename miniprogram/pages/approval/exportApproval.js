// pages/approval/exportApproval.js
const app = getApp();
const db = wx.cloud.database();
const fs = wx.getFileSystemManager();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileID: "",
    fileURL: "",
    filePath: "",
    startDate: "2019-01-01",
    endDate: app._toDateStr(new Date(), true),
    available: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * startDate picker 改变的函数
   */
  bindStartDateChange: function(e) {
    console.log("[bindStartDateChange]", e.detail.value);
    if (this.data.endDate < e.detail.value) {
      this.setData({
        startDate: e.detail.value,
        endDate: e.detail.value
      });
    } else {
      this.setData({
        startDate: e.detail.value
      });
    }
  },
  /**
   * endDate picker 改变的函数
   */
  bindEndDateChange: function(e) {
    console.log("[bindEndDateChange]", e.detail.value);
    if (this.data.startDate <= e.detail.value) {
      this.setData({
        endDate: e.detail.value
      });
    }
  },
  /**
   * submit
   */
  submit: function(e) {
    const formData = e.detail.value;
    const that = this;
    db.collection("forms").where({
      exam: 3,
      submitDate: db.command.gte(new Date(formData.startDate))
        .and(db.command.lte(new Date(formData.endDate)))
    }).count().then(res => {
      console.log("[submit]count", res.total);
      that.setData({
        available: res.total
      });
      if (res.total <= 0) {
        wx.showToast({
          title: "无数据",
          icon: "none"
        });
      }
    });
  },
  /**
   * 按下'导出'按钮, 调用云函数生成文件、临时链接、本地文件, 并打开文件
   */
  tapExport: function() {
    const that = this;
    wx.cloud.callFunction({
      name: "exportXlsx",
      data: {
        openid: app.loginState.openid,
        startDate: that.data.startDate,
        endDate: that.data.endDate
      }
    }).then(res => {
      console.log("[exportXlsx] call success", res.result);
      wx.showToast({
        title: "成功",
        icon: "success"
      });
      that.setData({
        fileID: res.result.fileID
      });
      wx.cloud.downloadFile({
        fileID: res.result.fileID,
        success: res => {
          // get temp file path
          console.log("[cloud.downloadFile]", res);
          if (res.statusCode === 200) {
            // status ok
            that.saveAndOpenXlxs(res.tempFilePath);
            that.setData({
              fileURL: res.tempFilePath
            });
          }
        },
        fail: console.error
      });
    });
    // end wx.cloud.callFunction()
  },
  /**
   * 将获取到的临时文件URL转换为本地文件并保存、重命名、打开
   * TODO: 无法保存到用户存储空间，只能存于微信内部空间，最好能任意保存
   */
  saveAndOpenXlxs: function(fPath) {
    const that = this;
    wx.saveFile({
      tempFilePath: fPath,
      //filePath: nPath,
      success(res) {
        console.log("[saveFile]", res);
        const savedPath = res.savedFilePath;
        const newPath = wx.env.USER_DATA_PATH + "/导出" + that.data.startDate + "至" + that.data.endDate + ".xlsx";
        console.log("[rename]", newPath);
        fs.renameSync(savedPath, newPath);
        that.setData({
          filePath: newPath
        });
        // open document
        wx.openDocument({
          filePath: newPath,
          success: function(res) {
            console.log("[openDocument]打开文档成功", res);
          },
          fail: console.error,
          complete: console.log
        });
        // end wx.openDocument()
      },
      fail: console.error
    });
    //end wx.saveFile()
  }
})
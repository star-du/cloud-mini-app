const db = wx.cloud.database();

// Page({
//   data: {
//     examState: ["未审批", "撤回", "未通过", "通过"],
//     progressList: []
//   },

//   onLoad: function(options) {
//     const PAGE = this;
//     console.log("options:" + options.formid);
//     db.collection('forms').where({
//       formid: Number(options.formid)
//     }).get({
//       success(e) {
//         PAGE.setData({
//           progressList: e.data || []
//         })
//       },
//       fail: console.error
//     });
//   }
// })

Page({
  data: {
    examState: ["未审批", "撤回", "未通过", "通过"],
    progressList: [],
    WIDTH: 315,
    HEIGHT: 450 
  },

  onLoad: function (options) {
    const PAGE = this;
    console.log("options:" + options.formid);
    db.collection("forms").where({
      formid: Number(options.formid)
    }).get({
      success(e) {
        PAGE.setData({
          progressList: e.data || []
        });
        // console.log("here???");
        // console.log('a',PAGE.data.progressList);
        PAGE.createNewImg(PAGE);
      },
      fail: console.error
    });
    
  },


  createNewImg: function (PAGE) {
    var it = PAGE.data.progressList[0]; //NOTE：测试用数据库有部分formid重复
    console.log('item:',it);
    let ctx = wx.createCanvasContext('formVerify');
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, PAGE.data.WIDTH, PAGE.data.HEIGHT);
    // ctx.draw();
    // ctx.setStrokeStyle('black')
    // ctx.moveTo(0, 0)
    // ctx.lineTo(210, 0)
    // ctx.stroke()
    ctx.setFillStyle('black')
    ctx.font ="18px sans-serif";
    ctx.setTextAlign('center');
    let contentForPrint = {"协会名称":it.event.association, "活动名称":it.event.name, "参与人数":it.event.attendNumber, "活动日期":it.eventDate, "活动时间":it.eventTime1+'至'+it.eventTime2,"借用教室编号":it.classroomNumber,"活动内容":it.event.content,"活动负责人":it.event.responser,"联系电话":it.event.tel,"审批状态":PAGE.data.examState[it.exam],"社联审批人":it.check.approver,"审批人意见":it.check.comment}; 
    var yCoord = 40;
    for (var title in contentForPrint){
        ctx.fillText(title+':'+contentForPrint[title], PAGE.data.WIDTH/2, yCoord);
        yCoord +=20;
    }
    ctx.draw();
    
    },


  savePic: function () {

    wx.canvasToTempFilePath({
      canvasId: 'formVerify',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) =>{
            console.log('successfully saved:',res)
            wx.showModal({
              title: '保存成功',
              content: "已保存到手机相册",
              showCancel: false,
              confirmText: '好',
            })
          },
          fail: function (res) {
            console.log(res)
            wx.getSetting({
              success: function (res) {
                console.log(res.authSetting)
                if (("scope.writePhotosAlbum" in res.authSetting) && !res.authSetting['scope.writePhotosAlbum']) {
                  console.log("auth fail")
                  this.setData({
                    opentype: "openSetting"
                  })
                }
              }
            })
          }
        })
        // that.data.tmpPath = res.tempFilePath
      },
    })

    
  },


})
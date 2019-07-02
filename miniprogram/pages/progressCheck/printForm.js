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
    WIDTH: 375,
    HEIGHT: 550 
    
  },

  onLoad: function (options) {
    const PAGE = this;
    // console.log("options:" + options.type +' - ' + options.id);
    db.collection("forms").where({
      _id: options.id
    }).get({
      success(e) {
        PAGE.setData({
          progressList: e.data || []
        });
        PAGE.createNewImg(PAGE);
      },
      fail: console.error
    });
    
  },


  createNewImg: function (PAGE) {
    var it = PAGE.data.progressList[0]; 
    // console.log('item:',it);
    let ctx = wx.createCanvasContext('formVerify');
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, PAGE.data.WIDTH, PAGE.data.HEIGHT);
    // ctx.draw();
    // ctx.setStrokeStyle('black')
    // ctx.moveTo(0, 0)
    // ctx.lineTo(210, 0)
    // ctx.stroke()
    ctx.setLineWidth=20;
    ctx.setStrokeStyle="blue";
    ctx.moveTo(15,5);
    ctx.lineTo(360,5);
    ctx.stroke();
    ctx.setFillStyle('black')
    ctx.font ="18px sans-serif";
    ctx.setTextAlign('start');
   // ctx.fillText("textAlign=start",30,20);
    let contentForPrint = {"协会名称":it.event.association, "活动名称":it.event.name, "参与人数":it.event.attendNumber, "活动日期":it.eventDate, "活动时间":it.eventTime1+'至'+it.eventTime2,"借用教室编号":it.classroomNumber,"活动内容":it.event.content,"活动负责人":it.event.responser,"联系电话":it.event.tel,"审批状态":PAGE.data.examState[it.exam],"社联审批人":it.check.approver,"审批人意见":it.check.comment}; 
    var yCoord = 25;
    for (var title in contentForPrint){
        ctx.fillText(title+':', 25, yCoord);
        var textWidth = ctx.measureText(contentForPrint[title]).width;
        var maxLength=200;
        // console.log(textWidth);
      var lastYCoord = yCoord;
       if (textWidth<=maxLength)
        {
           ctx.fillText(contentForPrint[title], 155, yCoord);
          
        }else if(textWidth<600)
        {
         var count = 0;
         
         while (textWidth >maxLength) {
           var currentText = contentForPrint[title];
           ctx.fillText(currentText.substring(count * 10, (count + 1) * 10), 160, yCoord);
          
           count++;
           yCoord += 25;
           textWidth -= 200;
         }
        }else
        {
         var count = 0;
         var lastYCoord = yCoord;
         while (count<3) 
         {
           var currentText = contentForPrint[title];
           ctx.fillText(currentText.substring(count * 11, (count + 1) * 11), 155, yCoord);

           count++;
           yCoord += 25;
           textWidth -= 200;
         }
         ctx.fillText("......",155,yCoord);
        }
          
        ctx.moveTo(15,lastYCoord-20)
        ctx.lineTo(15,yCoord+5);
        ctx.lineTo(360,yCoord+5);
        ctx.lineTo(360,lastYCoord-20);
        ctx.moveTo(150,lastYCoord-20);
        ctx.lineTo(150,yCoord+5)
        ctx.stroke();
        ctx.moveTo(15,yCoord+5);
        yCoord +=25;
    }
   
    ctx.draw();
    
    },


  savePic: function () {

    wx.canvasToTempFilePath({
      canvasId: 'formVerify',
      success: function (res) {
        // console.log(res.tempFilePath)
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
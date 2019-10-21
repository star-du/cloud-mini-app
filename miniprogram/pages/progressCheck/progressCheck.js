// pages/progressCheck/progressCheck/.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    progressList: [],
    type: 'facilities',
    examState: ["未审批", "撤回", "未通过", "通过", "待归还", "已归还"]
  },
  onLoad: function(options) {
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // get openid
    const openid = app.loginState.openid;
    console.log(openid);
    if (!(/[0-9A-Za-z_-]{28}/.test(openid))){
      // invalid openid
      wx.showToast({
        title: "无效访问",
        icon: "none",
        mask: true,
        duration: 3000,
        complete() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 3100);
        }
      });
      return;
    }
    
    if (options.type === 'materials'){
      console.log(options.type);
      db.collection("formsForMaterials").where({
        _openid: openid
      }).get().then(res => {            
          PAGE.setData({
          type:'materials',
          progressList: res.data || []
        });
      }).then(() =>{
        var progressList = PAGE.data.progressList
        for (let i = 0;i< progressList.length;i++){
          if (progressList[i].exam > 2)
            {let itemId = progressList[i].itemId
            // console.log('itemId:',itemId)
            db.collection("items").where({
              itemId : itemId
            }).get({
              success(e) {
                if (e.data.length == 1)
                {location = e.data[0].location;
                console.log(location)}
                else console.error('itemId is not unique');

                progressList[i].location = location;
                PAGE.setData({
                  progressList: progressList
                })
              },
              fail: console.error
            });} // end of if
          }
          console.log('[ProgressCheck] PAGE.data:',PAGE.data);
      }).catch(err => {
        console.error("[progressCheck]failed", err);
       })
    return;} // end of if

    // 获取db数据
    db.collection("forms").where({
      _openid: openid
    }).get({
      success(e) {
        // console.log(e);
        PAGE.setData({
          progressList: e.data || []
        });
        console.log('PAGE.data:',PAGE.data);
      },
      fail: console.error
    });


  }
})
// pages/approval/viewApproval.js
const app = getApp();
const db = wx.cloud.database();

function fetchDB(PAGE) {
  if (PAGE.data.type === 'materials') {
    console.log('fetch forms of materials')
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getAppr",
        collection: "formsForMaterials",
        docID: PAGE.data.id,
        isDoc: true,
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchDB]res", res);
      if (res.result.err) {
        console.error("[ERROR]", res.result.errMsg);
        return;
      }
      let x = res.result.data;
      x.submitDate = app._toDateStr(x.submitDate);
      // x.eventTime1 = app._toDateStr(new Date(x.eventTime1));
      // x.eventTime2 = app._toDateStr(new Date(x.eventTime2));
      PAGE.setData({
        appr: x || {},
        "appr.check.approver": app.loginState.name

      });
      if (x.check && x.check.comment) {
        PAGE.setData({
          commentLength: x.check.comment.length
        });
      }
      // if (!x.check || !x.check.approver) {
      //   PAGE.setData({
      //     "appr.check.approver": app.loginState.name
      //   });
      // }
    }).catch(err => {
      console.error("[fetchDB]failed", err);
    });
  } 
  
  else if (PAGE.data.type === 'newMaterials'){
    console.log('fetch forms of newMaterials')
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getAppr",
        collection: "addNewMaterials",
        docID: PAGE.data.id,
        isDoc: true,
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchDB]res", res);
      if (res.result.err) {
        console.error("[ERROR]", res.result.errMsg);
        return;
      }
      let x = res.result.data;
      x.submitDate = app._toDateStr(x.submitDate);
      // x.eventTime1 = app._toDateStr(new Date(x.eventTime1));
      // x.eventTime2 = app._toDateStr(new Date(x.eventTime2));
      PAGE.setData({
        appr: x || {},
        "appr.check.approver": app.loginState.name
      });
      if (x.check && x.check.comment) {
        PAGE.setData({
          commentLength: x.check.comment.length
        });
      }
      // if (!x.check || !x.check.approver) {
      //   PAGE.setData({
      //     "appr.check.approver": app.loginState.name
      //   });
      // }
      // if (!x.isOriginalMaterials && x.genre) {
      //   PAGE.setData({
      //     genreIndex: PAGE.data.genreLetters.indexOf(x.genre)
      //   });
      // } // set genre in genre picker if it is new materials 
    }).catch(err => {
      console.error("[fetchDB]failed", err);
    });
  } 
    else {
    // 场地借用, 修改为云函数
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getAppr",
        collection: "forms",
        docID: PAGE.data.id,
        isDoc: true,
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchDB]res", res);
      if (res.result.err) {
        console.error("[ERROR]", res.result.errMsg);
        return;
      }

      let x = res.result.data;
      x.submitDate = app._toDateStr(x.submitDate);
      // x.eventTime1 = app._toDateStr(new Date(x.eventTime1));
      // x.eventTime2 = app._toDateStr(new Date(x.eventTime2));
      PAGE.setData({
        appr: x || {},
        "appr.check.approver": app.loginState.name
      });
      if (x.check && x.check.comment) {
        PAGE.setData({
          commentLength: x.check.comment.length
        });
      }
      // if (!x.check || !x.check.approver) {
      //   PAGE.setData({
      //     "appr.check.approver": app.loginState.name
      //   });
      // }
    }).catch(err => {
      console.error("[fetchDB]failed", err);
    });
    // end else
  }
}

const cmp = (_x, _y) => {
  return _x.eventTime1 == _x.eventTime1 ? _x.eventTime2 < _y.eventTime2 : _x.eventTime1 < _y.eventTime1
};

function getInter(a) {
  const inside = (v, arr) => {
    for (let i = 0; i < arr.length; i++)
      if (v >= arr.eventTime1 && v <= arr.eventTime2) return i;
    return -1;
  };
  let n, x = [];
  for (let i = 0; i < a.length; a++) {
    n = inside(a[i].eventTime1, x);
    if (n < 0) x.push(a[i]);
    else if (x[n].eventTime2 < a[i].eventTime2) x[n].eventTime2 = a[i].eventTime2;
  }
  x.sort(cmp);
  return x;
};

Page({
  data: {
    examState: ["未审批", "撤回", "未通过", "通过", "待归还", "已归还"],
    newMaterialsExamState: ["未审批", "已审批"],
    commentLength: 0,
    maxCommentLength: 140,
    type: '',
    category:['服饰类','宣传类','奖品类','工具类','装饰类','文本类','其他'],
    genreLetters : ["A", "B", "C", "D", "E", "F", "G"],
    locationArray: [['一号仓库', '二号仓库', "三号仓库", '四号仓库'], ['无货架号', '货架号1', '货架号2', '货架号3', '货架号4', '货架号5', '货架号6'], ['无分区号','分区A', '分区B', '分区C', '分区D','分区E']],
    eventInfo: [{
      badge: "group.png",
      name: "申请单位",
      value: "association"
    }, {
      badge: "user.png",
      name: "申请人",
      value: "responser"
    }, {
      badge: "phone.png",
      name: "联系方式",
      value: "tel"
    }, {
      badge: "bookmark.png",
      name: "活动名称",
      value: "name"
    }, {
      badge: "flag.png",
      name: "活动内容",
      value: "content"
    }],
    materialInfo: [{
      badge: "group.png",
      name: "申请单位",
      value: "association"
    }, {
      badge: "user.png",
      name: "申请人",
      value: "name"
    }, {
      badge: "phone.png",
      name: "联系方式",
      value: "phoneNumber"
    }, {
      badge: "flag.png",
      name: "借用用途",
      value: "description"
    }]
  },
  onLoad: function(options) {
    const PAGE = this
    // get url_get info
    if (!options.id || !(/[0-9A-Za-z_-]{16}/.test(options.id))) {
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
    this.setData(options);
    // console.log('[viewApproval] type = ', this.data.type);
    console.log('onLoad options',options);
    // get database
    fetchDB(this).then(() =>{
      console.log('fetch DB back!PAGE.data is',PAGE.data)
      // HACK: 如果页面是从borrowThings导航而来，则表明该物品被管理员认为是原有物资 
      // 于是覆盖掉表单上关于物品是否为原有物资的信息
      if (PAGE.data.isOriginalMaterials)
      PAGE.setData({
        "appr.isOriginalMaterials":true,
        "appr.itemDocId":PAGE.data.itemDocId
      })
    }) //end of then
    },
  /* 用户下拉动作刷新 */
  onPullDownRefresh: function() {
    fetchDB(this).then(() => {
      wx.stopPullDownRefresh();
    });
  },
  submit: function(e) {
    var flag = Number(e.detail.target.dataset.flag);
    const value = e.detail.value;
    const PAGE = this;

    if (value.comment)    value.comment = value.comment.trim();
    if (value.returnComment) value.returnComment = value.returnComment.trim();
    

    if (PAGE.data.appr.exam == 4) flag = flag == 3 ? 5:6; //若同意 则归还的flag设为5
    console.log("[update]", this.data.id, " [flag]", flag, " [value]", value);

    // switch db.collection
    if (PAGE.data.type == 'facilities') var collectionName = "forms";
    else if (PAGE.data.type == 'materials') var collectionName = "formsForMaterials";
    wx.showLoading({
      title: "提交中",
      mask: true
    });
    // call cloud function
    wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "updateAppr",
        collection: collectionName,
        docID: this.data.id,
        isDoc: true,
        operate: "update",
        update: {
          check: value,
          exam: flag
        }
      }
    }).then(res => {
      console.log("[updateApproval]", res);
      wx.hideLoading();
      // [Boolean]res.error indicates if calling has error
      if (res.err || res.updated < 1) wx.showToast({
        title: "出错了, 请稍后重试",
        icon: "none",
        duration: 3000,
        mask: true
      });
      else wx.showToast({
        title: "更新成功",
        icon: "success",
        duration: 2000,
        mask: true
      });
      fetchDB(PAGE);
    }).catch(console.error);
  },

  submitNewMaterials: function(e){
  // Note: formsData中itemName和itemId直接可用 
  // 其余数据来自PAGE.data.appr (aka. apprData)
    const formsData = e.detail.value;
    const PAGE = this;
    const apprData = PAGE.data.appr;

    if(formsData.description) formsData.description = formsData.description.trim();

    //若为原有物资
    if (apprData.isOriginalMaterials) {
      console.log("[update]", apprData.itemDocId, "in  collection `item`, add quantity = ",apprData.addNumber);
      wx.showLoading({
        title: "提交中",
        mask: true
      });
    // call cloud function
    wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "addMaterials",
        collection: "items",
        docID: apprData.itemDocId,
        isDoc: true,
        operate: "update",
        update: {
          addQuantity: apprData.addNumber
        }
      }
    }).then(res => {
      console.log("[addMaterials] callFunction", res);
      // [Boolean]res.error indicates if calling has error
      if (res.result.err || res.result.stats.updated < 1) {
        wx.showToast({
          title: "出错了, 请稍后重试",
          icon: "none",
          duration: 3000,
          mask: true
        });
        return;
      }

        // call cloud function
        wx.cloud.callFunction({
          name: "operateForms",
          data: {
            caller: "updateAppr",
            collection: "addNewMaterials",
            docID: this.data.id,
            isDoc: true,
            operate: "update",
            update: {
              check: apprData.check,
              exam: 1
            }
          }
        }).then(res => {
          console.log("[updateApproval]", res);
          wx.hideLoading();
          // [Boolean]res.error indicates if calling has error
          if (res.result.err || res.updated < 1) wx.showToast({
            title: "出错了, 请稍后重试",
            icon: "none",
            duration: 3000,
            mask: true
          });
          else wx.showToast({
            title: "数据库已更新",
            icon: "success",
            duration: 2000,
            mask: true
          });
          fetchDB(PAGE);
        }).catch(console.error);
        
    }).catch(err => {
      console.error(err);
      return;
    });

    }

    else {
      console.log("[add] new item in collection `item`, [formsData]", formsData)
      console.log("apprData",apprData)
      if (!formsData.itemId || !formsData.itemName){
        wx.showModal({
          title: "提交失败",
          content: "信息不完整",
          showCancel: false,
          confirmText: "再去改改"
        });
        return;
      }

      db.collection("items").where({
        "itemId":formsData.itemId
      }).count().then(res => {
        if (!res.total)
        { let formObj = {
          itemName: formsData.itemName,
          itemId: formsData.itemId,
          description:formsData.description,
          genre: apprData.genre,
          location: apprData.location,
          quantity: apprData.addNumber
          
        }
        console.log("formObj", formObj, res.total)
        wx.showLoading({
          title: "提交中",
          mask: true
        });
        db.collection("items").add({
          data: formObj,
          success(res) {
            console.log("Successfully add to db!");
            console.log("res:", res)
          }, fail(res) {
            console.error;
            return
          }
        });

        // call cloud function
        wx.cloud.callFunction({
          name: "operateForms",
          data: {
            caller: "updateAppr",
            collection: "addNewMaterials",
            docID: this.data.id,
            isDoc: true,
            operate: "update",
            update: {
              check: apprData.check,
              exam: 1
            }
          }
        }).then(res => {
          console.log("[updateApproval]", res);
          wx.hideLoading();
          // [Boolean]res.error indicates if calling has error
          if (res.result.err || res.updated < 1) wx.showToast({
            title: "出错了, 请稍后重试",
            icon: "none",
            duration: 3000,
            mask: true
          });
          else wx.showToast({
            title: "数据库已更新",
            icon: "success",
            duration: 2000,
            mask: true
          });
          fetchDB(PAGE);
        }).catch(console.error);
      } // end of if(!res.total) 
        else {     
            wx.showModal({
          title:"提交失败",
          content:"物资id已存在",
          showCancel:false,
          confirmText:"再去改改"
        });
        return;}
    })

    }// end of else

  },

  /**
   * userInput()
   * 输入活动内容时的响应, 显示字数
   * @param {Object} e 传入的事件, e.detail.value为文本表单的内容
   */
  userInput: function(e) {
    this.setData({
      commentLength: e.detail.value.length
    });
  },
  /**
   * checkAvailTime()
   * 检查该审批的借用时间内该教室是否空闲
   */
  checkAvailTime: function() {
    const a = this.data.appr;
    if (!a || Object.keys(a).length === 0) return false;
    const filter = {
      exam: 3,
      classroomNumber: a.classroomNumber,
      eventDate: app._toDateStr(new Date(a.eventDate), true)
    };
    console.log("[filter]", filter);
    db.collection("forms").where(filter).field({
        eventTime1: true,
        eventTime2: true,
        formid: true
      }).get()
      .then(res => {
        console.log("[checkAvailTime]res", res);
        res.data.sort(cmp);
        let arr = getInter(res.data);
        console.log("[intervals]", arr);
        if (arr.length) {
          // 当天有借用
          const str = arr.reduce((s, cur) => {
            return s + "\n" + cur.eventTime1 + "-" + cur.eventTime2;
          }, ""); // reduce 转为字符串
          console.log("[str]", str);
          wx.showModal({
            title: "查询结果",
            content: "当天占用时间: \n" + str,
            showCancel: false,
            confirmText: "好的"
          });
        } else {
          // 当天全天无借用
          wx.showModal({
            title: "查询结果",
            content: "全天空闲",
            showCancel: false,
            confirmText: "知道了"
          });
        }
        return;
      });
  },

  switchChange: function(e) {
    const PAGE = this
    console.log('switch发送选择改变，携带值为', e.detail.value)
    PAGE.setData({
      'appr.isOriginalMaterials': e.detail.value
     })
  },

  bindCategoryChange: function (e) {
    console.log('genre picker发送选择改变，携带值为', e.detail.value)
    const PAGE = this
    const genreLetters = PAGE.data.genreLetters
    let value = e.detail.value

    this.setData({
      "appr.genre": genreLetters[value],
      "appr.genreIndex": value
    })
    console.log(PAGE.data.genre)
  },//新增物资类别

    /**
   * 将picker传入的数组 e.g.[0,2,1] 转换为数据库中的location数组
   * 其中location格式为 [1, 2, 'A'] 
   * *note*:若后两位为0则删去， 若中间为0，第三位不为零，则中间设置为null
   */
  bindLocationPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const PAGE = this;
    let value = e.detail.value;

    function locationIndexToLocation(idx){
      var value1= idx.slice();

      value1[0] = value1[0] +  1;
      if (value1[2] == 0) {
        value1.pop();
        if (value1[1] == 0) value1.pop();
      }
      else 
      { value1[2] = PAGE.data.genreLetters[value1[2]-1]
        // convert index to genre letters
        if (value1[1] == 0) value1[1] = null;}

      return value1
    }
    let loc = locationIndexToLocation(value);
    console.log("location",loc)
    console.log("locationIndex",value)
    PAGE.setData({
      "appr.location": loc,
      "appr.locationIndex": value
    })

    console.log(PAGE.data)
  }//物资位置
})
// pages/addThings/add.js
const app = getApp();
const db = wx.cloud.database();
const forms = db.collection("addNewMaterials");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    category:['服饰类','宣传类','奖品类','工具类','装饰类','文本类','其他'],
    materialIndex:0,
    index: 0,
    locationArray: [['一号仓库', '二号仓库', "三号仓库", '四号仓库'], ['我不清楚', '货架号1', '货架号2', '货架号3', '                       货 架号4', '货架号5', '货架号6'], ['我不清楚','分区A', '分区B', '分区C', '分区D','分区E']],
   
    locationIndex: [0, 1, 1],
    date: app._toDateStr(new Date(), true),
   
    },
  bindCategoryChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      materialIndex: e.detail.value
    })
  },//新增物资类别

 bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindLocationPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      locationIndex: e.detail.value
    })
  },//物资位置

  bindDateChange: function(e)
  {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
     date: e.detail.value
    })
  },//新增时间

  


  //校验Forms
  toFormObject: function (data) {
    const p = this.data;
    if (!p.locationIndex) return {
      err: "请选择新增物资摆放位置"
    };
    //选择判断待改进
    // trim and judge
    const trimArr = [
      ["associationName", "单位名称"],
      ["addNumber", "新增物资数量"],
      ["newmaterialName","新增物资名称"],
      ["responser", "负责人姓名"],
      ["phone", "联系方式"],
      ["studentID", "学号"],
      ["school&Class","院系和班级"]
     
    ];
    for (let i = 0; i < trimArr.length; i++) {
     // data[trimArr[i][0]] = data[trimArr[i][0]].trim();//去除空格？
      if (!data[trimArr[i][0]]) return {
        err: "请填写" + trimArr[i][1]
      };
    }
    // end trim and judge

    data.attendNumber = Number(data.attendNumber);
    if (!data.addNumber || data.addNumber < 0) return {
      err: "请正确填写新增物资数量"
    };

    if (!(/\d{11}/.test(data.phone))) return {
      err: "请填写正确的手机号"
    };
    return {
      
     
        addAssociation:data["associationName"],
        addNumber: Number(data["addNumber"]),
        location:data["locationIndex"],
        addDate: p.date,
        category:Number(data["materialIndex"]),//类别目录
        newMaterialName: data["newmaterialName"],
        responser: data["responser"],
        tel: data.phone,
        studentID: data.studentID,
       
      
      // exam: 0
      
      //改为物资对应信息
    }
  },//校验结束

  /**
     * 在线填表页面点击提交的函数
     */
  submit: function (e) {
    const PAGE = this;//ERR formid读取失败，疑似没有正确连接数据库，读取逻辑也要改进
    const formsData = e.detail.value;
    // console.log("[formsData]",formsData);
    let formObj = this.toFormObject(formsData);
    // has error
    if (formObj.hasOwnProperty("err")) {
      wx.showModal({
        title: "提交失败",
        content: formObj.err,
        showCancel: false,
        confirmText: "再去改改"
      });
      return;
    }
    forms.orderBy("formid", "desc").limit(3).get()
      .then(res => {
        console.log(res.data);
        const maxFormid = res.data[0].formid || new Date().getFullYear() * 100000;//ERR未生成formID?
       // const newFormID = res.data[0].formid + new Date().getDate()*100000
        console.log("[max formid]", maxFormid);
        console.log(res.data);
        formObj.formid = maxFormid + 1;
        console.log("[formObj]", formObj);
       
        // begin forms.add()
        forms.add({
          data: formObj,
          success(res) {
            console.log("Successfully add to db!");
            wx.showModal({
              title: "提交成功",
              content: "请妥善保留发票按流程报销",
              success: res => {
                if (res.confirm)
                  wx.navigateBack({
                    delta: 1
                  });
              }
            });
            // end showModal
          }
        });
        // end forms.add()
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
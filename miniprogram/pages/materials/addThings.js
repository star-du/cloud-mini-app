// pages/addThings/add.js
const app = getApp();
const db = wx.cloud.database();
const forms = db.collection("addNewMaterials");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // array: [], 
    location: [1, 1], //location 初值为[1,1] 即对应：一号仓库 货架号1 无分区
    category:['服饰类','宣传类','奖品类','工具类','装饰类','文本类','其他'],
    genreLetters : ["A", "B", "C", "D", "E", "F", "G"],
    genreIndex:0,
    genre: "A",
    // index: 0,
    isOriginalMaterials: true,
    locationArray: [['一号仓库', '二号仓库', "三号仓库", '四号仓库'], ['无货架号', '货架号1', '货架号2', '货架号3', '货架号4', '货架号5', '货架号6'], ['无分区号','分区A', '分区B', '分区C', '分区D','分区E']],
    locationIndex: [0, 1, 0], //用于选择器的index信息
    date: app._toDateStr(new Date(), true)
   
    },
  bindCategoryChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const PAGE = this
    const genreLetters = PAGE.data.genreLetters
    let value = e.detail.value

    this.setData({
      genre: genreLetters[value],
      genreIndex: value
    })
    console.log(PAGE.data.genre)
    console.log(PAGE.data.genreIndex)
  },//新增物资类别

 bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 将picker传入的数组 e.g.[0,2,1] 转换为数据库中的location数组
   * 其中location格式为 [1, 2, 'A'] 
   * *note*:若后两位为0则删去， 若中间为0，第三位不为零，则中间设置为null
   */
  bindLocationPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const PAGE = this;
    const value = e.detail.value;

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
      location: loc,
      locationIndex: value
    })
    console.log(PAGE.data)
  },//物资位置

  bindDateChange: function(e)
  {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
     date: e.detail.value
    })
    console.log(this.data.date)
  },//新增时间

  switchChange: function(e) {
    const PAGE = this
    console.log('switch发送选择改变，携带值为', e.detail.value)
    PAGE.setData({
      isOriginalMaterials:e.detail.value
     })
     console.log(PAGE.data)
  },

  


  //校验Forms
  toFormObject: function (data) {
    const p = this.data;
    if (p.isOriginalMaterials && !p.itemId) return {
      err: "请选择原有物资"
    };
    //选择判断待改进
    // trim and judge
    var trimArr = [
      ["associationName", "单位名称"],
      ["responser", "负责人姓名"],
      ["phone", "联系方式"],
      // ["studentID", "学号"],
      // ["school&Class","院系和班级"]
     
    ];
    if (!p.isOriginalMaterials)
    {trimArr.push(
      ["addNumber", "新增物资数量"],
      ["newmaterialName","新增物资名称"])}

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

    //TODO：新增原有物资时是否需要locationIndex?
    if (p.isOriginalMaterials)
    return {
        isOriginalMaterials:true,
        addAssociation:data["associationName"],
        addNumber: Number(data["addNumber"]),
        location:p.location, 
        addDate: p.date,
        //isOriginalMaterials == true
        itemId:p.itemId,
        itemName:p.itemName,
        itemDocId: p.itemDocId,
        name: data["responser"],
        phoneNumber: data.phone,
        // studentID: data.studentID,
        comment: data.remarks,
        submitDate: new Date(),
        exam: 0      
    }
    else
    return {
      isOriginalMaterials:false,
      addAssociation:data["associationName"],
      addNumber: Number(data["addNumber"]),
      location:p.location,
      locationIndex: p.locationIndex,
      addDate: p.date,
      //isOriginalMaterials == false
      genre:p.genre,//类别目录
      genreIndex: p.genreIndex,
      newMaterialName: data["newmaterialName"],
      name: data["responser"],
      phoneNumber: data.phone,
      // studentID: data.studentID,
      comment: data.remarks,
      submitDate: new Date(),
      exam: 0      
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
    // console.log("[formObj]", formObj);
    forms.orderBy("formid", "desc").limit(3).get()
      .then(res => {
        let prefix = (new Date().getFullYear() - 2000) + (1 < new Date().getMonth() < 8 ? "Spri" : "Fall")
        let newFormNumber = "00001";
        if (res.data[0] && res.data[0].formid.slice(0,6) == prefix ) 
        newFormNumber = (res.data[0].formid.slice(6,11) * 1 + 100001).toString().slice(1, 6); 
        //NOTE: "abc".slice(0,2) = "ab" not "abc" !
        // console.log("[max formid]", newFormNumber);
        formObj.formid = prefix + newFormNumber;
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
                  if (PAGE.data.isOriginalMaterials){
                    wx.navigateBack({
                      delta: 3
                    });
                  }
                  else{
                  wx.navigateBack({
                    delta: 1
                  });}
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
    // console.log("options",options)
    const PAGE = this
    PAGE.setData(options)
    // console.log(this.data)
    if (PAGE.data.isOriginalMaterials && PAGE.data.itemId)
    {
      db.collection("items").where({
        itemId : PAGE.data.itemId
      }).get({
        success(e) {
          if (e.data.length == 1)
          {location = e.data[0].location;
          console.log("Item location:"+location);}
          else console.error('itemId is not unique');
          PAGE.setData({
            location: location
          })
        .catch(err => {
      console.error("[itemLocation]failed", err);
     })
    },
     fail: console.error
    })}
  

    // if (options.itemName && options.itemId)
    // this.setData({
    //   itemName: options.itemName,
    //   itemId: options.itemId
    // })
    console.log('[addThings]',PAGE.data)
   
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
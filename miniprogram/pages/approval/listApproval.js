// pages/approval/listApproval.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    apprList: [],
    examState: ["未审批", "撤回", "未通过", "通过", "待归还", "已归还"],
    newMaterialsExamState: ["未审批", "已审批"],
    flagGet: -1
  },
  /**
   * onLoad()
   * 页面加载事件
   */
  onLoad: function(options) {
    // check url get
    if (this.getUrl(options) === false) {
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
          }, 3050);
        }
      });
    } else {
      this.setData({
        type: options.type
      });
      console.log('list approval', this.data);
      if (options.type === 'materials') {
        //console.log('fetch formsForMaterials for approval');
        this.fetchMatData();
        return;
      }
      else if (options.type === 'facilities') {
        this.fetchFacData();
        return;}
      else if (options.type === 'newMaterials') {
        // console.log('TODO: add new materials')
        this.fetchNewMatData();
        return;}
      else {
        console.error('[listApproval] Missing parameters')
      }
    }
  },
  /**
   * getUrl()
   * @param {Object} options 传入的get对象(options)
   */
  getUrl: function(options) {
    const last = (day) => {
      const d = new Date();
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
    };
    let obj = {};
    let x = Number(options.flag);
    if (!isNaN(x) && x >= 0) obj.exam = x;

    x = Number(options.expireSubmit);
    if (!isNaN(x)) {
      obj.exSubmit = x;
      this.setData({
        expire: x + "天"
        // expire: "所有时间"
      });
    } else {
      this.setData({
        expire: "所有时间"
      });
    }
    console.log("[getUrl]", obj);
    this.setData({
      filter: obj
    });
    return (Object.keys(obj).length > 0) ? obj : false;
  },
  /**
   * 用户下拉动作刷新
   */
  onPullDownRefresh: function() {
    this.fetchFacData().then(wx.stopPullDownRefresh);
  },
  /**
   * fetchFacData()
   * 调用云函数获取场地借用审批
   */
  fetchFacData: function() {
    const that = this;
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getApprList",
        collection: "forms",
        filter: this.data.filter,
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchFacData]res", res);
      if (res.result.err) {
        console.error("ERROR", res.result.errMsg);
        return;
      }

      let x = res.result.data;
      if (x.length) {
        for (let i = 0; i < x.length; i++)
          x[i].eventDate = app._toDateStr(new Date(x[i].eventDate));
        that.setData({
          apprList: x,
          flagGet: x.length ? 1 : 0
        });
      } else {
        that.setData({
          apprList: [],
          flagGet: 0
        });
      }
      console.log(that.data.apprList);
    }).catch(err => {
      console.error("[newFetchData]failed", err);
    });
  },

  // /*NOTE:尚未写成云函数!!! */
  // fetchFormsForMaterials: function() {
  //   const that = this;
  //   // console.log('filter=',that.data.filter);
  //   db.collection('formsForMaterials').where({
  //       exam: that.data.filter.exam
  //     })
  //     .get({
  //       success(res) {
  //         // res.data 是包含以上定义的两条记录的数组
  //         console.log(res.data);
  //         that.setData({
  //           apprList: res.data,
  //           flagGet: res.data.length ? 2 : 0 /*2 denotes materials*/
  //         })
  //         // console.log('flag=',that.data.flagGet)
  //       }
  //     })
  // },

  /**
   * fetchMatData()
   * 调用云函数获取物资借用审批
   */
  fetchMatData: function() {
    const that = this;
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getApprovalList",
        collection: "formsForMaterials",
		    filter: that.data.filter,	
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchMatData]res", res);
      if (res.result.err) {
        console.warn("ERROR");
        return;
      }

      let x = res.result.data;
      if (x.length) {
        for (let i = 0; i < x.length; i++)
          {x[i].eventTime1 = app._toDateStr(new Date(x[i].eventTime1));
          x[i].eventTime2 = app._toDateStr(new Date(x[i].eventTime2));}          
        that.setData({
          apprList: x,
          flagGet: x.length ? 2 : 0
        });
      } else {
        that.setData({
          apprList: [],
          flagGet: 0
        });
      }
      console.log(that.data.apprList);
    }).catch(err => {
      console.error("[newFetchData]failed", err);
    });
  },

  /**
   * fetchNewMatData()
   * 调用云函数获取物资借用审批
   */
  fetchNewMatData: function() {
    const that = this;
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "getApprovalList",
        collection: "addNewMaterials",
		    filter: that.data.filter,	
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchNewMatData]res", res);
      if (res.result.err) {
        console.warn("ERROR");
        return;
      }

      let x = res.result.data;
      if (x.length) {
        that.setData({
          apprList: x,
          flagGet: x.length ? 3 : 0
        });
      } else {
        that.setData({
          apprList: [],
          flagGet: 0
        });
      }
      console.log(that.data.apprList);
    }).catch(err => {
      console.error("[newFetchData]failed", err);
    });
  }


})
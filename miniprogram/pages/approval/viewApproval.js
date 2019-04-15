// pages/approval/viewApproval.js
const app = getApp();
const db = wx.cloud.database();

function fetchDB(PAGE) {
  return db.collection("forms").doc(PAGE.data.id).get().then(res => {
    console.log("[fetch DB]Get database", res.data);
    if (res.data) {
      let x = res.data;
      x.submitDate = app._toDateStr(x.submitDate);
      x.eventDate = app._toDateStr(new Date(x.eventDate));
      PAGE.setData({
        appr: x || {}
      });
      if (x.check && x.check.comment) {
        PAGE.setData({
          commentLength: x.check.comment.length
        });
      }
      if (!x.check || !x.check.approver) {
        PAGE.setData({
          "appr.check.approver": app.loginState.name
        });
      }
    } else {
      console.error("Cannot get data");
    }
  });
}

Page({
  data: {
    examState: ["未审批", "撤回", "未通过", "通过"],
    commentLength: 0,
    maxCommentLength: 140,
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
    }]
  },
  onLoad: function(options) {
    // get url_get info
    console.log(options);
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
    // get database
    fetchDB(this);
  },
  /* 用户下拉动作刷新 */
  onPullDownRefresh: function() {
    fetchDB(this).then(() => {
      wx.stopPullDownRefresh();
    });
  },
  submit: function(e) {
    const flag = Number(e.detail.target.dataset.flag);
    const value = e.detail.value;
    value.comment = value.comment.trim();
    console.log(flag, value, this.data.id);
    const PAGE = this;
    wx.showLoading({
      title: "提交中",
      mask: true
    });
    // call cloud function
    wx.cloud.callFunction({
      name: "updateApproval",
      data: {
        updateID: this.data.id,
        check: value,
        exam: flag
      }
    }).then((res) => {
      console.log("[updateApproval]ok", res);
      wx.hideLoading();
      // [Boolean]res.error indicates if calling has error
      if (res.error || res.updated === 0) {
        wx.showToast({
          title: "出错了, 请稍后重试",
          icon: "none",
          duration: 2000,
          mask: true
        });
      } else {
        wx.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2000,
          mask: true
        });
      }
      fetchDB(PAGE);
    }).catch(console.error);
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
        console.log("[checkAvailTim]", res);
        const cmp = (_x, _y) => {
          return _x.eventTime1 == _x.eventTime1 ? _x.eventTime2 < _y.eventTime2 : _x.eventTime1 < _y.eventTime1
        };
        const getInter = (a) => {
          const inside = (v, arr) => {
            for (let i = 0; i < arr.length; i++)
              if (v >= arr.eventTime1 && v <= arr.eventTime2) return i;
            return -1;
          };
          let x = [],
            n;
          for (let i = 0; i < a.length; a++) {
            n = inside(a[i].eventTime1, x);
            if (n < 0) x.push(a[i]);
            else if (x[n].eventTime2 < a[i].eventTime2) x[n].eventTime2 = a[i].eventTime2;
          }
          x.sort(cmp);
          return x;
        };

        let arr = res.data;
        arr.sort(cmp);
        arr = getInter(arr);
        console.log("[interval]", arr);
        const str = arr.length ? arr.reduce((s, cur) => {
          console.log(cur);
          return s + "\n" + cur.eventTime1 + "-" + cur.eventTime2;
        }, "") : "全天空闲";
        console.log("[str]", str);
        wx.showModal({
          title: "查询结果",
          content: arr.length ? ("占用时间: " + str) : str,
          showCancel: false,
          confirmText: "好的"
        });
      });
  }
})
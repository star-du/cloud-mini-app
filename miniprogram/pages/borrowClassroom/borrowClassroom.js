//初始化数据库
wx.cloud.init();
const app = getApp();
const db = wx.cloud.database();
const forms = db.collection('forms');
const judge = /\d{11}/;

Page({
  data: {
    index: 0,
    date: "2019-01-01",
    time1: "07:00",
    time2: "07:00", //Todo: time2 有效范围从time1 - 24.00
    index: 0,
    array: ["请选择", "201", "202", "203", "204", "205", "206", "207", "208"]
  },

  onLoad() {
    wx.showModal({
      title: '注意事项',
      content: '\n1、请至少提前两天准备好活动策划。在Hust社联场地借用小程序上申请借用教室，并将策划电子版以“36号楼教室借用＋协会名称＋日期”的方式命名发送至秘书部公邮mishu@hustau.com。审批情况可在小程序上查询，通过者可将确认单打印；\n2、使用教室的当天须将教室借用确认单打印成纸质版（双面打印）交至36号楼1楼社联值班室，并在教室借用表上进行借用登记；\n3、建议申请前先查询教室是否空闲，查询方式：Hust社联场地借用小程序-公告版； \n4、房间钥匙放置于36号楼1楼社联值班室内，教室使用结束后请将门锁好并把钥匙放回原位；\n5、普通教室须有活动负责人陪同使用并保证器材设备完好，活动结束后请将教室清理干净、桌椅归位，如发现教室卫生及器材损坏问题将影响未来二次借用，谢谢配合；\n6、如有任何疑问，请联系36号楼教室借用负责人 白依萱：13621381497。',
      showCancel: false,
      confirmText: '好',
    })
    
    const PAGE = this; // 使得get回调函数可以访问this.setData
    // 获取db数据
    /*
    db.collection('formid').where({
      name:'latest_id'
    }).get({
      success(e) {
        console.log(e, e.data);
        PAGE.setData({
          formid: e.data[0].formid
        });
        console.log(PAGE.data);
      },
      fail: console.error
    });*/
  },

  /*在线填表页面点击报名的函数*/
  submit: function (e) {
    const formsData = e.detail.value;
    const PAGE = this;

    //TODO:仿照hustauEntrance:join-us中对不同错误给出不同提示

    if (PAGE.data.index === 0 || !judge.test(formsData["responserPhone"])) {
      wx.showModal({
        title: "提交失败",
        content: "请检查表单填写是否正确",
        showCancel: false,
        confirmText: "回去修改"
      });
      return;
    }

    db.collection('forms').orderBy('formid', 'desc').limit(3)
      .get({
        success(res) {
          const maxFormid = res.data[0].formid || new Date().getFullYear() * 100000;
          console.log("The existing maximum formid is: ", maxFormid);
          forms.add({
            data: {
              formid: maxFormid + 1,
              classroomNumber: PAGE.data.array[PAGE.data.index],
              eventDate: PAGE.data.date,
              eventTime1: PAGE.data.time1,
              eventTime2: PAGE.data.time2,
              event: {
                association: formsData["associationName"],
                attendNumber: Number(formsData["attendNumber"]),
                content: formsData["eventContent"],
                name: formsData["eventName"],
                responser: formsData["eventResponser"],
                tel: formsData["responserPhone"]
              },
              submitDate: new Date(),
              exam: 0
            },
            success(res) {
              console.log("Successfully add to db!")
              wx.showModal({
                title: '提交成功',
                content: '请将策划案发送至公邮mishu@hustau.com，并耐心等待审核结果',
                success: function (res){
                  if(res.confirm){
                    wx.navigateBack({
                      delta:1
                    })
                  }
                }
              })
            }
          });
        }
      });
  },

  /*活动日期picker改变的函数*/
  bindDateChange: function (e) {
    console.log("eventDate发送选择改变，携带值为", e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /*活动时间picker改变的函数1*/
  bindTimeChange1: function (e) {
    console.log("eventTime1发送选择改变，携带值为", e.detail.value)
    this.setData({
      time1: e.detail.value
    })
  },
  /*活动时间picker改变的函数2*/
  bindTimeChange2: function (e) {
    console.log("eventTime2发送选择改变，携带值为", e.detail.value)
    this.setData({
      time2: e.detail.value
    })
  },
  /*借用教室picker改变的函数*/
  bindNumberChange: function (e) {
    console.log("classroomNumber发生选择改变，携带值为", e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
});
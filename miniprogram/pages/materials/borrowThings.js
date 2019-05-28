const db = wx.cloud.database();

Page({
  data: {
    items: 0,
    tags: ["锦旗", "灯", "电子设备", "杂物"],
    goods: [],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0,
    carArray: [],
    item:[],
  },
  //点击加号跳转至表单
  navtoForm(e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var name = this.data.goods[parentIndex].items[index].name;
    var mark = 'a' + index + 'b' + parentIndex;
    var obj = {name: name, index: index, parentIndex: parentIndex};
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    carArray1.push(obj)
    //console.log(carArray1);
    this.setData({
      carArray: carArray1,
      goods: this.data.goods,
      item: this.data.goods[parentIndex].items[index],
    });
    // const data = e.currentTarget.dataset;
    // wx.navigateTo(data);  
    // wxml中已设置navigator url
  },
  
  onLoad: function (options) {
    this.getDatabase();
  },

  //导航栏跳转
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log(this.data.toView);
  },

  //获取数据库
  //TODO:当物品条数高于100时，需要skip操作（get有100条的获取限制）
  getDatabase: function () {
    const PAGE = this;
    db.collection("items").get().then(e => {
      PAGE.setData({
        goods:e.data
      })
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
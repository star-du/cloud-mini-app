const db = wx.cloud.database();

Page({
  data: {
    items: 0,
    // tags: ["锦旗", "灯", "电子设备", "杂物"],
    availableItems:{},
    availableItemsGenres:[],
    // goods: [],
    toView: 'number0',
    scrollTop: 100,
    // foodCounts: 0,
    // carArray: [],
    item:[],
    genreToChineseName: {"A" : "服饰类", 
        "B" : "宣传类",
        "C" : "奖品类",
        "D" : "工具类",
        "E" : "装饰类",
        "F" : "文本类",
        "G" : "其他"
  }
  },
  //点击加号跳转至表单
  navtoForm(e) {
    // var index = e.currentTarget.dataset.itemIndex;
    // var parentIndex = e.currentTarget.dataset.parentindex;
    // var name = this.data.goods[parentIndex].items[index].name;
    // var mark = 'a' + index + 'b' + parentIndex;
    // var obj = {name: name, index: index, parentIndex: parentIndex};
    // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    // carArray1.push(obj)
    // //console.log(carArray1);
    // this.setData({
    //   carArray: carArray1,
    //   goods: this.data.goods,
    //   item: this.data.goods[parentIndex].items[index],
    // });
    // const data = e.currentTarget.dataset;
    // console.log("navtoForm",data)
    // wx.navigateTo(data);  
    // wxml中已设置navigator url
  },
  
  onLoad: function (options) {
    // this.getDatabase();
    this.fetchItemsData();
    if (options.extra == "selectOriginalMaterial" ){
      this.setData({
        navBackTo:options.navBack,
        selectOriginalMaterial: true
      });

      if (options.navBack == '../approval/viewApproval')
      this.setData({
        navBackExtraData: '&id=' + options.itemDocId + '&type=newMaterials' + '&isOriginalMaterials=true' 
      });
      
    }
    
    console.log('[borrowThings]',this.data)
    },

  //导航栏跳转
  selectMenu: function (e) {
    console.log(e);
    this.setData({
      toView:e.target.id
    })
  },

  //获取数据库
  //TODO:当物品条数高于100时，需要skip操作（get有100条的获取限制）
  // getDatabase: function () {
  //   const PAGE = this;
  //   db.collection("items").get().then(e => {
  //     PAGE.setData({
  //       goods:e.data
  //     })
  //   })
  // },

  /**
   * fetchItemsData()
   * 调用云函数获取可借用的物资信息
   */
  fetchItemsData: function() {
    const PAGE = this;
    return wx.cloud.callFunction({
      name: "operateForms",
      data: {
        caller: "fetchItemsData",
        collection: "items",
		    filter: {"quantityGreaterThan":0},	
        operate: "read"
      }
    }).then(res => {
      console.log("[fetchItemsData] res", res);
      if (res.result.err) {
        console.log("[fetchItemsData] error", res.result.err);
        return;
      }
    
      let x = res.result.data;
      let categorizedItems = {};
      if (x.length){
          for (let i=0;i<x.length;i++){
              let itemGenre = x[i].genre
              if (!categorizedItems[itemGenre]) categorizedItems[itemGenre] = [];
              categorizedItems[itemGenre].push(x[i])
          }
          
          // console.log(Object.keys(categorizedItems))
          PAGE.setData({
            availableItems : categorizedItems,
            availableItemsGenres: Object.keys(categorizedItems)
          });          
      }
      // console.log('categorizedItems', categorizedItems)
      console.log(PAGE.data)
      
    //   if (x.length) {
    //     for (let i = 0; i < x.length; i++)
    //       {x[i].eventTime1 = app._toDateStr(new Date(x[i].eventTime1));
    //       x[i].eventTime2 = app._toDateStr(new Date(x[i].eventTime2));}          
    //     PAGE.setData({
    //       apprList: x,
    //       flagGet: x.length ? 2 : 0
    //     });
    //   } else {
    //     PAGE.setData({
    //       apprList: [],
    //       flagGet: 0
    //     });
    //   }
    //   console.log(PAGE.data.apprList);
    // }).catch(err => {
    //   console.error("[newFetchData]failed", err);
    });
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
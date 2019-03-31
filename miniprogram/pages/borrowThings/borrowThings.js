// miniprogram/pages/borrowThings/borrowThings.js
const db = wx.cloud.database();

Page({
  data: {
    items: 0,
    tags: ["锦旗", "灯", "电子设备", "杂物"],
    goods: [{
        "name": "锦旗",
        "items": [{
          "_id": "1",
          "itemid": 1,
          "name": "思存工作室锦旗1",
          "description": "红底黄字的一面锦旗",
          "count": 1,
          "tags": ["锦旗"],
          "repo": 1
        }, {
          "_id": "1",
          "itemid": 1,
          "name": "思存工作室锦旗2",
          "description": "红底黄字的一面锦旗",
          "count": 1,
          "tags": ["锦旗"],
          "repo": 1
        }, {
          "_id": "1",
          "itemid": 1,
          "name": "思存工作室锦旗3",
          "description": "红底黄字的一面锦旗",
          "count": 1,
          "tags": ["锦旗"],
          "repo": 1
        }]
      }, {
        "name": "灯",
        "items": [{
            "_id": "2",
            "itemid": 1,
            "name": "led灯1",
            "description": "用于照明",
            "count": 2,
            "tags": ["灯"],
            "repo": 2
          },
          {
            "_id": "2",
            "itemid": 1,
            "name": "led灯2",
            "description": "用于照明",
            "count": 2,
            "tags": ["灯"],
            "repo": 2
          }
        ]
      },
      {
        "name": "电子设备",
        "items": [{
          "_id": "3",
          "itemid": 3,
          "name": "音响",
          "description": "不是hifi",
          "count": 1,
          "tags": ["电子设备"],
          "repo": 1
        }]
      },
      {
        "name": "杂物",
        "items": [{
            "_id": "4",
            "itemid": 4,
            "name": "就是杂物1",
            "description": "反正就是杂物",
            "count": 2,
            "tags": ["杂物"],
            "repo": 2
          },
          {
            "_id": "4",
            "itemid": 4,
            "name": "就是杂物2",
            "description": "反正就是杂物",
            "count": 2,
            "tags": ["杂物"],
            "repo": 2
          }
        ]
      }
    ],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0
  },



  onLoad: function (options) {
    let itemArr = this.initObject();
    // this.setData({
    //   goods: itemArr
    // })
    console.log(this.data)
  },

  //导航栏跳转
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log(this.data.toView);
  },

  //获取数据库某一类物品的数据，并返回一个对象
  //name=>类型，items=>物品列表
  getDatabase: function (tag) {
    console.log("getdatabase")
    db.collection("items").where({
        tags: [tag]
      }).get()
      .then(e => {
        console.log("data:" + e.data)
        let filteditem = {
          "name": tag,
          "items": e.data
        };
        return filteditem;
      })
      .catch(err => {
        console.error(err)
      })
  },

  //组合对象
  initObject: function () {
    let tags = this.tags;
    let itemArr = []
    for (let i in tags) {
      itemArr.push(getDatabase(tags[i]))
    }
    console.log(itemArr)
    return itemArr;
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
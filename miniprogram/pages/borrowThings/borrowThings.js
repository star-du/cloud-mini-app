// miniprogram/pages/borrowThings/borrowThings.js
const db = wx.cloud.database();

Page({
  data: {
    items: 0,
    tags: ["锦旗","灯","电子设备","杂物"],
    goods: [{
        "name": "热销榜",
        "type": -1,
        "items": [{
            "name": "皮蛋瘦肉粥",
            "price": 10,
            "oldPrice": "",
            "description": "咸粥",
            "sellCount": 229,
            "Count": 0,
            "info": "一碗皮蛋瘦肉粥，总是我到粥店时的不二之选。香浓软滑，饱腹暖心，皮蛋的Q弹与瘦肉的滑嫩伴着粥香溢于满口，让人喝这样的一碗粥也觉得心满意足",
            "icon": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
            "image": "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "扁豆焖面",
            "price": 14,
            "oldPrice": "",
            "description": "",
            "sellCount": 188,
            "Count": 0,
            "info": "",
            "icon": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/114/h/114",
            "image": "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "葱花饼",
            "price": 10,
            "oldPrice": "",
            "description": "",
            "sellCount": 124,
            "Count": 0,
            "info": "",
          },
          {
            "name": "南瓜粥",
            "price": 9,
            "oldPrice": "",
            "description": "甜粥",
            "sellCount": 91,
            "Count": 0,
            "rating": 100,
            "ratings": [{
                "username": "3******c",
                "rateTime": 1469281964000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              },
              {
                "username": "2******3",
                "rateTime": 1469271264000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              },
              {
                "username": "3******b",
                "rateTime": 1469261964000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              }
            ],
            "icon": "http://fuss10.elemecdn.com/8/a6/453f65f16b1391942af11511b7a90jpeg.jpeg?imageView2/1/w/114/h/114",
            "image": "http://fuss10.elemecdn.com/8/a6/453f65f16b1391942af11511b7a90jpeg.jpeg?imageView2/1/w/750/h/750"
          },
          {
            "name": "糊塌子",
            "price": 10,
            "oldPrice": "",
            "description": "",
            "sellCount": 80,
            "Count": 0,
            "rating": 93,
            "info": "",
            "ratings": [{
                "username": "3******c",
                "rateTime": 1469281964000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              },
              {
                "username": "2******3",
                "rateTime": 1469271264000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              },
              {
                "username": "3******b",
                "rateTime": 1469261964000,
                "rateType": 0,
                "text": "",
                "avatar": "http://static.galileo.xiaojukeji.com/static/tms/default_header.png"
              }
            ],
            "icon": "http://fuss10.elemecdn.com/0/05/097a2a59fd2a2292d08067e16380cjpeg.jpeg?imageView2/1/w/114/h/114",
            "image": "http://fuss10.elemecdn.com/0/05/097a2a59fd2a2292d08067e16380cjpeg.jpeg?imageView2/1/w/750/h/750"
          }
        ]
      },
      {
        "name": "单人精彩套餐",
        "type": 2,
        "items": [{
          "name": "红枣山药粥套餐",
          "price": 29,
          "oldPrice": 36,
          "description": "红枣山药糙米粥,素材包,爽口莴笋丝,四川泡菜或八宝酱菜,配菜可备注",
          "sellCount": 17,
          "Count": 0,
          "rating": 100,
          "info": "",
          "icon": "http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/114/h/114",
          "image": "http://fuss10.elemecdn.com/6/72/cb844f0bb60c502c6d5c05e0bddf5jpeg.jpeg?imageView2/1/w/750/h/750"
        }]
      }
    ],
    toView: '0',
    scrollTop: 100,
    foodCounts: 0
  },

  

  onLoad: function (options) {
    const tags = this.tags;
    for(let i=0;i<4;i++){
      const itemArr=[];
      itemArr.push(this.getDatabase(tags[i]))
    }

    this.setData({
      goods:itemArr
    })
  },

  getDatabase: function (tag) {
    console.log("getdatabase")
    db.collection("items").where({
        tags: [tag]
      }).get()
      .then(e => {
        console.log("data:" + e.data)
        const filteditem = {
          "name": tag,
          "type": 2,
          "items": e.data
        };
        return filteditem;
      })
      .catch(err => {
        console.error(err)
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
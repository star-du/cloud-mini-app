// pages/common/bigListItem.js
Component({
  /**
   * @param col{{Number}} 分栏数 1-4, 默认为2
   */
  properties: {
    col: {
      type: Number,
      value: 2
    },
    nodes: Array,
    enable: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    tap(e) {
      // console.log(e);
      const dataset = e.currentTarget.dataset;
      if (this.data.enable) {
        console.log("navigateTo", dataset.url);
        wx.navigateTo(dataset);
      } else {
        wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2000
        });
      }
    }
  }
});
// pages/common/rulePanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  /**
   * 组件的初始数据
   */
  data: {
    ruleText: getApp().globalData.rule,
    open: false,
    caret: "\u25BA"
  },
  /**
   * 组件的方法列表
   */
  methods: {
    kindToggle() {
      this.setData({
        open: !this.data.open,
        caret: this.data.open ? "\u25BA" : "\u25BC"
      });
    }
  }
})
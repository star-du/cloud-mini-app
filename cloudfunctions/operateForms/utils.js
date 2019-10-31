(function() {
  "use strict";
  let U = {};
  U.dateReg = /2\d{3}-(0\d|1[0-2])-([0-2]\d|3[01])/;
  U.maxExamNumber = 7;

  U.isArray = (obj) => {
    return obj && typeof obj === "object" && Array === obj.constructor;
  };

  U.isString = (str) => {
    return typeof str === "string";
  }

  /**
   * 判断是否是 ID String
   * @param {String} str - 待判断的字符串
   * @param {Number[]} lenArr - ID String可能的长度
   * @return {Boolean} 是否是长度为 lenArr 中任意一个的ID String
   */
  U.isIDString = (str, lenArr) => {
    if (!U.isString(str) || !U.isArray(lenArr)) return false;
    for (let i = 0; i < lenArr.length; i++) {
      if ((new RegExp("[0-9A-Za-z_-]{" + lenArr[i] + "}")).test(str)) return true;
    }
    return false;
  };

  U.isDateString = (str) => {
    return U.isString(str) && U.dateReg.test(str);
  };

  /**
   * 获取距今天 day 天之前那天的 Date 实例
   * @param {Number} day - 需得到的那天与今天隔的天数(负数表示未来的某天)
   * @return {Date} 得到的 Date 对象实例
   */
  U.lastDay = (day) => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  };

  /**
   * 判断一个数字是否在[0, maxExamNumber)范围内
   * @param {Number} num - 待判断内容
   * @return {Boolean} 是否是数字对象且在指定范围内
   */
  U.isExamNum = (num) => {
    return !isNaN(num) && (num >= 0) && (num < U.maxExamNumber);
  }

  /** error msg */
  U.EMsg = function(msg = "") {
    this.err = true;
    this.errMsg = msg;
  };

  module.exports = U;
}).call(this);
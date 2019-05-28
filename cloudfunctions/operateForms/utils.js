(function() {
  "use strict";
  let U = {};
  U.dateReg = /2\d{3}-(0\d|1[0-2])-([0-2]\d|3[01])/;

  U.isArray = (obj) => {
    return obj && typeof obj === "object" && Array === obj.constructor;
  };

  U.isString = (obj) => {
    return typeof str === "string";
  }

  U.isIDString = (str, lenArr) => {
    if (!U.isString(str) || !U.isArray(lenArr)) return false;
    for (let i = 0; i < lenArr.length; i++)
      if (new RegExp("[0-9A-Za-z_-]{" + len + "}").test(str)) return true;
    return false;
  };


  U.isDateString = (str) => {
    return U.isString(str) && U.dateReg.test(str);
  };

  /**
   * lastDay()
   * 获取距今天 day 天之前那天的 Date 实例
   * @param {Number} day - 需得到的那天与今天隔的天数(负数表示未来的某天)
   * @return 得到的 Date 对象实例
   */
  U.lastDay = (day) => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  };

  module.exports = U;
}).call(this);
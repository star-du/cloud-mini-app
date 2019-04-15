// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  // env: "cloud-miniapp-96177b",
  env: "release-824dd3",
  traceUser: true
});
const db = cloud.database();

async function getAllData(collect) {
  const MAX_LIMIT = 100;
  const countResult = await collect.count();
  console.log("[count]", countResult);
  if (countResult.total === 0) {
    return {
      data: [],
      errMsg: "collection.get:ok"
    };
  }

  const batchT = Math.ceil(countResult.total / MAX_LIMIT);
  // betchTimes
  const tasks = []; // for all promise
  for (let i = 0; i < batchT; i++) {
    const promise = collect.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  // wait for all done
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }));
}

// notice: 无法设置对象内的field, 即 `event: {name: true}` 与 `event: true` 作用相同. 默认获取 `_id`
const collectionField = {
  approval: {
    classroomNumber: true,
    check: true,
    event: true,
    eventDate: true,
    eventTime1: true,
    eventTime2: true,
    exam: true,
    formid: true
  },
  listBorrow: {
    classroomNumber: true,
    eventTime1: true,
    eventTime2: true,
    event: true
  }
};

function isIDString(str, lenArr) {
  if (typeof str !== "string" || !isArray(lenArr)) return false;
  for (let i = 0; i < lenArr.length; i++)
    if (new RegExp("[0-9A-Za-z_-]{" + len + "}").test(str)) return true;
  return false;
}

function isArray(object) {
  return object && typeof object === "object" &&
    Array === object.constructor;
}

/**
 * toFilter()
 * @param {Object} ft 传入的filter
 */
function toFilter(ft) {
  const last = (day) => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  };

  if (!ft || Object.keys(ft).length === 0) return false;

  let x, obj = {};
  // exam
  if (ft.hasOwnProperty("exam")) {
    if (isArray(ft.exam)) {
      x = [];
      for (let i = 0; i < ft.exam.length; i++)
        if (ft.exam[i] >= 0 && ft.exam[i] < 4) x.push(ft.exam[i]);
      if (!x.length) return false;
      obj.exam = db.command.in(x);
    } else {
      x = Number(ft.exam);
      if (!isNaN(x) && x >= 0 && x < 4) obj.exam = x;
      else return false;
    }
  }

  // openid
  if (ft.hasOwnProperty("openid")) {
    if (!isIDString(ft.openid, [28])) return false;
    obj["_openid"] = openid;
  }

  // eventDate : yyyy-MM-dd
  if (ft.hasOwnProperty("date")) {
    const eReg = /2\d{3}-(0\d|1[0-2])-([0-2]\d|3[01])/;
    if (isArray(ft.date)) {
      if (ft.date.length !== 2) return false;
      if (!eReg.test(ft.date[0]) || !eReg.test(ft.date[1])) return false;
      obj.eventDate = db.command.gte(ft.date[0])
        .and(db.command.lte(ft.data[0]));
    } else if (eReg.test(ft.date)) {
      obj.eventDate = ft.date;
    } else return false;
  }

  // submitDate
  if (ft.hasOwnProperty("exSubmit")) {
    x = Number(ft.exSubmit);
    if (isNaN(x)) return false;
    obj.submitDate = db.command.gte(last(x));
  }

  console.log("[filter]", obj);
  return Object.keys(obj).length > 0 ? obj : false;
}

/**
 * 云函数入口函数
 * event.field 封装好的关键字段表
 */
exports.main = async(event, context) => {
  console.log("[event]", event);
  if (!event.field || !collectionField.hasOwnProperty(event.field)) {
    return {
      err: true,
      errMsg: "No request."
    };
  }
  let c = db.collection("forms");
  if (event.isDoc) {
    // 取单个记录
    if (!isIDString(event.docID, [16, 32]))
      return {
        err: true,
        errMsg: "Error docID."
      };
    c = c.doc(event.docID);
  } else {
    // 取所有记录
    const filter = toFilter(event.filter);
    if (filter === false) return {
      err: true,
      errMsg: "Error filter."
    };
    c = c.where(filter);
  }

  // 限定字段
  console.log("[field]", collectionField[event.field]);
  const fd = c.field(collectionField[event.field]);

  // 获取数据并返回
  return await getAllData(fd);
}
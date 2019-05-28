// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: "cloud-miniapp-96177b",
  // env: "release-824dd3",
  traceUser: true
});
const db = cloud.database();
const utils = require("./utils.js");

/** 设置合法的collection名字, 用于检验传入值 */
const collectionList = ["adminInfo", "forms"];


/** 
 * 用于检查 co 是否是合法的 collection 名
 * @param {String} co - 待检测的名称
 * @return {Boolean} 是否合法(在数组中)
 */
function inCollections(co) {
  if (!co) return false;
  for (let i = 0; i < collectionList.length; i++)
    if (co === collectionList[i]) return true;
  return false;
}

// @note 无法设置对象内的field, 即 `event: {name: true}` 与 `event: true` 作用相同.
// 默认获取 `_id`

/**
 * toFilter()
 * @param {Object} ft 传入的filter, 可有自定义filter, 详见各个case
 */
function toFilter(ft) {
  if (!ft || Object.keys(ft).length === 0) return false;
  let x, obj = {};

  // loop for all object properties
  for (let s in ft) {
    switch (s) {
      case "exam":
        if (utils.isArray(ft[s])) {
          x = [];
          for (let i = 0; i < ft[s].length; i++)
            if (ft[s][i] >= 0 && ft[s][i] < 4) x.push(ft[s][i]);
          if (!x.length) return false;
          obj.exam = db.command.in(x);
        } else {
          x = Number(ft[s]);
          if (!isNaN(x) && x >= 0 && x < 4) obj.exam = x;
          else return false;
        }
        break; // exam

      case "openid":
        if (!utils.isIDString(ft[s], [28])) return false;
        obj.openid = ft[s];
        break; // openid

      case "_openid":
        if (!utils.isIDString(ft[s], [28])) return false;
        obj["_openid"] = ft[s];
        break; // _openid

      case "exSubmit":
        x = Number(ft.exSubmit);
        if (isNaN(x)) return false;
        obj.submitDate = db.command.gte(utils.lastDay(x));
        break; // exSubmit

      case "date":
        // eventDate : yyyy-MM-dd
        if (utils.isArray(ft.date)) {
          // [from, to]
          if (ft.date.length !== 2) return false;
          if (!utils.isDateString(ft.date[0]) || !utils.isDateString(ft.date[1]))
            return false;
          obj.eventDate = db.command.gte(ft.date[0])
            .and(db.command.lte(ft.data[0]));
        } else if (utils.isDateString(ft.date)) {
          // exact one day 
          obj.eventDate = ft.date;
        } else return false;
        break; // date

      case "_id":
        // skip _id field because if using '_id', it's better to try 'doc' mode
        break; // _id

      default:
        obj[s] = ft[s];
    }
  } // end for

  console.log("[filter]", obj);
  return Object.keys(obj).length > 0 ? obj : false;
}

/**
 * getAllData()
 * @param {ServerSDK.DB.CollectionReference} collect 需要分组获取的 collction
 * @param {Number} offset 从第offset条开始读取
 * @return collection 中所有数据的数组
 */
async function getAllData(collect, offset = 0) {
  const MAX_LIMIT = 100;
  const countRes = await collect.count();
  console.log("[count]", countRes);

  // no result
  if (countRes.total === 0) {
    return {
      data: [],
      errMsg: "collection.get:ok"
    };
  }

  const batch = Math.ceil((countRes.total - offset) / MAX_LIMIT);
  // betchTimes
  const tasks = []; // for all promise
  for (let i = 0; i < batch; i++) {
    const promise = collect.skip(i * MAX_LIMIT + offset).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }

  // wait for all done
  return (await Promise.all(tasks)).reduce(
    (acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: cur.errMsg
    })
  );
}

/**
 * 云函数入口函数
 * @param {Object} event - 传入参数
 * @param {String} event.caller - 用于标识调用者
 * @param {String} event.collection - 需要操作的数据库集合
 * @param {String} [event.docID] - (isDoc=true)表示需查询项的 _id
 * @param {Object} [event.field] - 封装好的关键字段表
 * @param {Object} event.filter - 查询条件
 * @param {Boolean} [event.isDoc] - 是否使用 doc() 方法获取一个数据
 * @param {String} event.operate - 操作, 目前只支持 read, update
 * @return { {data: Object[], errMsg: String} | {err: Boolean, errMsg: String} }
 */
exports.main = async(event, context) => {
  console.log("[event]", event);
  if (!event.caller)
    return {
      err: true,
      errMsg: "Invalid caller."
    };

  switch (event.operate) {
    case "read": // 获取数据表
      if (!inCollections(event.collection)) {
        return {
          err: true,
          errMsg: "Wrong collection."
        };
      }
      let c = db.collection(event.collection);

      // 设置取值
      if (event.isDoc) {
        // 取单个记录
        if (!utils.isIDString(event.docID, [16, 32]))
          return {
            err: true,
            errMsg: "Error docID format."
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

      // 设置返回字段
      if (event.hasOwnProperty("field") && Object.keys(event.field).length)
        c = c.field(collectionField[event.field]);

      // 获取数据并返回
      if (event.isDoc) {
        return c.get();
      } else {
        const offset = Number(event.offset);
        return await getAllData(c, isNaN(offset) ? 0 : Number(offset));
      }
      // end read case
    case "update":

      break;
      // end update case
    default:
      return {
        err: true,
        errMsg: "Unknown operate."
      }
  }
  return;
}
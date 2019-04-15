// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  // env: "cloud-miniapp-96177b",
  env: "release-824dd3",
  traceUser: true
});

function regObj(check, examFlag) {
  let o = {
    openid: cloud.getWXContext().OPENID
  };
  if (check) {
    if (check.hasOwnProperty("approver")) o.approver = check.approver;
    if (check.hasOwnProperty("comment")) o.comment = check.comment;
  }
  return {
    check: o,
    exam: examFlag
  };
}

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("event", event);
  if (typeof event.updateID !== "string" || !(/[0-9A-Za-z_-]{16}/.test(event.updateID))) {
    return {
      error: true,
      msg: "error updateID."
    };
  }
  if (typeof event.check !== "object" || Object.keys(event.check).length === 0) {
    return {
      error: true,
      msg: "empty data input."
    }
  }

  const flag = Number(event.exam);
  if (isNaN(flag) || flag < 0 || flag > 4) {
    return {
      error: true,
      msg: "error exam flag."
    }
  }
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  const value = await db.collection("forms").doc(event.updateID).update({
    data: regObj(event.check, flag)
  }).then((res) => {
    console.log("DONE");
    return {
      error: false,
      msg: res.errMsg,
      updated: res.stats.updated
    }
  });
  return value;
}
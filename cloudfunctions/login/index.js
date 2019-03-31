// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  // env: "cloud-miniapp-96177b",
  env: "release-824dd3",
  traceUser: true
});

/**
 * 将经自动鉴权过的小程序用户 openid 返回给小程序端
 */
exports.main = async(event, context) => {
  console.log(event, context);
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext();
  return await cloud.database().collection("adminInfo").where({
    openid: wxContext.OPENID
  }).get().then(r => {
    console.log(r);
    if (r.data.length > 0) {
      return {
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID,
        isAdmin: true,
        name: r.data[0].name
      };
    } else {
      return {
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID,
        isAdmin: false
      };
    }
  }).catch(err => {
    return {
      err: true,
      errMsg: err
    }
  });
}
const cloud = require("wx-server-sdk");
cloud.init({
  // env: "cloud-miniapp-96177b",
  env: "release-824dd3",
  traceUser: true
});
const db = cloud.database();
const XLSX = require("xlsx");

exports.main = async(event, context) => {
  console.log(event);

  // check date vailable
  if (!event.startDate || !event.endDate || event.startDate > event.endDate) {
    return {
      err: true,
      errMsg: "Invalid date."
    };
  }
  let nameStr = event.startDate + "to" + event.endDate;
  event.startDate = new Date(event.startDate);
  event.endDate = new Date(event.endDate);
  if (!event.startDate || !event.endDate || event.startDate > event.endDate) {
    return {
      err: true,
      errMsg: "Invalid Date."
    };
  }
  console.log("[cloud file name]", nameStr);

  // check admin state
  var isAdmin = await db.collection("adminInfo").where({
    openid: event.openid
  }).get().then(res => {
    return Boolean(res.data.length);
  }).catch(err => {
    return false;
  });
  console.log("[isAdmin]",isAdmin);
  if (!isAdmin) {
    return {
      err: true,
      errMsg: "Promision denied."
    };
  }

  // get cell data
  var cellData = await db.collection("forms").where({
    exam: 3,
    submitDate: db.command.gte(event.startDate)
      .and(db.command.lte(event.endDate))
  }).get().then(res => {
    return res.data.reduce((arr, cur) => {
      arr.push([
        cur.formid.toString(), cur.classroomNumber,
        cur.eventDate, cur.eventTime1, cur.eventTime2,
        cur.event.association, cur.event.name, cur.event.content,
        cur.event.responser, cur.event.tel,
        cur.check.approver, cur.check.comment,
        cur.event.attendNumber
      ]);
      return arr;
    }, [
      ["编号", "教室", "借用日期", "起始时间", "结束时间", "部门/社团", "内容", "具体事项", "借用人", "电话", "审批人", "通过情况", "参与人数"]
    ]);
  });
  //console.log(cellData);
  // end get cellData

  var worksheet = XLSX.utils.aoa_to_sheet(cellData);
  console.log("[ws]", worksheet);

  // begin create workbook
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "导出数据");
  workbook.Props = {
    Title: "社联场地借用汇总",
    Author: "思存工作室",
    Company: "HUSTAU"
  };
  console.log("[wb]", workbook);
  // end create workbook

  // write to Buffer
  var buf = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });
  //console.log(buf);
  return await cloud.uploadFile({
    cloudPath: nameStr + ".xlsx",
    fileContent: buf
  });
}
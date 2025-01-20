var express = require("express");
var axios = require("axios");
var fs = require("fs");
var path = require("path");
var jwt = require("jsonwebtoken");
var formidable = require("formidable");
var router = express.Router();
var dayjs = require("dayjs");
var db = require("../db/db");

const SECRET_KEY = "ANSAIR-SYSTEM";

var callSQLProc = (sql, params, res) => {
  return new Promise((resolve) => {
    db.procedureSQL(sql, JSON.stringify(params), (err, ret) => {
      if (err) {
        res
          .status(500)
          .json({ code: -1, msg: "提交请求失败，请联系管理员！", data: null });
      } else {
        resolve(ret);
      }
    });
  });
};

var callP = async (sql, params, res) => {
  return await callSQLProc(sql, params, res);
};

router.post("/login", async (req, res, next) => {
  let params = req.body;
  let sql = `CALL PROC_LOGIN(?)`;
  let r = await callP(sql, params, res);

  if (r.length > 0) {
    let ret = clone(r[0]);
    let token = jwt.sign(ret, SECRET_KEY);
    res
      .status(200)
      .json({ code: 200, data: ret, token: token, msg: "登录成功" });
  } else {
    res.status(200).json({ code: 301, data: null, msg: "用户名或密码错误" });
  }
});

module.exports = router;

var fs = require('fs')
var path = require('path')
var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');
var {callP} = require("../db/db")


router.post('/querySchedule', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_QUERY_SCHEDULE(?)';
  const r = await callP(sql, params, res);
  r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))
  // console.log(r)
  res.status(200).json({ code: 0, data: r[0]})
})

router.post('/saveSchedule', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_SAVE_SCHEDULE(?)';
  const r = await callP(sql, params, res);
  r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))
  // console.log(r)
  res.status(200).json({ code: 0, data: r[0]})
})

router.post('/queryWork', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_QUERY_WORK(?)';
  const r = await callP(sql, params, res);
  r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))
  // console.log(r)
  res.status(200).json({ code: 0, data: r[0]})
})

router.post('/saveWork', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_SAVE_WORK(?)';
  const r = await callP(sql, params, res);
  r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))
  // console.log(r)
  res.status(200).json({ code: 0, data: r[0]})
})

router.post('/saveWorkStatus', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_SAVE_WORK_STATUS(?)';
  const r = await callP(sql, params, res);
  r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))
  // console.log(r)
  res.status(200).json({ code: 0, data: r[0]})
})


router.post('/sendEmail', async (req, res, next) => {
  const { to,subject,text } = req.body

  let transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.email_usr,
      pass: process.env.email_pwd,
    }
  });

  let mailOptions = {
    from: process.env.email_usr,
    to, 
    subject,
    text, 
    html: `<b>${text}</b>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    const params = req.body
    const sql = 'CALL PROC_SAVE_SCHEDULE_MAIL(?)';
    const r = await callP(sql, params, res);
    r.map(o=> (o.mat_content = JSON.parse(o.mat_content)))

    res.status(200).json({ code: 0, msg: '邮件发送成功', data: r[0]})
  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(200).json({ code: 0, msg: '邮件发送失败'})
  }
})



module.exports = router
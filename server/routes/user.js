var fs = require('fs')
var path = require('path')
var dotenv = require('dotenv')
var express = require('express')
var router = express.Router()
var {callP} = require("../db/db")



dotenv.config()



router.post('/queryUser', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_QUERY_USER(?)';
  const r = await callP(sql, params, res);
  console.log(r)
  res.status(200).json({ code: 0, data: r})
})


router.post('/saveUser', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_SAVE_USER(?)';
  const r = await callP(sql, params, res);
  console.log(r)
  res.status(200).json({ code: 0, data: r})
})

router.post('/delUser', async (req, res, next) => {
  const params = req.body
  const sql = 'CALL PROC_DEL_USER(?)';
  const r = await callP(sql, params, res);
  console.log(r)
  res.status(200).json({ code: 0, data: r})
})


module.exports = router
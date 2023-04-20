const express = require('express');
const { readTalkerData } = require('./utils/fsUtils')
const app = express();

app.get('/talker', async (req, res) => {
  const talkerList = await readTalkerData();
  return res.status(200).json({ talkerList });
})

module.exports = app;
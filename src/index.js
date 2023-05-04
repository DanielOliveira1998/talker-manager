const express = require('express');

const { readTalkerData } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkerList = await readTalkerData();
  return res.status(200).json(talkerList);
});

app.get('/talker/:id', async (req, res) => {
  const talkerList = await readTalkerData();
  const talker = talkerList.find((e) => e.id === Number(req.params.id));
  return res.status(200).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});

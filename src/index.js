const express = require('express');
const crypto = require('crypto');

const loginValidation = require('./middleware/loginValidation');
const { readTalkerData, writeNewTalkerData, updateTalkerData, deleteTalkerData } = require('./utils/fsUtils');
const { 
  validateToken, validateName, validateAge, 
  validateTalk, validateTalkwatchedAt, validateTalkRate, 
} = require('./middleware/talkerDataValidation');

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
  const dontFound = {
    message: 'Pessoa palestrante não encontrada',
  };
  const talker = talkerList.find((e) => e.id === Number(req.params.id));
  if (talker) {
    return res.status(200).json(talker);
  }
  return res.status(404).json(dontFound);
});

app.post('/login', loginValidation, async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

app.post('/talker', validateToken, validateName, validateAge, 
validateTalk, validateTalkwatchedAt, validateTalkRate, 
async (req, res) => {
  const newTalker = req.body;
  await writeNewTalkerData(newTalker);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName, validateAge, 
validateTalk, validateTalkwatchedAt, validateTalkRate, 
async (req, res) => {
  const { id } = req.params;
  const updatedTalkerData = req.body;
  const updatedTalker = await updateTalkerData(Number(id), updatedTalkerData);
  return res.status(201).json(updatedTalker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});

const express = require('express');
const crypto = require('crypto');

const loginValidation = require('./middleware/loginValidation');
const { readTalkerData, writeNewTalkerData, 
  updateTalkerData, deleteTalkerData, updateTalkRate } = require('./utils/fsUtils');
const { 
  validateToken, validateName, validateAge, 
  validateTalk, validateTalkwatchedAt, validateTalkRate, 
} = require('./middleware/talkerDataValidation');
const { validateRateQuery, validateDateQuery, 
  validateRate } = require('./middleware/searchQuerryValidation');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker/search', validateToken, validateRateQuery, validateDateQuery, async (req, res) => {
const talkerList = await readTalkerData();
const { q, rate, date } = req.query;
let searchAcc = talkerList;
if (q) {
  searchAcc = searchAcc.filter((talker) => talker.name.includes(q));
}
if (rate) {
  searchAcc = searchAcc.filter((talker) => talker.talk.rate === Number(rate));
}
if (date) {
  searchAcc = searchAcc.filter((talker) => talker.talk.watchedAt === date);
}
return res.status(200).json(searchAcc);
});

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
  const { name, age, talk } = req.body;
  const talkerList = await readTalkerData();
  const talkerData = { name, age, id: talkerList.length + 1, talk };
  await writeNewTalkerData(talkerData);
  return res.status(201).json(talkerData);
});

app.put('/talker/:id', validateToken, validateName, validateAge, 
validateTalk, validateTalkwatchedAt, validateTalkRate, 
async (req, res) => {
  const talkerList = await readTalkerData();
  const { id } = req.params;
  const updatedTalkerData = req.body;
  const hasTalker = talkerList.find((e) => e.id === Number(id));
  if (!hasTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  const updatedTalker = await updateTalkerData(Number(id), updatedTalkerData);
  return res.status(200).json(updatedTalker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));
  return res.status(204).end();
});

app.patch('/talker/rate/:id', validateToken, validateRate, async (req, res) => {
  const { rate } = req.body;
  const { id } = req.params;
  const data = await updateTalkRate(id, rate);
  return res.status(204).json(data);
});

app.listen(PORT, () => {
  console.log('Online');
});

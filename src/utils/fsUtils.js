const fs = require('fs').promises;
const path = require('path');

const TALKER_DATA_PATH = '../talker.json';

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKER_DATA_PATH));
    const talkerList = JSON.parse(data);
    return talkerList;
  } catch (error) {
    console.log(`Erro na leitura dos dados: ${error}`);
  }
}

async function writeNewTalkerData(newTalker) {
  try {
    const talkerList = readTalkerData();
    const updateTalkerList = JSON.stringify([...talkerList, newTalker]);
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updateTalkerList);
  } catch (error) {
    console.log(`Erro na escrita do arquivo: ${error}`);
  }
}

async function updateTalkerData(id, updatedTalker) {
  const talkerList = readTalkerData();
  const updateTalker = { id, ...updatedTalker };
  const updatedTalkerList = talkerList.reduce((talkers, talker) => {
    if (talker.id === id) return [...talkers, updateTalker];
    return [...talkerList, talker];
  }, []);
  const updatedData = JSON.stringify(updatedTalkerList);
  try {
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);
    return updateTalker;
  } catch (error) {
    console.log(`Erro na escrita do arquivo: ${error}`);
  }
}

async function deleteTalkerData(id) {
  const talkerList = await readTalkerData();
  const newTalkerList = talkerList.filter((talker) => talker.id !== id);
  const updatedData = JSON.stringify(newTalkerList);
  try {
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);
    return updatedData;
  } catch (error) {
    console.log(`Erro na escrita do arquivo: ${error}`);
  }
}

module.exports = {
  readTalkerData,
  writeNewTalkerData,
  updateTalkerData,
  deleteTalkerData,
};
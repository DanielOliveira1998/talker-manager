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

module.exports = {
  readTalkerData,
  writeNewTalkerData,
};
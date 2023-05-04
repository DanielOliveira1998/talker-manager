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
  const talkerList = await readTalkerData();
  const updateTalker = { id, ...updatedTalker };
  const updatedList = talkerList.reduce((acc, curr) => {
    if (acc.id === updateTalker.id) return [...acc, updateTalker];
    return [...acc, curr];
  }, []);
  const updatedData = JSON.stringify(updatedList);

  try {
    await fs.writeFile(path.resolve(__dirname, TALKER_DATA_PATH), updatedData);
    return updateTalker;
  } catch (error) {
    console.log(`Erro na escrita do arquivo: ${error}`);
  }
}

module.exports = {
  readTalkerData,
  writeNewTalkerData,
  updateTalkerData,
};
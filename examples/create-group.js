const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

const SCHEMA_NAME = 'blood-pressure-group';

const groupType = ['high pressure', 'low pressure'];

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const name = await rl.question('Group name: ');
  const type = parseInt(await rl.question('Group type [1-High pressure, 2 - Low pressure]: '), 10);

  rl.close();

  if(isNaN(type) || ![0,1].includes(type)) {
    throw new Error('type is not a number or ')
  }

  // Create a new group 
  const newGroup = await sdk.data.documents.create(SCHEMA_NAME, { name, type: groupType[type]});

  console.log("🎉 Created a new group with id", newGroup.id)
})();

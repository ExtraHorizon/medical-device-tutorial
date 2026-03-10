#!/usr/bin/env node

const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

const groupType = ['high pressure', 'low pressure'];

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = await rl.question('Group name: ');
  const type = parseInt(await rl.question('Group type [1 - High pressure, 2 - Low pressure]: '), 10);

  rl.close();

  if (isNaN(type) || ![1,2].includes(type)) {
    throw new Error('Type should be either 1 or 2');
  }

  // Create a new group 
  const newGroup = await sdk.data.documents.create('blood-pressure-group', {
    name,
    type: groupType[type - 1],
  });

  console.log("🎉 Created a new group with id", newGroup.id)
})();

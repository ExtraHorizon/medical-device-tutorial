#!/usr/bin/env node
const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const user = await rl.question('Enter user ID: ');
  const group = await rl.question('Group ID: ');

  rl.close();

  await sdk.users.addPatientEnlistment(user, { groupId: group });

  console.log(`Patient ${user} added to group ${group}`);
})();

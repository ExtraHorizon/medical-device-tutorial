#!/usr/bin/env node

const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

const SCHEMA_NAME = 'blood-pressure-group';

const groupType = ['high pressure', 'low pressure'];

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const user = await rl.question('Enter user ID: ');
  const group = await rl.question('Group ID: ');

  rl.close();

  await sdk.users.groupRoles.addUsersToStaff({ groups: [group]}, { rql: `?id=${user}`});

  console.log(`Staff ${user} added to group ${group}`);
})();

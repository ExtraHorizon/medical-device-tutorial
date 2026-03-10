#!/usr/bin/env node
const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const documentID = await rl.question('Enter group ID to fetch: ');

  rl.close();

  // Fetch the group document
  const group = await sdk.data.documents.findById('blood-pressure-group', documentID);
  console.log(JSON.stringify(group, null, 4));
})();

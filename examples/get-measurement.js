#!/usr/bin/env node

const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const documentID = await rl.question('Enter document ID to retrieve: ');

  rl.close();

  // Retrieve a document
  const document = await sdk.data.documents.findById('blood-pressure-measurement', documentID);

  console.log("Retrieved document", documentID);
  console.log(JSON.stringify(document, null, 4));
})();

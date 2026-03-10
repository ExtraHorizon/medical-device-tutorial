#!/usr/bin/env node

const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const systolic = parseInt(await rl.question('Enter systolic value: '), 10);
  const diastolic = parseInt(await rl.question('Enter diastolic value: '), 10);

  if (isNaN(systolic) || isNaN(diastolic)) {
    throw new Error("Either systolic or diastolic is not a number");
  }
  rl.close();

  // Create a document
  const newDocument = await sdk.data.documents.create('blood-pressure-measurement', {
    systolic,
    diastolic,
    timestamp: new Date(),
  });

  console.log("🎉 Created a new measurement document with id", newDocument.id)
})();

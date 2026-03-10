#!/usr/bin/env node

const { getUserSDK } = require('./auth.js');
const readline = require('node:readline/promises');


(async () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const email = await rl.question('Enter patient email: ');
  const password = await rl.question('Enter patient password: ');

  const sdk = await getUserSDK(email, password);

  console.log("Authenticated! Creating measurement ...");

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

  console.log("🎉 Created a new patient measurement document with id", newDocument.id)
})()

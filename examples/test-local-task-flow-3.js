#!/usr/bin/env node

const { getSDK } = require('./auth.js');
const { doTask } = require('../2-workflows/tasks/analyze-blood-pressure/src/index-flow-3.js')
const readline = require('node:readline/promises');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const documentID = await rl.question('Enter document ID to process: ');

  rl.close();

  /* Analyze the document */
  await doTask({sdk, task: { data: { documentId: documentID }}});

  console.log("Task finished!");
})();

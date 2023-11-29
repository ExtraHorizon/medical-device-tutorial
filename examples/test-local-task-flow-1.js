const { getSDK } = require('./auth.js');
const { analyzeDocument } = require('../2-workflows/tasks/analyze-blood-pressure/src/diagnose.js')
const readline = require('node:readline/promises');

const SCHEMA_NAME = 'blood-pressure-measurement';

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const documentID = await rl.question('Enter document ID to process: ');

  rl.close();

  /* Analyze the document */
  await analyzeDocument({sdk, documentId: documentID});

  console.log("Task finished!");
})();

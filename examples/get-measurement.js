const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

const SCHEMA_NAME = 'blood-pressure-measurement';

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const documentID = await rl.question('Enter document ID to retrieve: ');

  rl.close();

  // Create a document
  const document = await sdk.data.documents.findById(SCHEMA_NAME, documentID);

  console.log("Retrieved document", documentID);
  console.log(JSON.stringify(document, null, 4));
})();

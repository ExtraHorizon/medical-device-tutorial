const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');

const SCHEMA_NAME = 'blood-pressure-group';

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const documentID = await rl.question('Enter group ID to fetch: ');

  rl.close();

  // Create a document
  const group = await sdk.data.documents.findById(SCHEMA_NAME, documentID);
  console.log(JSON.stringify(group, null, 4));
})();

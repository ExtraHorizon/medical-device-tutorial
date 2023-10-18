const { getSDK } = require('./auth.js');
const { EOL } = require('os');

(async () => {
  const sdk = await getSDK();

  //Write a new blood pressure document
  const createdDocument = await sdk.data.documents.create('blood-pressure-measurement', { systolic: 100, diastolic: 100, timestamp: new Date() });
  console.log('👉 New document created!');

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);

  console.log(`👉 Retrieved created document:${EOL}${JSON.stringify(retrievedDocument, null, 4)}`);
})()

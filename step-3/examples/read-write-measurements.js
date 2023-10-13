const { getSDK } = require('./auth.js');
const { EOL } = require('os');

const SYSTOLIC = 125;
const DIASTOLIC = 80;

(async () => {
  const sdk = await getSDK();

  //Write a new blood pressure document
  const createdDocument = await sdk.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() });
  console.log('👉 New document created!');

  // Wait 2 seconds to make sure the analysis is done
  await new Promise(resolve => setTimeout(resolve, 2000));

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);

  console.log(`👉 Retrieved created document:${EOL}${JSON.stringify(retrievedDocument, null, 4)}`);
  console.log(`👉 Blood Pressure is categorize as ${retrievedDocument.data.category}`);

  //Remove the blood pressure document again
  const deleted = await sdk.data.documents.remove('blood-pressure-measurement', createdDocument.id);

  if(deleted.affectedRecords === 1) {
    console.log('👉 Document deleted again');
  }
})()

const { getSDK } = require('../auth.js');

const SYSTOLIC = 130;
const DIASTOLIC = 70;

(async () => {
  const sdk = await getSDK();

  //Write a new blood pressure document
  const createdDocument = await sdk.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() });
  console.log('👉 New document created!');

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);

  console.log('❗️Status: ', retrievedDocument.status);

  //Remove the blood pressure document again
  const deleted = await sdk.data.documents.remove('blood-pressure-measurement', createdDocument.id);

  if(deleted.affectedRecords === 1) {
    console.log('👉 Document deleted again');
  }
})();
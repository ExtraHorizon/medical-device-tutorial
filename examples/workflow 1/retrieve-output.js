const { getSDK } = require('../auth.js');

const SYSTOLIC = 125;
const DIASTOLIC = 80;

(async () => {
  const sdk = await getSDK();

  //Write a new blood pressure document
  const createdDocument = await sdk.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() });
  console.log('👉 New document created!');

  // Wait 2 seconds to make sure the analysis is done
  await new Promise(resolve => setTimeout(resolve, 3000));

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);
  console.log(`👉 Blood Pressure is categorize as ${retrievedDocument.data.category}`);
})()
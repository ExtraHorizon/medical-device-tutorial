const { getSDK } = require('../auth.js');
const fs = require('fs');

const SYSTOLIC = 130;
const DIASTOLIC = 70;

(async () => {
  const sdk = await getSDK();

  // Write a new blood pressure document
  const createdDocument = await sdk.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() });
  console.log('👉 New document created!');

  // Wait 2 seconds to make sure the analysis is done
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);
  console.log('👉 Retrieved created document:')
  console.log(JSON.stringify(retrievedDocument, null, 4));

  const pdf = await sdk.files.retrieve(retrievedDocument.data.report);
  fs.writeFileSync("report.pdf", pdf);
})();

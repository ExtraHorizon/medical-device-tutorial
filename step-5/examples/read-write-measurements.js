const { getSDK } = require('./auth.js');
const { EOL } = require('os');
const fs = require('fs');

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
  console.log(`👉 Blood Pressure is categorize as ${retrievedDocument.data.category}`);

  const template = await sdk.templates.findByName("pdf-analysis");
  const user = await sdk.users.me();

  const pdf = await sdk.templates.resolveAsPdf(template.id, {
    "language": "NL",
    "time_zone": "Europe/Brussels",
    "content": {
      "first_name": user.first_name,
      "blood_pressure": retrievedDocument.data.category,
      "diastolic": retrievedDocument.data.diastolic,
      "systolic": retrievedDocument.data.systolic,
      "date": retrievedDocument.data.timestamp,
    }
  });

  fs.writeFileSync("test.pdf",pdf);


  //Remove the blood pressure document again
  const deleted = await sdk.data.documents.remove('blood-pressure-measurement', createdDocument.id);

  if(deleted.affectedRecords === 1) {
    console.log('👉 Document deleted again');
  }
})()

const { getSDK } = require('../auth.js');

const SYSTOLIC = 130;
const DIASTOLIC = 70;

// https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings
function getDiagnosis(systolic, diastolic) {
  if(systolic < 120 && diastolic < 80) {
    return "normal";
  }

  if(systolic < 130 && diastolic < 80) {
    return "elevated";
  }

  if(systolic < 140 && diastolic < 90) {
    return "hypertension-stage-1";
  }

  if(systolic < 180 && diastolic < 120) {
    return "hypertension-stage-2";
  }

  return "hypertensive-crisis";
}

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

  const pdf = await sdk.files.retrieve(retrievedDocument.data.report);
  fs.writeFileSync("report.pdf",pdf);
})();

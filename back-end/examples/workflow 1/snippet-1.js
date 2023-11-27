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

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', createdDocument.id);

  const diagnosis = getDiagnosis(retrievedDocument.data.systolic, retrievedDocument.data.diastolic);
  console.log(`❗️Diagnosis: ${diagnosis}`);

  //Remove the blood pressure document again
  const deleted = await sdk.data.documents.remove('blood-pressure-measurement', createdDocument.id);

  if(deleted.affectedRecords === 1) {
    console.log('👉 Document deleted again');
  }
})();
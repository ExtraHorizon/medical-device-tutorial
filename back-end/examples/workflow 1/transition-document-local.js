const { getSDK } = require('../auth.js');
const { EOL } = require('os');

const SYSTOLIC = 130;
const DIASTOLIC = 70;
const SCHEMA_NAME = 'blood-pressure-measurement';

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
  const createdDocument = await sdk.data.documents.create(SCHEMA_NAME, { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() });
  console.log('👉 New document created!');

  const diagnosis = getDiagnosis(createdDocument.data.systolic, createdDocument.data.diastolic);

  // Find the transition
  const schema = await sdk.data.schemas.findByName(SCHEMA_NAME);
  const transition = schema.transitions.find(transition => transition.name === "mark-as-analyzed");

  // Transition the document to analyzed
  await sdk.data.documents.transition(SCHEMA_NAME, createdDocument.id, { id: transition.id, data: { diagnosis }  })

  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById(SCHEMA_NAME, createdDocument.id);
  console.log(`👉 Retrieved created document:${EOL}${JSON.stringify(retrievedDocument, null, 4)}`);
})();

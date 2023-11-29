
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


async function analyzeDocument({sdk, documentId}) {
  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', documentId);

  // Analyze the measurement and assign a category to it
  const diagnosis = getDiagnosis(retrievedDocument.data.systolic, retrievedDocument.data.diastolic);

  // Find the id of the transition, needed for transitioning the document
  const schema = await sdk.data.schemas.findByName('blood-pressure-measurement');
  const transition = schema.transitions.find(transition => transition.name === "mark-as-analyzed");

  // Transition the document to analyzed
  await sdk.data.documents.transition(
      'blood-pressure-measurement',
      documentId,
      // Report property is added to the data to store the file service token
      { id: transition.id, data: { category: diagnosis }}
  );

  return diagnosis;
}

module.exports = {
  analyzeDocument
};

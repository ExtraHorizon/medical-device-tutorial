
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


async function analyzeDocument({sdk, document}) {

  // Analyze the measurement and assign a category to it
  const diagnosis = getDiagnosis(document.data.systolic, document.data.diastolic);

  // Find the id of the transition, needed for transitioning the document
  const schema = await sdk.data.schemas.findByName('blood-pressure-measurement');
  const transition = schema.transitions.find(transition => transition.name === "mark-as-analyzed");

  // Transition the document to analyzed
  await sdk.data.documents.transition(
      'blood-pressure-measurement',
      document.id,
      // Report property is added to the data to store the file service token
      { id: transition.id, data: { category: diagnosis }}
  );

  return diagnosis;
}

module.exports = {
  analyzeDocument
};

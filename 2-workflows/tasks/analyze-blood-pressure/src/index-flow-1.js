const { getSDK } = require("./sdk");
const { analyzeDocument } = require("./diagnose");

exports.doTask =  async ({sdk, task}) => {
  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById("blood-pressure-measurement", task.data.documentId);

  /* Analyze the document */
  await analyzeDocument({ sdk, document: retrievedDocument});
}

exports.handler = async (task) => {
  /* Get an authenticated SDK */
  const sdk = await getSDK();
  await exports.doTask({sdk, task});
};

const { getSDK } = require("./sdk");
const { analyzeDocument } = require("./diagnose");
const { createPDF } = require("./create-pdf");

exports.doTask = async ({sdk, task}) => {
  //Read the blood pressure document
  const retrievedDocument= await sdk.data.documents.findById('blood-pressure-measurement', task.data.documentId);

  /* Analyze the document */
  const diagnosis = await analyzeDocument({ sdk, document: retrievedDocument});

  //Fetch the info of the user who created this document
  const user = await sdk.users.findById(retrievedDocument.creatorId);

  //Create the PDF
  await createPDF({sdk, user, document: retrievedDocument, diagnosis });
}

exports.handler = async (task) => {
  const sdk = await getSDK();

  await exports.doTask({sdk, task});
};

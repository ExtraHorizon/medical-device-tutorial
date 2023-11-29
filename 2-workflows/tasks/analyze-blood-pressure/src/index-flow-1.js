const { getSDK } = require("./sdk");
const { analyzeDocument } = require("./diagnose");

exports.handler = async (task) => {
    /* Get an authenticated SDK */
    const sdk = await getSDK();

    /* Analyze the document */
    await analyzeDocument({ sdk, documentId: task.data.documentId });
};

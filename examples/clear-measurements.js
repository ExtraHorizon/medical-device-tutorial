#!/usr/bin/env node

const { getSDK } = require('./auth.js');

(async () => {
  const sdk = await getSDK();

  // Get all documents of given schema
  const documents = await sdk.data.documents.findAll('blood-pressure-measurement');

  for (const document of documents) {
    // Delete the document
    await sdk.data.documents.remove('blood-pressure-measurement', document.id);
    console.log(`Removed document ${document.id}`);
  }
})();

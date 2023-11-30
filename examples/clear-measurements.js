#!/usr/bin/env node

const { getSDK } = require('./auth.js');

const SCHEMA_NAME = 'blood-pressure-measurement';

(async () => {
  const sdk = await getSDK();

  // Get all documents of given schema
  const documents = await sdk.data.documents.findAll(SCHEMA_NAME);

  for (const document of documents) {
    // Delete the document
    await sdk.data.documents.remove(SCHEMA_NAME, document.id);
    console.log(`Removed document ${document.id}`);
  }
})();

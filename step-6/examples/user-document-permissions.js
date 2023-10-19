const { getSDK, getUserSDK } = require('./auth.js');
const { EOL } = require('os');
const fs = require('fs');
const assert = require('node:assert');

const SYSTOLIC = 125;
const DIASTOLIC = 80;

const PASSWORD = "MDTPassword1";
const USER_PREFIX = "mdt-step-6-test-user";
const email = (userNum) => `${USER_PREFIX}${userNum}@extrahorizon.io`;

async function ensureNoTestUserExists(sdk) {
  const users = await sdk.users.find({ rql: `?like(email,${USER_PREFIX})`})
  for(let user of users.data) {
    sdk.users.remove(user.id)
  }
}

(async () => {
  const sdk = await getSDK();

  await ensureNoTestUserExists(sdk);

  // CREATE TEST USER 1
  const user1 = await sdk.users.createAccount({
    firstName: 'user1',
    lastName: 'MDT',
    email: email(1),
    password: PASSWORD,
    language: 'EN',
    phoneNumber: '0123456789'
  });
  const user1SDK = await getUserSDK(email(1), PASSWORD);
  console.log('👉 Created test user 1');

  // CREATE TEST USER 2
  const user2 = await sdk.users.createAccount({
    firstName: 'user2',
    lastName: 'MDT',
    email: email(2),
    password: PASSWORD,
    language: 'EN',
    phoneNumber: '0123456789'
  });
  const user2SDK = await getUserSDK(email(2), PASSWORD);
  console.log('👉 Created test user 2');

  const createdDocs = [];

  try {
    // Create document for test user 1
    createdDocs.push(await user1SDK.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC, diastolic: DIASTOLIC, timestamp: new Date() }));
    console.log(`👉 Created blood pressure measurement as user 1`);

    // Create document for test user 2
    createdDocs.push(await user2SDK.data.documents.create('blood-pressure-measurement', { systolic: SYSTOLIC+1, diastolic: DIASTOLIC+1, timestamp: new Date() }));
    console.log(`👉 Created blood pressure measurement as user 2`);

    // Read all documents for test user 1
    const user1Docs = await user1SDK.data.documents.find('blood-pressure-measurement');
    assert.strictEqual(user1Docs.data.length, 1);
    assert.strictEqual(user1Docs.data[0].creatorId, user1.id)
    console.log(`👉 User 1 can only see his own document`)

    // Read all documents for test user 2
    const user2Docs= await user2SDK.data.documents.find('blood-pressure-measurement');
    assert.strictEqual(user2Docs.data.length, 1);
    assert.strictEqual(user2Docs.data[0].creatorId, user2.id)
    console.log(`👉 User 2 can only see his own document`)

    // Read all documents as admin user
    const adminDocs= await sdk.data.documents.find('blood-pressure-measurement');
    assert.ok(adminDocs.data.length >= 2);
    console.log(`👉 Admin can read documents for both users`)

    await new Promise(resolve => setTimeout(resolve, 2000));

    for(const doc of createdDocs) {
      sdk.data.documents.remove('blood-pressure-measurement', doc.id)
      console.log(`👉 Removed document ${doc.id}`);
    }

  } finally {
    // Remove test users
    await sdk.users.remove(user1.id);
    await sdk.users.remove(user2.id);
    console.log('👉 Removed test users')
  }
})()

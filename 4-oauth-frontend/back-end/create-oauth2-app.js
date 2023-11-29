const { getSDK } = require('./auth.js');

(async () => {
  const sdk = await getSDK();

  const application = await sdk.auth.applications.create({
    name: 'blood-pressure-login',
    description: 'This oauth application is used for the login page of the blood pressure application.',
    type: 'oauth2',
    redirectUris: ['https://localhost']
  });

  const version = await sdk.auth.applications.createVersion(application.id, {
    name: 'v1',
  });

  console.log({application, version});
})();
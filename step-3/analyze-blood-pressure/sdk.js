const { createClient } = require('@extrahorizon/javascript-sdk');

async function getSDK() {
  const sdk = createClient({
    host: process.env.API_HOST,
    consumerKey: process.env.API_OAUTH_CONSUMER_KEY,
    consumerSecret: process.env.API_OAUTH_CONSUMER_SECRET,
  });
  await sdk.auth.authenticate({
    token: process.env.API_OAUTH_TOKEN,
    tokenSecret: process.env.API_OAUTH_TOKEN_SECRET,
  });

  return sdk;
}


module.exports = {
  getSDK
}

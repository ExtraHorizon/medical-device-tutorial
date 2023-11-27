const {readFile} = require('fs/promises');
const {EOL, homedir } = require('os');
const { createClient } = require('@extrahorizon/javascript-sdk');

const CREDENTIALS_FILE = `${homedir()}/.exh/credentials`;

/* Fetch & parse credentials from the exh cli */
async function getCredentials() {
  const credentials = (await readFile(CREDENTIALS_FILE)).toString()
    .split(EOL)                                         //split file into different lines
    .filter(l => l)                                     //remove empty lines
    .map(line => line.split('=').map(t => t.trim()))    //split each line into tokens and remove whitespace
    .reduce((a, c) => {                                 // ... and convert it into an object
      a[c[0]] = c[1];
      return a;
    }, {});
  return credentials
}

async function getSDK() {
  const credentials = await getCredentials();
  const sdk = createClient({
    host: credentials.API_HOST,
    consumerKey: credentials.API_OAUTH_CONSUMER_KEY,
    consumerSecret: credentials.API_OAUTH_CONSUMER_SECRET,
  });
  await sdk.auth.authenticate({
    token: credentials.API_OAUTH_TOKEN,
    tokenSecret: credentials.API_OAUTH_TOKEN_SECRET,
  });

  return sdk;
}

async function getUserSDK(email, password) {
  const credentials = await getCredentials();
  const sdk = createClient({
    host: credentials.API_HOST,
    consumerKey: credentials.API_OAUTH_CONSUMER_KEY,
    consumerSecret: credentials.API_OAUTH_CONSUMER_SECRET,
  });
  await sdk.auth.authenticate({ email, password });
  return sdk;
}


module.exports = {
  getSDK,
  getUserSDK
}

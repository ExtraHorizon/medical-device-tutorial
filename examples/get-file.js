#!/usr/bin/env node
const { getSDK } = require('./auth.js');
const readline = require('node:readline/promises');
const fs = require('fs');

(async () => {
  const sdk = await getSDK();

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});

  const token = await rl.question('Enter file token: ');

  rl.close();

  //Retrieve file
  const pdf = await sdk.files.retrieve(token);

  //Write it to disk
  fs.writeFileSync("report.pdf",pdf);

  console.log("Retrieved file & stored as report.pdf")
})();

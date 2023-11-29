import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const CLIENT_ID = 'f25fa7478cd2685f0d14971e7d6e7aab55c8dbaa';

document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();

  const formData = event.target.elements;
  const host = formData.host.value;
  const email = formData.email.value;
  const password = formData.password.value;

  try {
    const sdk = createOAuth2Client({
      host,
      clientId: CLIENT_ID,
    });
  
    const response = await sdk.auth.authenticate({
      username: email,
      password,
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
})

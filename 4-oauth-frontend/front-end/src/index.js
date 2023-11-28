import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const CLIENT_ID = '409ce9ba49c56cce31b9d2b1b2f5ed5ac01b4012';

document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  // event.stopPropagation();

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

  console.log({
    hostAddress,
    email,
    password,
  });

  // fetch();
  console.log(event.target?.elements?.host?.value);
})

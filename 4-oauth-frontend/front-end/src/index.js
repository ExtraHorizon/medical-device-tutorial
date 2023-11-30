import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const CLIENT_ID = process.env.CLIENT_ID;

const loginForm = document.getElementById('loginForm');
const container = document.getElementById('container');

loginForm.addEventListener('submit', async event => {
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
  
    await sdk.auth.authenticate({
      username: email,
      password,
    });

    const userData = await sdk.users.me();

    showWelcomeMessage(userData);
  } catch (error) {
    console.log(error);
  }
});

function showWelcomeMessage(user) {
  container.removeChild(loginForm);
  const title = document.createElement('h2');
  const message = document.createElement('p');

  message.classList.add('welcome-message');

  title.textContent = 'Success';
  message.textContent = `Welcome ${user.firstName} ${user.lastName}.`;

  container.appendChild(title);
  container.appendChild(message);
}

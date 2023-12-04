import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const CLIENT_ID = process.env.CLIENT_ID;
const HOST = process.env.BACKEND_URL;

const loginForm = document.getElementById('loginForm');
const container = document.getElementById('container');

loginForm.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = event.target.elements;
  const host = HOST;
  const email = formData.email.value;
  const password = formData.password.value;

  try {
    const sdk = createOAuth2Client({
      host,
      clientId: CLIENT_ID,
    });
  
    const credentials = await sdk.auth.authenticate({
      username: email,
      password,
    });

    const userData = await sdk.users.me();

    // Save oAuth2 refresh token to localStorage. Read more on https://oauth.net/2/refresh-tokens/ 
    localStorage.setItem('refreshToken', credentials.refreshToken);
    showWelcomeMessage(userData);
  } catch (error) {
    createErrorToast(error.message);
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

function createErrorToast(message = 'Error.') {
  const duration = 3000; // ms

  const toastsDiv = document.getElementById('toasts');

  const toastHtml = /*html*/`<div class="toast error-toast"><p class="message">${message}</p></div>`
  const toast = createHtmlElement(toastHtml);

  setTimeout(() => {
    toastsDiv.removeChild(toast);
  }, duration);

  toastsDiv.prepend(toast);
}

function createHtmlElement(htmlAsString) {
  const template = document.createElement('template');
  template.innerHTML = htmlAsString.trim();
  return template.content.firstChild;
}

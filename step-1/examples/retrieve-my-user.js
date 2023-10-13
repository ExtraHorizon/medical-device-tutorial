const { createOAuth1Client } = require('@extrahorizon/javascript-sdk');

retrieveMyUser();

async function retrieveMyUser() {
    // Create an OAuth1 client to connect to Extra Horizon
    const exh = createOAuth1Client({
        host: '<your_exh_host>', //TODO: FOUND AT
        consumerKey: '<your_consumer_key>', //TODO: FOUND AT
        consumerSecret: '<your_consumer_secret>', //TODO: FOUND AT
    });

    // Authenticate the client with your user credentials, this will generate new OAuth1 tokens
    await exh.auth.authenticate({
        email: '<your_user_email>', //TODO: FOUND AT
        password: '<your_user_password>', //TODO: FOUND AT
    });

    // Use the client to fetch your user information
    const me = await exh.users.me();
    console.log('User: ', me)
}

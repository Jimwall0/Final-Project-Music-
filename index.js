const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECTURI,
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);

        res.send('Logged in! You can now add songs via the API');
    } catch (err) {
        console.error(err);
        res.send('Something went wrong');
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send(`
        <h2> Welcome to My Spotify Playlist Bot</h2>
        <p><a href="/login">Log in with Spotify</a> to get started.</p>
        `);
});

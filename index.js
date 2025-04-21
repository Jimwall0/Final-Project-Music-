const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});


app.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log("Access token:", data.body.access_token);

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
    console.log(`Listening at http://127.0.0.1:${port}`);
});


app.get('/', (req, res) => {
    res.send(`
        <h2> Welcome to My Spotify Playlist Bot</h2>
        <p><a href="/login">Log in with Spotify</a> to get started.</p>
        `);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});


app.post('/submit-song', (req, res) => {
    const trackUri = req.body.trackUri;
    const playlistId = '1sTzjueAClM4LRulUso1pV';

    spotifyApi.addTracksToPlaylist(playlistId, [trackUri])
        .then(() => {
            res.send(`<p> Song added to playlist!</p><a href="/form">Back</a>`);
        });
});

app.get('/login', (req, res) => {
    const scopes = ['playlist-modify-public', 'playlist-modify-private'];
    const authUrl = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authUrl);
});

console.log("CLIENT ID:", process.env.CLIENT_ID);
console.log("REDIRECT URI:", process.env.REDIRECT_URI);

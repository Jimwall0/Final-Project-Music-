const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
const port = 5000;
const path = require('path');
const bodyParser = require('body-parser');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

app.use(express.static(path.join(__dirname)));

process.on('unhandledRejection', err => {
    console.error('Unhandled promise rejection:', err);
});

process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err);
});


app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Something went wrong');
    }
});


app.listen(port, '127.0.0.1', () => {
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
    let input = req.body.trackUri.trim();
    const playlistId = '1sTzjueAClM4LRulUso1pV';

    let trackUri;
    if (input.includes('open.spotify.com/track/')) {
        const match = input.match(/track\/([a-zA-Z0-9]{22})/);
        if (match) {
            trackUri = `spotify:track:${match[1]}`;
        } else {
            return res.send('Invalid Spotify track URL');
        }
    }else if (input.startsWith('spotify:track')) {
        trackUri = input;
    } else {
        return res.send('Please enter a valid Spotify track URI or link.');
    }
    spotifyApi.addTracksToPlaylist(playlistId, [trackUri])
        .then(() => {
            res.send(`<p> Song added to playlist!</p><a href="/">Back</a>`);
        })
        .catch(err => {
            console.error(err);
            res.send(`<p> Failed to add song. ${err.body?.error?.message || ''}</p><a href="/">Back</a>`);
        });
});


app.get('/login', (req, res) => {
    const scopes = ['playlist-modify-public', 'playlist-modify-private'];
    const authUrl = spotifyApi.createAuthorizeURL(scopes);
    console.log('>> Redirecting user to Spotify:', authUrl);
    res.redirect(authUrl);
});

app.get('/logout', (req, res) => {
    spotifyApi.setAccessToken(null);
    spotifyApi.setRefreshToken(null);
    res.redirect('/')
});


console.log("CLIENT ID:", process.env.CLIENT_ID);
console.log("REDIRECT URI:", process.env.REDIRECT_URI);

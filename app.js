//Intialize everthing from the .env folder
const client_id = 'da05c0652b1346c09bc126f873ee9a1b';
const client_secret = 'd74522686bd54b8496dabca6b20e72a9';
const redirect_uri = 'http://127.0.0.1:5000/callback';
//Adds function to help with http requests
const express = require('express');
const app = express();
const port = 5000;
const querystring = require('node:querystring');

//First page that loads
app.get('/', (reg, res) => {
    res.send(`<a href='/login'>Log in to Spotify</a>`)
});

//Provides information on the terminal when the app launches
app.listen(port, '127.0.0.1', () => {
    console.log(`Listening on port ${port}`);
    console.log(`Hosting on http://127.0.0.1:${port}/`);
});


function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

//Sends request for a token
app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-currently-playing user-read-playback-state streaming playlist-modify-public';

    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

//Returns a response based on user and sends back to homepage
app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
        res.send(`State is:${state}`)
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${(new Buffer.from(client_id + ':' + client_secret).toString('base64'))}`
            },
            json: true
        };
    }
});

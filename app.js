const client_id = 'da05c0652b1346c09bc126f873ee9a1b';
const redirect_uri = 'http://127.0.0.1:5000/callback';
const express = require('express');
const app = express();
const port = 5000;


app.get('/', (reg, res) => {
    res.send('Hello, World!')
});


app.listen(port, '127.0.0.1', () => {
    console.log(`Listening on port ${port}`);
    console.log(`Hosting on http://127.0.0.1:${port}/`);
});


app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});


app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
    }));
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'spplication/x-www-form-urlencoded',
                'Authorization': `Basic ${(new Buffer.from(client_id + ':' + client_secret).tostring('base64'))}`
            },
            json: true
        };
    }
});

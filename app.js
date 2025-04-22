const client_id = 'da05c0652b1346c09bc126f873ee9a1b';
const redirect_uri = 'http://127.0.0.1:5000/callback';

const app = express();

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }));
});
const client_id = 'da05c0652b1346c09bc126f873ee9a1b';
const redirect_uri = 'http://127.0.0.1:5000/callback';
const scopes = 'user-top-read';

const loginURL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}`;

document.getElementById('login').href = loginURL;

function getAccessTokenFromUrl() {
  const hash = window.location.hash;
  const token = hash
    .substring(1)
    .split('&')
    .find(item => item.startsWith('access_token='))
    ?.split('=')[1];

  return token;
}

const access_token = getAccessTokenFromUrl();

if (access_token) {
  fetch('https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=3n3Ppam7vgaVa1iaRUc9Lp', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const trackDiv = document.getElementById('tracks');
      data.tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.innerHTML = `
          <img src="${track.album.images[0].url}" width="100">
          <p>${track.name} - ${track.artists[0].name}</p>
          <a href="${track.external_urls.spotify}" target="_blank">Listen</a>
          <hr>
        `;
        trackDiv.appendChild(trackElement);
      });
    });
}

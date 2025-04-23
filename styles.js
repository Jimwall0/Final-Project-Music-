fetch('form.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('recommend').insertAdjacentHTML('afterbegin', data);
        });
      
//Makes the Cookie
function setCookie(name, value, day) {
const date = new Date();
date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
const expires = "expires=" + date.toUTCString();
document.cookie = `${name}=${value};${expires};path=/`;
}

//Retrieves the cookie
function getCookie(name) {
const cookieArr = document.cookie.split("; ");
for (let cookie of cookieArr) {
    let [key, val] = cookie.split("=");
    if (key === name) return val;
}
return null;
}

//Changes the theme
function changeTheme(themeFile) {
const stylesheet = document.getElementById("themechange");
if (stylesheet) {
    stylesheet.href = themeFile;
    setCookie("selectedTheme", themeFile, 30);
}
}

//Loads the theme
window.onload = function () {
const savedTheme = getCookie("selectedTheme");
if (savedTheme) {
    const stylesheet = document.getElementById("themechange");
    if (stylesheet) {
    stylesheet.href = savedTheme;
    }
}
}
function changeTheme(themeFile) {
    // get the stylesheet link element
    // change the href attribute to the new theme file
    const stylesheet = document.getElementById("themechange");
    stylesheet.href = themeFile;
}

fetch('form.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('recommend').insertAdjacentHTML('afterbegin', data);
})

window.addEventListener("lod", () => {
    if (localStorage.themecolor) {
        document.body.style.back
    }
})

function saveFilter(name, value) {
    localStorage.setItem(name, value);
}

function loadFilter(name) {
    return localStorage.getItem(name);
}

function saveColor(carNumber, color) {
    localStorage.setItem('color_' + carNumber, color);
}

function loadColor(carNumber) {
    return localStorage.getItem('color_' + carNumber);
}

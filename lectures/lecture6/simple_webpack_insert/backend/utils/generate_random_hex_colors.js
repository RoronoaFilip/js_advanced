const hexColors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#95a5a6', '#27ae60',
    '#2980b9', '#f1c40f', '#d35400', '#c0392b', '#bdc3c7',
    '#7f8c8d', '#8e44ad', '#16a085', '#f39c12', '#d35400',
    '#f1c40f'
];

function generateHexColors(n) {
    return hexColors.slice(0, n);
}

module.exports = {generateHexColors};
function removeDuplicates() {
    var array = arguments[0] || this;
    var uniqueArray = [];

    for (const i in array) {
        if (uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }

    return uniqueArray;
}


function myFilter(array, predicate) {
    var array1 = [];
    var array2 = [];

    for (const i in array) {
        if (predicate(array[i])) {
            array1.push(array[i]);
        } else {
            array2.push(array[i]);
        }
    }

    return [array1, array2];
}

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 312, 5, 4325, 2314, 1234123];

console.log(myFilter(removeDuplicates.call(arr), x => !!(x % 2)));

function comparator(a, b) {
    return b - a;
}

function myMin(array, comparatorFunc) {
    var result = array[0];

    for (let i = 1; i < array.length; ++i) {
        if (comparatorFunc(result, array[i]) < 0) {
            result = array[i];
        }
    }

    return result;
}

console.log(myMin([4, 2, 3, 1, 5], comparator));
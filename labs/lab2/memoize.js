
function memoize(func) {
    var arr = [];

    return function memoizedFunc() {
        var args = [].slice.call(arguments);

        if (arr[args]) {
            return arr[args];
        }

        arr[args] = func.apply(this, args);

        return arr[args];
    }
}

function sum(a, b, c, d, f) {
    return a + b + c + d + f;
}

sum = memoize(sum);

console.log(sum(2, 3, 4, 5, 6))
console.log(sum(2, 4, 3, 5, 6))
console.log(sum(2, 3, 4, 6, 5))

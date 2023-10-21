function curry(func) {
    var totalArgs = [];

    return function curriedFunc() {
        totalArgs = totalArgs.concat([].slice.call(arguments));

        if (totalArgs.length >= func.length) {
            try {
                func.apply(undefined, totalArgs)
            } finally {
                totalArgs = [];
            }
        }

        return curriedFunc;
    }
}


function sum(a, b, c) {
    return a + b + c;
}

var cSum = curry(sum);

console.log(cSum(2)(3)(3));
console.log(cSum(2, 3)(3));
console.log(cSum(2)(3, 3));
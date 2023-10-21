function compose() {
    var functions = [].slice.call(arguments).reverse();
    var result;

    function composeTwoFunc(func1, func2) {
        if (!func2) {
            return x => func1(x);
        }
        return x => func1(func2(x));
    }

    functions.forEach(f => {
        result = composeTwoFunc(f, result);
    });

    return result;
}

function composeReduce() {
    var functions = [].slice.call(arguments).reverse();

    return param => {
        return functions.reduce((val, func) => {
            return func(val);
        }, param);
    };
}

var addOne = (x) => x + 1;
var sqrt = (x) => x * x;
var log = (x) => console.log(x);

addOneSqrtAndPrint = compose(log, sqrt, addOne);

addOneSqrtAndPrint(1);
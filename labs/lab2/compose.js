function compose() {
    var functions = [].slice.call(arguments).reverse();
    var result;
    var oldResult;

    return function execute(param) {
        result = param;
        functions.forEach(f => {
            oldResult = result;
            result = f(result) || oldResult;
        })

        return result;
    }
}

function composeReduce() {
    var functions = [].slice(arguments).reverse();

    return param => {
        return functions.reduce((val, func) => { return func(val); }, param);
    }
}

var addOne = (x) => x + 1;
var sqrt = (x) => x * x;
var log = (x) => console.log(x);

addOneSqrtAndPrint = compose(log, sqrt, addOne);

console.log(addOneSqrtAndPrint(1));
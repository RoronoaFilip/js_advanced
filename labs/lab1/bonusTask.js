const whitespaceRegex = /\s+/g;
const multiplicationDivideRegex = /[0-9]+[*/][0-9]+/;
const sumRegex = /[0-9]+[+-][0-9]+/;
const operandRegex = /[*/+-]/;

const lambdas = {
    '*': (a, b) => {
        return a * b;
    },
    '/': (a, b) => {
        return a / b;
    },
    '+': (a, b) => {
        return a + b;
    },
    '-': (a, b) => {
        return a - b;
    }
};

function myEval(operation) {
    const elements = operation.split(operandRegex);
    const operand = operation.match(operandRegex)[0];

    return lambdas[operand](+elements[0], +elements[1]);
}

function evalExpr(expr) {
    expr = expr.replaceAll(whitespaceRegex, '');

    let matched;
    while ((matched = expr.match(multiplicationDivideRegex)) !== null
        || (matched = expr.match(sumRegex)) !== null) {

        const matchedOperation = matched[0];

        expr = expr.replace(matchedOperation, myEval(matchedOperation));
    }

    return expr;
}

let expression = '12 * 10 + 2 * 5 * 9 + 3 / 3 + 123';

console.log(evalExpr(expression));
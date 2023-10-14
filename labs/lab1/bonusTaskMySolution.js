// Expression Evaluator

let lambdas = {
    '+': (a, b) => {
        return a + b;
    },
    '-': (a, b) => {
        return a - b;
    },
    '*': (a, b) => {
        return a * b;
    },
    '/': (a, b) => {
        return a / b;
    }
};

function getOperands(expr) {
    let regex = /[^+\-*\/]+/;

    return expr.split(regex).filter(el => {
        return !!el;
    });
}

function getDigits(expr) {
    let regex = /[^0-9]+/;

    return expr.split(regex);
}

function calculateExpr(expr) {
    if (expr.length === 1) {
        return +expr;
    }

    let operands = getOperands(expr);
    let digits = getDigits(expr);

    while (calcIter(operands, digits, '*')) {
    }
    while (calcIter(operands, digits, '/')) {
    }
    while (calcIter(operands, digits, '+')) {
    }
    while (calcIter(operands, digits, '-')) {
    }

    return digits[0];
}

function calcIter(operands, digits, oper) {
    for (let i = 0; i < operands.length; ++i) {
        if (operands[i] === oper) {
            digits[i] = lambdas[oper](+digits[i], +digits[i + 1]);
            digits.splice(i + 1, 1);
            operands.splice(i, 1);
            return true;
        }
    }

    return false;
}


function calculateAllExpressions(string) {
    let regex = /\s+=\s+/;
    let split = string.split(regex);

    let calculatedExpressions = [];
    split.forEach(expr => {
        calculatedExpressions.push(calculateExpr(expr));
    });

    return calculatedExpressions;
}

let str = '1 + 3 * 2 - 14 = 2 * 8 / 16 - 8 / 8 = 0';

let result = calculateAllExpressions(str);
let all = result.length - 1;
let copy = all;

for (let i = 0; i < result.length - 1; ++i) {
    if (result[i] !== result[i + 1]) {
        --copy;
    }
}

console.log(`${copy}/${all}`);
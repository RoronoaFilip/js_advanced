function calcNewLine(line, matrix) {
    let result = [];
    for (let i = 0; i < matrix.length; ++i) {
        let num = 0;
        for (let j = 0; j < matrix[i].length; ++j) {
            num += (matrix[i][j] * line[j]);
        }
        result.push(num);
    }

    return result;
}

function flipMatrix(matrix) {
    for (let i = 0; i < matrix.length / 2 + 1; ++i) {
        for (let j = i; j < matrix[i].length / 2 + 1; ++j) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    return matrix;
}

function multiplyMatrices(matrix1, matrix2) {
    matrix2 = flipMatrix(matrix2);

    let result = [];
    for (let i = 0; i < matrix1.length; ++i) {
        result.push(calcNewLine(matrix1[i], matrix2));
    }

    return result;
}

let matrix1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
let matrix2 = [
    [21, 1, 1],
    [76, 22, 22],
    [3, 3, 22]
];

result = multiplyMatrices(matrix1, matrix2);

for (let i in result) {
    console.log(result[i]);
}
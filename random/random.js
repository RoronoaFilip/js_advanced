let a = [1,2,3];

let b = a.slice.bind([4,5,6]);

console.log(b.apply([7,8,9]));

// ===================================

function getFunc() {
    var i = this.i || 0;

    return function func() {
        [].slice.call(arguments).forEach(arg => { i += +arg });
        [...arguments].forEach(arg => { i += +arg });
        return i;
    }
}

var obj = {
    i: 0
}

var func = getFunc.apply(obj);

console.log(func.call(null, 1,2,3));

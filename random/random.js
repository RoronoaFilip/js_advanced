let a = [1,2,3];

let b = a.slice.bind([4,5,6]);

console.log(b.apply([7,8,9]));

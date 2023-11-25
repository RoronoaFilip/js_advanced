function iteratorFactory(iteratorData) {
  let counter = 0;

  return {
    next() {
      const value = iteratorData[counter++];
      const complete = counter > iteratorData.length;
      return {value, complete};
    }
  }
}

function* generatorFactory() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

function iteratorFactoryWithGenerator(iteratorData) {
  return (function* () {
    let value = undefined;
    let counter = 0;
    while ((value = iteratorData[counter++]) !== undefined) {
      yield value;
    }
  })()
}

// Iterator of an Object with an Iterator
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  [Symbol.iterator]() {
    let counter = 0;

    const next = () => {
      const keys = Object.keys(this);
      const value = this[keys[counter++]];
      const done = counter > keys.length;
      return {value, done};
    }

    return {next};
  }
}

// Iterator of an Object with a generator
const obj2 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  * [Symbol.iterator]() {
    let counter = 0;
    let keys = Object.keys(this);
    let key = undefined;
    while ((key = keys[counter++]) !== undefined) {
      yield this[key];
      keys = Object.keys(this); // If you add a new key to the object, it will be added to the iterator
    }
  }
}

// Iterator of an Object with a generator 2
const obj3 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  * [Symbol.iterator]() {
    for (const key in this) {
      yield this[key];
    }
  }
}

function* gen() {
  let counter = 0;
  while(true) {
    const newCounter = yield counter++;
    if (newCounter !== undefined && Number.isInteger(newCounter)) {
      counter = newCounter;
    }
  }
}

const numbers = gen();
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next(0)); // This will reset the counter to 0
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next('0')); // This will not reset the counter to 0
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next('alabala')); // This will not reset the counter to 0
console.log(numbers.next());
console.log(numbers.next());
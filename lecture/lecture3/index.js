var sharedFunctions = { // a shared state between objects
    getFullName: function getFullName() {
        return this.name || (
            (this.firstName + ' ' || '') + (this.lastName || '')
        );
    }
};

function copyProperties(source, target) { // Cloning an object
    target = target || {};

    for (var property in source) {
        target[property] = source[property];
    }

    return target;
}

function mixin() { // adding a shared state to the first argument
    var target = copyProperties(arguments[0]);

    for (var i = 1; i < arguments.length; ++i) {
        var source = arguments[i];
        for (var property in source) {
            target[property] = source[property];
        }
    }

    return target;
}

function Person(firstName, lastName) { // A Constructor for Person
    this.firstName = firstName;
    this.lastName = lastName;
}

Person.prototype.getFullName = function () { // Adding a Function to the Prototype of Person
    return this.firstName + ' ' + this.lastName;
};
Person.prototype.getFirstName = function () {
    return this.firstName;
}
Person.prototype.getLastName = function () {
    return this.lastName;
}

function newSimulator() { // The same as calling new Person()
    var prototype = arguments[0]; // The prototype for the object
    var ctor = arguments[1]; // The Constructor Function. Could be any

    var thisContext = Object.create(prototype);

    ctor.apply(thisContext, [].slice.call(arguments, 2));

    return thisContext;
}

function linkPrototypes() {
    for (let i = 1; i < arguments.length; ++i) {
        Object.setPrototypeOf(arguments[i-1], arguments[i]);
    }

    return arguments[0];
}

var prototype1 = {
    getFullName: function () {
        return this.firstName + ' ' + this.lastName;
    }
};

var prototype2 = {
    getFirstName: function () {
        return this.firstName;
    }
};

var prototype3 = {
    getLastName: function () {
        return this.lastName;
    }
};



var linkedPrototypes = linkPrototypes(prototype1, prototype2, prototype3);

var obj = newSimulator(linkedPrototypes, Person, 'Filip', 'Filchev'); // Creating a Person and attaching a prototype, simulation the new Operator

var obj2 = new Person('Filip2', 'Filchev2');

function Employee(firstName, lastName, position) {
    Person.call(this, firstName, lastName);
    this.position = position;
}

Employee.prototype = Object.create(Person.prototype); // Creating a new Prototype so the below operation doesn't change the Person prototype
Employee.prototype.getPosition = function () {
    return this.position;
}

var emp = new Employee('Emp', 'Empov', 'Boss');

console.log(emp.getFirstName());
console.log(emp.getLastName());
console.log(emp.getPosition());

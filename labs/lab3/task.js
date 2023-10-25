function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.getDistance = function getDistance(point2) {
    return Math.sqrt(Math.pow(this.x - point2.x, 2) + Math.pow(this.y - point2.y, 2))
}

function Circle(x, y, rad) {
    Point.call(this, x, y);
    this.rad = rad;
}

Circle.prototype = Object.create(Point.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getArea = function getArea() {
    return Math.pow(this.rad, 2) * Math.PI;
}

Circle.prototype.getCircumference = function getCircumference() {
    return 2 * Math.PI * this.rad;

}
Circle.prototype.intersects = function intersects(circle2) {
    var dist = this.getDistance(circle2);

    return (this.rad + circle2.rad) >= dist;
}

function Rectangle(x, y, a, b) {
    Point.call(this, x, y);
    this.a = a;
    this.b = b;
}

Rectangle.prototype = Object.create(Point.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getPerimeter = function getPerimeter() {
    return 2 * this.a
        + 2 * this.b;
}

Rectangle.prototype.getArea = function getArea() {
    return this.a * this.b;
}

Rectangle.prototype.getLengthOfDiagonals = function getLengthOfDiagonals() {
    var p1 = new Point(this.x, this.y);
    var p2 = new Point(this.x + this.a, this.y);
    var p3 = new Point(this.x, this.y + this.b);
    var p4 = new Point(this.x + this.a, this.y + this.b);

    return [p1.getDistance(p4), p2.getDistance(p3)];
}

Rectangle.prototype.getBiggestCircle = function getBiggestCircle() {
    var halfDiagonal = this.getLengthOfDiagonals()[0];

    var radius = Math.min(a, b) / 2;

    return new Circle(this.x + halfDiagonal, this.y + halfDiagonal, radius);
}

function RectanglePrism(x, y, a, b, c) {
    Rectangle.call(this, x, y, a, b);
    this.c = c;
}

RectanglePrism.prototype = Object.create(Rectangle.prototype);
RectanglePrism.prototype.constructor = RectanglePrism;

RectanglePrism.prototype.getVolume = function getVolume() {
    return this.a * this.b * this.c;
}

var r = new RectanglePrism(1,2,6,7,8);

console.log(r.getVolume());
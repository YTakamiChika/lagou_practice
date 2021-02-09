// 代码题1
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello')
    }, 10)
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('lagou')
    }, 20)
})

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('I ❤ U')
    }, 30)
})

Promise.all([p1, p2, p3]).then(res => {
    console.log(res[0] + res[1] + res[2]);
})

// 代码题2
const fp = require('lodash/fp');

const cars = [{
    name: 'Ferrari FF',
    horsepower: 660,
    dollar_value: 700000,
    in_stock: true
}, {
    name: 'Spyker C12 Zagato',
    horsepower: 650,
    dollar_value: 648000,
    in_stock: false
}, {
    name: 'Jaguar XKR-S',
    horsepower: 550,
    dollar_value: 132000,
    in_stock: false
}, {
    name: 'Audi R8',
    horsepower: 525,
    dollar_value: 114200,
    in_stock: false
}, {
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 1850000,
    in_stock: true
}, {
    name: 'Pagani Huayra',
    horsepower: 700,
    dollar_value: 1300000,
    in_stock: false
}]

// 练习1
let isLastInStock = fp.flowRight([fp.prop('in_stock'), fp.last])
console.log(isLastInStock(cars));

// 练习2
let getFirstName = fp.flowRight([fp.prop('name'), fp.first])
console.log(getFirstName(cars));

// 练习3
let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length;
}

let _dollarValue = function(cars) {
    return fp.map(function(car) {
        return car.dollar_value
    }, cars)
}

function compose(...args) {
    return function(value) {
        return args.reduce(function(acc, fn) {
            return fn(acc)
        }, value)
    }
}

let averageDollarValue = compose(_dollarValue, _average)
console.log(averageDollarValue(cars));

// 练习4
let _underscore = fp.replace(/\W+/g, '_');
let sanitizeName = fp.flowRight(value => value.split(), _underscore, fp.toLower, fp.first);
console.log(sanitizeName(['Hellow World']))

// 代码题3
// 练习1
const { Maybe, Container } = require('./support');
let maybe = Maybe.of([5, 6, 1])
let ex1 = (y) => {
    return maybe.map(x => {
        return fp.map(val => {
            return fp.add(val, y)
        }, x)
    })
}
console.log(ex1(3)._value)

// 练习2
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => xs.map(x => fp.first(x))
console.log(ex2()._value)

// 练习3
let safeProp = fp.curry(function(x, o) {
    return Maybe.of(o[x])
})
let user = {
    id: 2,
    name: 'Albert'
}
let ex3 = () => {
    return safeProp('name', user).map(val => {
        return fp.first(val);
    })
}
console.log(ex3()._value)

// 练习4
let ex4 = function(n) {
    return Maybe.of(n)
        .map(x => parseInt(x));
}
console.log(ex4(3.6)._value)


// promise源码见myPromise.js
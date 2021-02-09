// 重写promise
const PENDING = 'pending'; // 等待状态
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败
class MyPromise {
    // promise需要传入执行器，执行器需要执行2个方法,resolve,reject
    constructor(exe) {
        try {
            exe(this.resolve, this.reject)
        } catch (e) {
            this.reject(e);
        }
    }

    // promise有3个状态，分别为pendding(等待), fulfilled(成功), rejected(失败)。默认为等待状态
    // promise状态变化不可逆，只能从等待->成功，或者等待->失败
    status = PENDING;
    // 定义成功之后的值
    value = undefined;
    // 定义失败后的原因
    reason = undefined;
    // 定义成功回调
    successCallback = [];
    // 定义失败回调
    failCallback = [];
    resolve = value => {
        if (this.status !== PENDING) return;
        // 进入resolve状态变为成功
        this.status = FULFILLED;
        // 保存成功的值
        this.value = value;
        // 当成功回调数组中存在值时，逐一调用回调。
        while (this.successCallback.length) this.successCallback.shift()();
    }

    reject = reason => {
        if (this.status !== PENDING) return;
        // 进入reject(状态变为失败
        this.status = REJECTED;
        // 保存失败的原因
        this.reason = reason;
        // 当失败回调数组中存在值时，逐一调用回调。
        while (this.failCallback.length) this.failCallback.shift()();
    }

    // 在then方法中访问当前的值，或者失败的原因
    then = (successCallback, failCallback) => {
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => { throw reason };
        // 返回一个新的promise对象
        let promise2 = new MyPromise((resolve, reject) => {
            // 判断状态
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    // 获取上一个promise的返回值
                    try {
                        let x = successCallback(this.value);
                        // 判断x是普通值还是promise对象
                        // 普通值直接resolve
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    // 获取上一个promise的返回值
                    try {
                        let x = failCallback(this.reason);
                        // 判断x是普通值还是promise对象
                        // 普通值直接resolve
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else {
                // 等待状态
                // 存储成功回调，失败回调
                this.successCallback.push(() => {
                    setTimeout(() => {
                        // 获取上一个promise的返回值
                        try {
                            let x = successCallback(this.value);
                            // 判断x是普通值还是promise对象
                            // 普通值直接resolve
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                this.failCallback.push(() => {
                    try {
                        let x = failCallback(this.reason);
                        // 判断x是普通值还是promise对象
                        // 普通值直接resolve
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
        return promise2;
    }

    catch (failCallback) {
        return this.then(undefined, failCallback)
    }

    // 
    finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value);
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason });
        })
    }

    // Promise.all方法(静态)
    static all(array) {
        let result = [];
        let index = 0;

        // 当前数组可以传入promise对象或者值，需要做区分
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++;
                if (index === array.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    // promise对象
                    current.then(value => addData(i, value), reason => reject(reason));
                } else {
                    // 普通值
                    addData(i, array[i]);
                }
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaning cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        // promise对象
        x.then(resolve, reject);
    } else {
        //普通值
        resolve(x)
    }
}

module.exports = MyPromise;
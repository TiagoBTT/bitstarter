#!/usr/bin/env node
var fs = require('fs');
var Prime = function () {
    // current prime number
    this.prime = 1;

    // return true if NUM is prime
    this.isPrime = function (num) {
        var result = true;
        if (num !== 2) {
            if (num % 2 === 0) {
                result = false;
            } else {
                for (var i = 3; i <= Math.sqrt(num); i += 2) {
                    if (num % i === 0) result = false;
                }
            }
        }
        return result;
    }

    // return next prime number
    this.nextPrime = function () {
        this.prime++;
        while (!this.isPrime(this.prime)) this.prime++;
        return this.prime;
    }
}

function calcPrimesLoop(count) {
    var arr = [];
    this.prime = new Prime();
    for (var i = 1; i <= count; i++) {
        arr.push(this.prime.nextPrime());
    }
    return arr;
}

// formatting array with a comma between numbers
var fmt = function(arr) {
    return arr.join(",");
};

var num = 100;
var outfile = "tmp/primes.txt";
fs.writeFileSync(outfile, fmt(calcPrimesLoop(num)));
console.log(num +' prime numbers were sent to '+outfile);

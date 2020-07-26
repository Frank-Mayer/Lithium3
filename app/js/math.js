"use strict";

Math.bigIntSqrt = function (value) {
  if (value < 0n) {
    throw "sqrt of negative numbers is not supported"
  }
  else if (value < 2n) {
    return value;
  }
  else {
    function newtonIteration(n, x0) {
      const x1 = ((n / x0) + x0) >> 1n;
      if (x0 === x1 || x0 === (x1 - 1n)) {
        return x0;
      }
      return newtonIteration(n, x1);
    }
    return newtonIteration(value, 1n);
  }
}

Math.isPrime = async function (p) {
  let n = BigInt(p);
  if (n <= 1n) {
    return false;
  }
  if (n % 2n === 0n) {
    return n === 2n;
  }
  let boundary = Math.bigIntSqrt(n);
  for (let i = 3n; i <= boundary; i += 2n) {
    if (n % i === 0n) {
      return false;
    }
  }
  return true;
}

Math.findNextPrime = async function (start) {
  let prime = BigInt(start);
  while (!(await Math.isPrime(prime))) {
    prime++;
  }
  return prime;
}

Math.nthPrime = async function (n) {
  if (n < 1n) {
    throw "n can't be smaller than one.";
  }
  if (n === 1n) {
    return 2n;
  }
  let i = 3n;
  let primeCount = 1n;
  while (primeCount < n) {
    if (await Math.isPrime(i)) {
      primeCount++;
    }
    i += 2n;
  }
  return i - 2n;
}

Math.getHugePrime = async function (N) {
  var length = 16,
    charset = "1234567890",
    retVal = String(N + 1);
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return await Math.findNextPrime(retVal);
}

BigInt.prototype.toJSON = function () { return this.toString() }
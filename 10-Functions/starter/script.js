'use strict';

/////////////////////////
/*
const bookings = [];
const basePrice = 199;

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = basePrice * numPassengers
) {
  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH345', 2, 800);
createBooking('LH345', undefined, 300); // use undefined to skip parameter that we want to use the default
createBooking('LH345', 5);
*/

/////////////////////////
/*
const flight = 'LH234';
const gery = {
  name: 'Geryenko Hawsen',
  passport: 123123123,
};

const checkIn = function (flightNum, passenger) {
  flightNum = 'LH399';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 123123123) {
    alert('Checked in');
  } else {
    alert('Wrong passport!');
  }
};

// checkIn(flight, gery);
console.log(flight);
console.log(gery);

const flightNum = flight;
const passenger = gery;

const newPassport = function (person) {
  person.passport = Math.trunc(Math.random() * 1000000);
};

newPassport(gery);
checkIn(flight, gery);

console.log(flight);
console.log(gery);
*/

////////////////////
/*
// Generic function
const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase();
};

// Generic function
const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

// Higher-order function
const transformer = function (str, fn) {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);

  console.log(`Transformed by: ${fn.name}`); // 'name' property of the function
};

transformer('JavaScript is the best!', upperFirstWord);
console.log('-------------------------');
transformer('JavaScript is the best!', oneWord);

// JavaScript callbacks!!
const high5 = function () {
  console.log('✋');
};
document.body.addEventListener('click', high5);
[1, 2, 3, 'Gery'].forEach(high5);
*/

// function returning function
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};

const greeterHey = greet('Hey');
greeterHey('Jonas');
greeterHey('Gery');

greet('Hello')('Yamada'); // calling directly the returned function

// arrow function returning arrow function
const aisatsu =
  (greeting = 'Hi') =>
  name => {
    console.log(`${greeting} ${name}`);
  };

aisatsu()('Gery');
aisatsu('Bye')('Gery');

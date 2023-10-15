'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(23 === 23.0);

// 3/10 === 3.33333333
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Conversion
console.log(Number('23'));
console.log(+'23');
console.log(+'23' === Number('23')); // true

// Parsing
console.log(Number.parseInt('30px', 10)); // 30
console.log(Number.parseInt('e23', 10)); // NaN

console.log(Number.parseInt('   2.5rem  ')); // 2
console.log(Number.parseFloat(' 2.3rem    ')); // 2.3
console.log(parseFloat(' 2.3rem    ')); // not encourage to call it as a global function

// isNaN() is not good for checking if a number is NaN or not
// ONLY use for checking if a value is EXACTLY NaN values
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'xx20')); // true
console.log(Number.isNaN(23 / 0)); // false // infinity is still a number

// isFinite() is better for checking if a value is a number or NaN
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'xx20')); // false
console.log(Number.isFinite(23 / 0)); // false // infinity is not finite
*/

/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(1, 2, 13, 4, 5));
console.log(Math.max(1, 2, '13', 4, 5)); // will do conversion for us
console.log(Math.max(1, 2, '13px', 4, 5)); // will NOT do parsing

console.log(Math.min(1, 2, 13, 4, 5));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

function randomInt(min, max) {
  return Math.trunc(Math.random() * (max - min) + 1) + min;
}
console.log(randomInt(7, 15));

// Rounding integers (auto conversion for string)
console.log('Rounding integers');
console.log(Math.round(-10.3)); // -10
console.log(Math.round(10.3)); // 10
console.log(Math.round(10.5)); // 11
console.log(Math.round('10.9')); // 11

console.log(Math.ceil(-10.3)); // -10
console.log(Math.ceil(10.3));
console.log(Math.ceil(10.5));
console.log(Math.ceil('10.9'));

console.log(Math.floor(-10.3)); // -11
console.log(Math.floor(10.3));
console.log(Math.floor(10.5));
console.log(Math.floor(10.9));

// Rounding decimals (return value will be a string)
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.7315).toFixed(2));
console.log(+(2.7315).toFixed(2)); // change return value back into a number
*/

/*
console.log(5 % 2); // 1
console.log(5 / 2); // 2.5

console.log(8 % 3);
console.log(8 / 3);

const isEven = n => n % 2 === 0;
console.log('isEven --> ', isEven(8));
console.log('isEven --> ', isEven(1));
console.log('isEven --> ', isEven(234));

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i !== 0 && i % 2 === 0) {
      row.style.backgroundColor = 'salmon';
    }
    if (i !== 0 && i % 3 === 0) {
      row.style.backgroundColor = 'beige';
    }
  });
});
*/

/*
const diameter = 287_460_000_000; // Numeric separator make it easy for developer to understand large number
console.log('diameter --> ', diameter);

const price = 345_66;
console.log('price --> ', price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.14_15;
// const PIerror = 3._1415; // underscore can be only be placed IN-BETWEEN number
console.log('PI --> ', PI);

console.log(Number('230000')); // This will work just fine
console.log(Number('230_000')); // This will return a NaN
*/

/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(9012346598273465987412365089123651089236590125n);
console.log(9012346598273465987412365089123651089236590125);
console.log(BigInt(9012346598273465987412365089123651089236590125));
console.log(BigInt(9012346598));

// Operations
console.log(10000n + 10000n);
console.log(10000100000000000n * 10000n);

const huge = 18923749871234234n;
const num = 23;
console.log(huge * BigInt(num));

console.log(20n > 15);
console.log(20n === 20); // false because JS will not do type coercion
console.log(typeof 20n);
console.log(20n == 20); // true because JS will coerces the primitive type

// Divisions
console.log(10n / 3n); // 3n
console.log(10 / 3); // 3.333333333
*/

// Create a date
const now = new Date();
console.log(now);

console.log(new Date('Aug 03 2021 15:16:17'));
console.log(new Date('December 23, 2022'));
console.log(new Date(account1.movementsDates[0]));

const future = new Date(2035, 1, 28, 15, 16, 17);
console.log(future);
console.log(new Date(2035, 1, 30, 15, 16, 17)); // JS will auto correct the dates

console.log(new Date(0)); // starting Epoch time
console.log(new Date(3 * 24 * 60 * 60 * 1000));

console.log('getFullYear --> ', future.getFullYear());
console.log('getYear --> ', future.getYear()); // Years passed after the Epoch time
console.log('getMonth --> ', future.getMonth());
console.log('getDate --> ', future.getDate());
console.log('getDay --> ', future.getDay());
console.log('getHours --> ', future.getHours());
console.log('getMinutes --> ', future.getMinutes());
console.log('getSeconds --> ', future.getSeconds());
console.log('toISOString --> ', future.toISOString());
console.log('getTime --> ', future.getTime()); // milliseconds passed after the Epoch time

const msPassed = future.getTime();
console.log(new Date(msPassed));
console.log('Date.now() --> ', Date.now());

console.log('setFullYear --> ', future.setFullYear(2040));
console.log('new future --> ', future);

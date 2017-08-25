// Jan 1st 1970 00:00:00 am
const moment = require('moment');
// let date = new Date();
// let months = ['Jan', 'Feb'];
// console.lop(date.getMonth());

// let date = moment();
// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do YYYY hh:mm:ss '));

// 10:35 am
// 6:01 am

// date.subtract(5, 'hours').subtract(26, 'minutes');
// console.log(date.format('h:mm a'));

let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt =1234;
let date = moment(createdAt);
console.log(date.format('h:mm a'));



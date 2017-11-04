import test from './test';
import constant from './constants';
import testImg from './image';
import testImg2 from './image2';

import style from '../css/test.css';

var es6Message = () => (
    `<p class="${style.title}">Test ES6 from ${constant.name}</p>` +
    `<p>Example small image:</p>` +
    `${testImg}` +
    `<p>Example big image:</p>` +
    `${testImg2}`
);
//debugger;
document.getElementById('app').innerHTML = es6Message();

console.log("Hello world from " + constant.name);

//Bootstrap thing
import 'bootstrap';
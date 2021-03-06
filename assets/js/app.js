import test from './test';
//old syntax - var module = require( './assets/js/app/image.js' );
import constant from './constants';
import testImg from './image';
import testImg2 from './image2';

import styleMain from '../scss/app.scss';
import style from '../css/test.css';

var es6Message = () => (
    `<p class="${style.title}">Test ES6 from ${constant.name}</p>` +
    `<p>Example small image:</p>` +
    `${testImg}` +
    `<p>Example big image:</p>` +
    `${testImg2}` +
    `<button id="testBtn">Click me</button>`
);
//debugger;
document.getElementById('app').innerHTML = es6Message();
document.getElementById('testBtn').addEventListener('click', () => {
    import('./page1').then((content) => {
        document.getElementById('app').innerHTML = content.default;
    });
});

console.log("Hello world from " + constant.name);
console.log('test');

//Bootstrap thing
import 'bootstrap';
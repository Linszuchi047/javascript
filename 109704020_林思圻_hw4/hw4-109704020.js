"use strict";

function update(p, index) {
    let displayedNumbers = [];
    for (let i = 0; i < index; i++) {
        displayedNumbers.push(parseInt(p[i].innerText));
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 49) + 1;
    } while (displayedNumbers.includes(randomNumber)); // Check if the number is already displayed

    p[index].innerText = randomNumber;
}

let all = document.getElementsByClassName("lottery");
let timer1 = setInterval(update, 300, all, 0);
let timer2 = setInterval(update, 300, all, 1);
let timer3 = setInterval(update, 300, all, 2);
let timer4 = setInterval(update, 300, all, 3);
let timer5 = setInterval(update, 300, all, 4);
let timer6 = setInterval(update, 300, all, 5);

// Clear intervals after specified durations
setTimeout(clearInterval, 5000, timer1);
setTimeout(clearInterval, 8000, timer2);
setTimeout(clearInterval, 10000, timer3);
setTimeout(clearInterval, 12000, timer4);
setTimeout(clearInterval, 14000, timer5);
setTimeout(clearInterval, 16000, timer6);

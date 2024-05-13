"use strict";
let html = ``;
html += `<div class="title">Wordle Game</div>`;
html += `<div class="container">`;


for (let i = 0; i < 36; i++) {
    if (i != 5 && i != 11 && i != 17 && i != 23 && i != 29 && i != 35) {
        html += `
    <div id="letter${i}" class="letter"></div>
    `;
    }
}


html += `</div>`;
document.write(html);


let currentIndex = 0;
let characterPrompt = true;
let delPrompt = true;
let win = false;
let check = 0;
let array = [];
let guess;
let round = 0;
fetch('dictionary.txt')
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch the file');
        }
        // Return the text content
        return response.text();
    })
    .then(data => {
        const words = data.split('\n');
        const random = Math.floor(Math.random() * 5757)
        const get = words[random];
        const uppercaseGuess = get.toUpperCase();
        guess = uppercaseGuess.trim(); // Remove leading and trailing whitespace

        document.getElementById('answer').textContent = guess;
    })
    .catch(error => {
        console.error('Error:', error);
    });



function myfunction(letter) {
    delPrompt = true;
    if (currentIndex === 5 || currentIndex === 11 || currentIndex === 17 ||
        currentIndex === 23 || currentIndex === 29 || currentIndex === 35) {
        characterPrompt = false;
    }
    if (characterPrompt && currentIndex < 36) {
        document.getElementById(`letter${currentIndex}`).innerHTML = letter;
        array.push(letter);
        currentIndex++;
    }
    else {

        alert("Press 'Enter' to continue.");

    }

}

function removeLast() {
    if (delPrompt && currentIndex > round * 5 + round) {
        array.pop();
        currentIndex--;
        characterPrompt = true;
        document.getElementById(`letter${currentIndex}`).innerHTML = "";

    }
    else {
        alert("Please start New round!");
    }


}

function Enter() {

    if (currentIndex === 5 || currentIndex === 11 || currentIndex === 17 ||
        currentIndex === 23 || currentIndex === 29 || currentIndex === 35) {
        for (let i = 0; i < 5; i++) {
            if (guess[i] === array[i]) {

                let change = document.getElementById(`letter${currentIndex - 5 + i}`);
                change.style.backgroundColor = 'green';
                let change_key = document.getElementById(`${array[i]}`);
                change_key.style.backgroundColor = 'green';
                check++;
                if (check === 5) {
                    win = true;
                    winModal();
                }
            }
            else {
                if (guess.includes(array[i])) {
                    let change = document.getElementById(`letter${currentIndex - 5 + i}`);
                    change.style.backgroundColor = 'yellow';
                    let change_key = document.getElementById(`${array[i]}`);
                    change_key.style.backgroundColor = 'yellow';

                }
                else {
                    let change = document.getElementById(`letter${currentIndex - 5 + i}`);
                    change.style.backgroundColor = 'gray';
                    let change_key = document.getElementById(`${array[i]}`);
                    change_key.style.backgroundColor = 'gray';

                }
            }

        }
        characterPrompt = true;
        delPrompt = false;
        currentIndex++;
        round++;
        array.splice(0);
    }
    else {
        if (currentIndex < 35) {
            alert("Not complete!");

        }

    }
    if (currentIndex === 35 && !win) {
        loseModal();
    }

}
function winModal() {
    var modal = document.getElementById("winModal");
    modal.style.display = "block";
}

function loseModal() {
    var modal = document.getElementById("loseModal");
    modal.style.display = "block";
}
function reStart() {
    location.reload();
}


"use strict";
// 開啟檔案說明:
// 此次作業我使用套件VS CODE Live Server，為了順利抓取dictionary.txt的資料
// 再麻煩老師開啟hw5-109704020.html時，按右鍵Open With Live Server
// 若無法成功抓取，可以請老師註解掉  1. 第11行 let guess;  和 2.第38行~62行，fetch的函數
// 並解開第12行 let guess = "APPLE"; 進行作業測試

// -------------------------------------------------------------------------------------

// 相關變數
let guess;
// let guess = "APPLE";
let currentIndex = 0;
let characterPrompt = true;
let delPrompt = true;
let win = false;
let check = 0;
let array = [];
let round = 0;

// 產生遊戲字母方格------------------------------------------------------------------------

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

// 抓dictionary.txt的資料------------------------------------------------------------------

fetch('dictionary.txt')
    .then(response => {
        // 確認response成功與否
        if (!response.ok) {
            throw new Error('Failed to fetch the file');
        }
        //回傳
        return response.text();
    })
    .then(data => {
        const words = data.split('\n');
        const random = Math.floor(Math.random() * 5757)
        const get = words[random];
        // 轉成大寫
        const uppercaseGuess = get.toUpperCase();
        guess = uppercaseGuess.trim();


        document.getElementById('answer_1').innerHTML = guess;
        document.getElementById('answer_2').innerHTML = guess;
        // document.getElementById('answer').innerHTML = guess;
    })
    .catch(error => {
        console.error('Error:', error);
    });

// 當按下鍵盤字母，顯示在上方輸入框----------------------------------------------------------

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

// 刪除建功能-------------------------------------------------------------------------------

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

// Enter建功能-------------------------------------------------------------------------------

function Enter() {
    check = 0

    if (currentIndex === 5 || currentIndex === 11 || currentIndex === 17 ||
        currentIndex === 23 || currentIndex === 29 || currentIndex === 35) {
        for (let i = 0; i < 5; i++) {
            // 位置與字母都對
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
                // 位置不對，字母對
                if (guess.includes(array[i])) {
                    let change = document.getElementById(`letter${currentIndex - 5 + i}`);
                    change.style.backgroundColor = 'yellow';
                    let change_key = document.getElementById(`${array[i]}`);
                    change_key.style.backgroundColor = 'yellow';

                }
                else {
                    // 沒有出現的字母
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
    if (currentIndex > 35 && !win) {
        loseModal();
    }

}

// 贏家彈出視窗-------------------------------------------------------------------------------

function winModal() {
    var modal = document.getElementById("winModal");
    modal.style.display = "block";
}

// 輸家彈出視窗-------------------------------------------------------------------------------

function loseModal() {
    var modal = document.getElementById("loseModal");
    modal.style.display = "block";
}

// 重新開始-------------------------------------------------------------------------------

function reStart() {
    location.reload();
}


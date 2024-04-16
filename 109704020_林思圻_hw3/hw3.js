"use strict";

let html = "";
html += `
    <h1>Magic Game (Javascript version)</h1>
    <p>心中默想一個 1 到 63 間的任一個數, 不要讓我知道... 
    但是告訴我有沒有在以下哪幾張卡片中?我可以很快找出來喔! (e.g. 在 第1,2,4,5,6 張卡中⮕答案是 …)</p>
`;
let mask = 0;
// html += `<h2 id="result"></h2>`;

// 產生表單和卡片選擇
html += `<form id="magic-form">`;
html += `<div class="grid">`;
for (let i = 1; i <= 6; i++) {
    html += `
        <table>
            <tr>
                <th colspan='8'>
                    第${i}張卡片<input class="card" type="checkbox" value="${i}" name="select[]">
                </th>
            </tr>
    `;
    mask = 2 ** (i - 1);
    for (let j = 1, count = 0; j <= 63; j++) {
        if (j & mask) {
            if (count % 8 == 0) {
                html += `<tr>`;
            }
            html += `<td>${j}</td>`;
            if (count % 8 == 7) {
                html += `</tr>`;
            }
            count += 1;
        }
    }
    html += `</table>`;
}
html += `</div>`;
html += `<div>`;
html += `<button type="submit">GO</button>`;
html += `</div>`;
html += `</form>`;

// 動態顯示結果並變更表格背景顏色
document.write(html);

document.getElementById("magic-form").addEventListener("submit", function (event) {
    event.preventDefault(); // 防止表單預設提交行為
    let guess = 0;
    let checkedValues = [];
    let inputElements = document.getElementsByClassName('card');
    for (let i = 0; i < inputElements.length; ++i) {
        if (inputElements[i].checked) {
            checkedValues.push(parseInt(inputElements[i].value)); // 將選取的卡片值加入列表
        }
    }
    for (let k = 0; k < checkedValues.length; k++) {
        guess += 2 ** (checkedValues[k] - 1); // 計算結果總和
    }

    // 尋找並變更符合結果的表格背景顏色
    let tables = document.getElementsByTagName('table');
    for (let i = 0; i < tables.length; i++) {
        let tableCells = tables[i].getElementsByTagName('td');
        for (let j = 0; j < tableCells.length; j++) {
            let cellValue = parseInt(tableCells[j].innerText);
            if (cellValue === guess) {
                tableCells[j].style.backgroundColor = 'yellow'; // 將符合結果的表格背景顏色設為黃色
            } else {
                tableCells[j].style.backgroundColor = ''; // 重置表格背景顏色
            }
        }
    }
});

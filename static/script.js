document.addEventListener("DOMContentLoaded", function () {
    generateBoard();
    loadInputValues();
});

// Function to save the input values to localStorage
function saveInputValues() {
    const inputCells = document.querySelectorAll(".input-cell");
    inputCells.forEach((cell, index) => {
        localStorage.setItem(`inputValue_${index}`, cell.value);
    });
}

// Function to load the input values from localStorage
function loadInputValues() {
    const inputCells = document.querySelectorAll(".input-cell");
    inputCells.forEach((cell, index) => {
        const savedValue = localStorage.getItem(`inputValue_${index}`);
        if (savedValue !== null) {
            cell.value = savedValue;
        }
    });
}

function generateBoard() {
    // Get the sudokuContainer element
    const sudokuContainer = document.querySelector(".sudokuContainer");

    // Clear inner HTML
    sudokuContainer.innerHTML = "";

    // Loop to generate 81 input cells
    for (let i = 0; i < 81; i++) {
        const inputCell = document.createElement("input");
        inputCell.classList.add("input-cell");
        inputCell.setAttribute("type", "text");
        inputCell.setAttribute("pattern", "[0-9]");
        inputCell.style.fontSize = "30px";
        inputCell.style.color = "white";

        inputCell.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
            if (this.value.length > 1) this.value = this.value.slice(-1);
            if (this.value === "0") this.value = "";

            saveInputValues();
            colorEverything();
        });

        sudokuContainer.appendChild(inputCell);
    }
}

function resetBoard() {
    // Get all the input cells
    const inputCells = document.querySelectorAll(".input-cell");

    // Loop through each input cell and set its value to empty
    inputCells.forEach((cell) => {
        cell.value = ""; // Set value to empty string
        cell.style.color = "white";
    });
    saveInputValues();
}

function fillBoardRandomly() {
    // Generate a random string of 81 characters, each being a digit from 0 to 9
    var number = Array.from({ length: 81 }, () =>
        Math.floor(Math.random() * 10)
    ).join("");
    // var number = "01010000223304045506670078089909009";

    // Get all the input cells
    const inputCells = document.querySelectorAll(".input-cell");

    // Loop through each input cell and assign a number from the random string
    inputCells.forEach((cell, index) => {
        if (number[index] !== undefined) {
            cell.value = number[index];
        } else {
            cell.value = ""; // Clear out the cell if no more numbers are available
        }
    });

    // Clear zeroes
    inputCells.forEach((cell) => {
        if (cell.value === "0") {
            cell.value = ""; // Replace "0" with ""
        }
    });

    // Save the input values to localStorage
    saveInputValues();
}

function clearZeroes() {
    // Get all the input cells
    const inputCells = document.querySelectorAll(".input-cell");

    // Loop through each input cell and replace "0" with ""
    inputCells.forEach((cell) => {
        if (cell.value === "0") {
            cell.value = ""; // Replace "0" with ""
        }
    });

    // Save the input values to localStorage
    saveInputValues();
}

function logBoard() {
    const inputCells = document.querySelectorAll(".input-cell");
    let board = "";
    inputCells.forEach((cell) => {
        board += cell.value || "0";
    });
    console.log(`Current board state: ${board}`); // Log the current board state
    return board;
}

function colorIndex(index, color) {
    const inputCells = document.querySelectorAll(".input-cell");

    inputCells.item(index).style.color = color;
}

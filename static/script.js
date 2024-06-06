document.addEventListener("DOMContentLoaded", function() {
    generateBoard()
    loadInputValues()});

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

    // Clear inner html
    sudokuContainer.innerHTML = "";

    // Loop to generate boxes
    for (let i = 0; i < 81; i++) {
        const inputCell = document.createElement("input");
        inputCell.classList.add("input-cell"); // Add the "input-cell" class to the input element
        inputCell.setAttribute("type", "text"); // Set the input type to text
        inputCell.setAttribute("pattern", "[0-9]"); // Set the pattern to allow only numbers
        inputCell.style.fontSize = "30px"; 
        inputCell.style.color = "white"; // Set the default text color to white
        inputCell.style.caretColor = "transparent"; // Renive blinking pipe
        inputCell.addEventListener("input", function() {

            // Remove non-numeric characters from the input value
            this.value = this.value.replace(/\D/g, "");

            // Get its index
            const index = Array.from(document.querySelectorAll('.input-cell')).indexOf(this);
            
            // Remove every character before the last one
            if (this.value.length > 1) {
                this.value = this.value.slice(-1);
            }
            // Replace "0" with ""
            if (this.value === "0") {
                this.value = "";
            }       
            
            // Save the input values to localStorage
            saveInputValues()
            colorEverything()
            
        });

        sudokuContainer.appendChild(inputCell); // Append the input cell to the sudokuContainer
    }
}

function clearBoxes() {
    // Get all the input cells
    const inputCells = document.querySelectorAll(".input-cell");

    // Loop through each input cell and set its value to empty
    inputCells.forEach(cell => {
        cell.value = ""; // Set value to empty string
    });
    saveInputValues()
};

function fillBoardRandomly() {
    // Generate a random string of 81 characters, each being a digit from 0 to 9
    var number = Array.from({ length: 81 }, () => Math.floor(Math.random() * 10)).join("");
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
    inputCells.forEach(cell => {
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
    inputCells.forEach(cell => {
        if (cell.value === "0") {
            cell.value = ""; // Replace "0" with ""
        }
    });

    // Save the input values to localStorage
    saveInputValues();
}

function logBoard() {
    // Get all the input cells
    const inputCells = document.querySelectorAll(".input-cell")
    var board = ""

    inputCells.forEach(cell => {
        if (cell.value == "") {
            board += "0"
        }
        else {
            board += cell.value
        }
        
    });
    // console.log(board)
    return board
}

function colorIndex(index, color) {
    const inputCells = document.querySelectorAll(".input-cell")

    inputCells.item(index).style.color = color
}

function colorEverything () {
    const inputCells = document.querySelectorAll(".input-cell");
    board = logBoard()

    let layers = [];
    for (let i = 0; i < board.length; i += 9) {
        let layer = board.slice(i, i + 9).split("");
        layers.push(layer);
    }
    console.log(layers)
    

}

function sliceIntoLayers(digitString) {
    let layers = [];
    for (let i = 0; i < digitString.length; i += 9) {
        let layer = digitString.slice(i, i + 9).split("");
        layers.push(layer);
    }
    return layers;
}

function sliceIntoColumns(digitString) {
    let columns = [];
    
    for (let i = 0; i < 9; i++) {
        let column = [];
        for (let j = i; j < digitString.length; j += 9) {
            column.push(digitString[j]);
        }
        columns.push(column);
    }
    
    return columns;
}


function colorDuplicates(layers, orientation) {
    const inputCells = document.querySelectorAll(".input-cell");

    function returnIndexList(layer) {
        let charCount = {};
        let indexList = [];

        // Count the occurrences of each character
        for (let i = 0; i < layer.length; i++) {
            let char = layer[i];
            if (!charCount[char]) {
                charCount[char] = [];
            }
            charCount[char].push(i);
        }

        // Collect the indices of duplicate characters
        for (let char in charCount) {
            if (charCount[char].length > 1) {
                indexList = indexList.concat(charCount[char]);
            }
        }

        return indexList;
    }

    function colorIndex(index, color) {
        // Check if the value of the cell is not '0' before coloring
        if (inputCells.item(index).value !== '0') {
            inputCells.item(index).style.color = color;
        }
        else {
            inputCells.item(index).style.color = "white";
        }
    }

    for (let i = 0; i < layers.length; i++) {
        let layer = layers[i];
        let indexList = returnIndexList(layer);

        for (let k = 0; k < indexList.length; k++) {
            if (orientation === "rows") {
                colorIndex(i * 9 + indexList[k], "red");
            } else if (orientation === "columns") {
                colorIndex(i + indexList[k] * 9, "red");
            }
        }
    }
}


function colorEverything() {
    for (i = 0; i< 81; i++){
        colorIndex(i, "white")
    }
    board = logBoard()
    colorDuplicates(sliceIntoLayers(board), "rows");
    colorDuplicates(sliceIntoColumns(board), "columns");
}
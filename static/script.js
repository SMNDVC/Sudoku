document.addEventListener("DOMContentLoaded", function() {
    generateBoard()
    loadInputValues()
    colorEverything()
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

function resetBoard() {
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

function sliceIntoGrids(digitString) {
    let grids = [];
    
    for (let gridRow = 0; gridRow < 3; gridRow++) {
        for (let gridCol = 0; gridCol < 3; gridCol++) {
            let grid = [];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    let index = (gridRow * 27) + (gridCol * 3) + (row * 9) + col;
                    grid.push(digitString[index]);
                }
            }
            grids.push(grid);
        }
    }
    
    return grids;
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
            } else if (orientation === "grid") {
                // Calculate the base index for the current grid
                let baseRow = Math.floor(i / 3) * 3;
                let baseCol = (i % 3) * 3;
                let baseIndex = baseRow * 9 + baseCol;
                
                // Calculate the specific index within the grid
                let row = Math.floor(indexList[k] / 3);
                let col = indexList[k] % 3;
                let gridIndex = baseIndex + row * 9 + col;
                
                colorIndex(gridIndex, "red");
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
    colorDuplicates(sliceIntoColumns(board), "columns")
    colorDuplicates(sliceIntoGrids(board), "grid");
}

function logIndexes() {
    var number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]
    

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

    // Save the input values to localStorage
    saveInputValues()
    for (i = 0; i< 81; i++){
        colorIndex(i, "white")
    }
}

function makePlayableBoard(difficulty) {

    function mergeLayers(layers) {
        let mergedString = '';
        for (let layer of layers) {
            mergedString += layer.join('');
        }
        return mergedString;
    }
    function generateRandomNumber() {
        let int = Math.floor(Math.random() * 10)
        if (int === 0) {
            i-=1
            generateRandomNumber()
        }
        return String(int)
    }

    layers = sliceIntoLayers(logBoard())
    resetBoard()
    const inputCells = document.querySelectorAll(".input-cell");
    lst = []

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 9; j++) {
            let int = generateRandomNumber()
            let index = generateRandomNumber()

            layers[j][index] = int

            if (!isBoardValid(mergeLayers(layers))) {
                j -= 1
                continue
            }
        }
    }
    console.log(layers)
}

function isBoardValid(board) {
    if (!board) board = logBoard()
    // Utility function to check for duplicates in a layer
    function hasDuplicates(layer) {
        let seen = new Set();
        for (let i = 0; i < layer.length; i++) {
            let char = layer[i];
            if (char !== '0') { // assuming '0' represents an empty cell
                if (seen.has(char)) {
                    return true;
                }
                seen.add(char);
            }
        }
        return false;
    }

    let layers = sliceIntoLayers(board);
    let columns = sliceIntoColumns(board);
    let grids = sliceIntoGrids(board);

    // Check each layer for duplicates
    for (let i = 0; i < 9; i++) {
        if (hasDuplicates(layers[i]) || hasDuplicates(columns[i]) || hasDuplicates(grids[i])) {
            return false;
        }
    }

    return true;
}
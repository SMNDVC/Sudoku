var quiz = "";
var solution = "";

function saveQuizSolution() {
  localStorage.setItem("quiz", quiz);
  localStorage.setItem("solution", solution);
}

document.addEventListener("DOMContentLoaded", function () {
  generateBoard();
  loadInputValues();
  updateGame();
  setLives();
  preloadQuizzes();
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
  quiz = localStorage.getItem("quiz");
  solution = localStorage.getItem("solution");
}

function generateBoard() {
  const sudokuContainer = document.querySelector(".sudokuContainer");
  sudokuContainer.innerHTML = ""; // Clear the container

  // Create 9 "box" elements for the 3x3 grid
  for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
    const box = document.createElement("div");
    box.classList.add("sudoku-box");
    box.id = `box-${boxIndex + 1}`; // Add unique ID to each box
    sudokuContainer.appendChild(box);
  }

  // Fill the 3x3 boxes with fields
  let fieldId = 0; // Field ID counter
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const inputCell = document.createElement("input");
      inputCell.classList.add("input-cell");
      inputCell.setAttribute("type", "text");
      inputCell.setAttribute("pattern", "[0-9]");
      inputCell.style.fontSize = "30px";
      inputCell.style.color = "white";
      inputCell.style.backgroundColor = "#2f2f2f"
      inputCell.id = `field-${fieldId}`; // Assign unique ID to each field

      inputCell.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        if (this.value.length > 1) this.value = this.value.slice(-1);
        if (this.value === "0") this.value = "";

        updateGame();
      });

      // Calculate which 3x3 box this field belongs to
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const boxIndex = boxRow * 3 + boxCol;

      // Append the cell to the correct box
      const box = sudokuContainer.children[boxIndex];
      box.appendChild(inputCell);

      fieldId++; // Increment the field ID
    }
  }
}

// Function to set each field's value to its ID
function setFieldValuesToId() {
  const fields = document.querySelectorAll(".input-cell");
  fields.forEach((field) => {
    // Extract numbers from the ID (e.g., 'field-1' -> '1')
    const numberOnly = field.id.replace(/\D/g, "");
    field.value = numberOnly; // Set value to the extracted number
  });
  saveInputValues();
}

function resetBoard() {
  // Get all the input cells
  const inputCells = document.querySelectorAll(".input-cell");

  // Loop through each input cell and set its value to empty
  inputCells.forEach((cell) => {
    cell.value = ""; // Set value to empty string
    cell.style.color = "white";
    cell.style.backgroundColor = "#2f2f2f"
  });

  localStorage.removeItem("quizzFields");
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

function getBoard() {
  let boardMap = [];

  // Iterate through field IDs from 0 to 80
  for (let i = 0; i <= 80; i++) {
    // Loop through IDs field-1 to field-80
    const field = document.getElementById(`field-${i}`);
    if (field) {
      boardMap.push([field, field.value]); // Set the field id and value in the map
    }
  }

  return boardMap; // Return the Map
}

function getRows(board) {
  let rows = [];

  for (let i = 0; i < 9; i++) {
    rows.push(board.slice(i * 9, (i + 1) * 9));
  }

  return rows;
}

function getColumns(board) {
  let columns = [];

  for (let i = 0; i < 9; i++) {
    let row = board.map((list) => list[i]);
    columns.push(row);
  }

  return columns;
}

function getGrids(board) {
  let grids = [];

  for (let i = 0; i < 9; i++) {
    let grid = [];
    let startRow = Math.floor(i / 3) * 3;
    let startCol = (i % 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        grid.push(board[r][c]);
      }
    }

    grids.push(grid);
  }

  return grids;
}

function getEverything() {
  board = getBoard();
  rows = getRows(board);
  columns = getColumns(rows);
  grids = getGrids(rows);

  return { rows: rows, columns: columns, grids: grids };
}

function getMatchingElements(arr) {
  const matchingElements = [];

  for (let h = 0; h < 9; h++) {
    // Fixed 'row' modification
    const row = arr[h]; // Declare row inside the loop
    for (let i = 0; i < 9; i++) {
      if (row[i][1] === "") continue; // Skip if the second element is an empty string

      for (let j = i + 1; j < 9; j++) {
        if (row[j][1] === "") continue; // Skip if the second element is an empty string

        if (row[i][1] === row[j][1]) {
          matchingElements.push(row[i][0], row[j][0]);
        }
      }
    }
  }

  return matchingElements;
}

function updateGame() {
  everything = getEverything();

  const rowsMatches = getMatchingElements(everything.rows);
  const columnsMatches = getMatchingElements(everything.columns);
  const gridsMatches = getMatchingElements(everything.grids);

  // Combine all matches
  const allMatches = [...rowsMatches, ...columnsMatches, ...gridsMatches];
  const uniqueMatches = [...new Set(allMatches)];

  resetColor();
  colorMatches(uniqueMatches);
  isFull();
  saveInputValues();
}

function colorMatches(matches) {
  let matched = false;
  matches.forEach((match) => {
    match.style.color = "red";
    match.style.backgroundColor = "#ff000020";
    matched = true;
  });
  if (matched) {
    localStorage.setItem(
      "lives",
      Math.max((+localStorage.getItem("lives") || 0) - 1, 0)
    );
    if (localStorage.getItem("lives") == 0) {
      lost();
    }
    setLives();
  }
}

function resetColor() {
  const inputCells = document.querySelectorAll(".input-cell");
  inputCells.forEach((cell) => {
    cell.style.color = "white";
    cell.style.backgroundColor = "#2f2f2f";
  });

  const quizzFields = JSON.parse(localStorage.getItem("quizzFields")) || []
  quizzFields.forEach((fieldID) => {
    let field = document.getElementById(fieldID)
    field.style.backgroundColor = "#222222"
    field.setAttribute("readonly", true);
  })
}
function fillBoard(board) {
  resetBoard();

  for (let i = 0; i < 81; i++) {
    const field = document.getElementById(`field-${i}`);
    if (field) {
      field.value = board[i]; // Set the value from the board array to the field
    }
  }
  clearZeroes();
  updateGame();
}

async function preloadQuizzes(targetCount = 10) {
  try {
    // Retrieve existing quizzes from localStorage
    let quizzes = JSON.parse(localStorage.getItem("sudokuGames")) || [];
    const currentCount = quizzes.length;

    // Calculate the number of quizzes to fetch to reach targetCount
    const neededCount = targetCount - currentCount;

    if (neededCount > 0) {
      for (let i = 0; i < neededCount; i++) {
        const response = await fetch("/quiz");
        const data = await response.json();
        quizzes.push(data);
      }

      // Update localStorage with the new set of quizzes
      localStorage.setItem("sudokuGames", JSON.stringify(quizzes));
    }
  } catch (error) {
    console.error("Error preloading quizzes:", error);
  }
}

// Function to load a quiz from localStorage
function loadQuiz() {
  let quizzes = JSON.parse(localStorage.getItem("sudokuGames")) || [];
  localStorage.setItem("quizzFields", JSON.stringify([])); // Initialize as a JSON string
  const elements = document.querySelectorAll(".input-cell")
  elements.forEach((element) => {element.removeAttribute("readonly")})

  if (quizzes.length > 0) {
    const { quiz, solution } = quizzes.shift(); // Take the first quiz
    fillBoard(quiz);
    
    setFieldsToReadonly();
    // Update the global variables or handle as needed
    window.quiz = quiz;
    window.solution = solution;

    saveQuizSolution();

    // Save the remaining quizzes back to localStorage
    localStorage.setItem("sudokuGames", JSON.stringify(quizzes));

    // Preload a new game to maintain the inventory
    preloadQuizzes();
  } else {
    window.alert("Slow down there, leave some sudokus for the rest of us");
  }

  document.querySelector(".lose-text")?.classList.add("d-none");
  const btnContainer = document.querySelector(".btn-container")
  btnContainer.style.display = "flex"
  localStorage.removeItem("lives");
  setLives();
}

function setFieldsToReadonly() {
  const elements = document.querySelectorAll(".input-cell");

  // Retrieve fields from local storage and parse it as JSON
  let fields = JSON.parse(localStorage.getItem("quizzFields")) || [];
  
  elements.forEach((element) => {
    element.removeAttribute("readonly");
    element.style.color = "white";

    // Check if the input value is non-empty
    if (element.value.trim() !== "") {
      if (!fields.includes(element.id)) { // Avoid duplicates
        fields.push(element.id);
      }
      
      element.setAttribute("readonly", true);
      element.style.backgroundColor = "#222222";
    }
  });

  // Save updated fields back to local storage as a JSON string
  localStorage.setItem("quizzFields", JSON.stringify(fields));
}




function logBoard() {
  let board = "";

  // Iterate through field IDs from 0 to 80
  for (let i = 0; i <= 80; i++) {
    // Get the field element by ID
    const field = document.getElementById(`field-${i}`);
    if (field) {
      board += field.value || "0"; // Append the value or "0" if empty
    }
  }
  return board;
}

function isFull() {
  board = logBoard();
  if (board == solution) {
    for (let i = 0; i <= 80; i++) {
      // Loop through IDs field-1 to field-80
      const field = document.getElementById(`field-${i}`);
      if (field) {
        setTimeout(() => {
          field.style.color = "green";
          field.style.backgroundColor = "#00ff0020"; // Set background color
        }, 20 * i); // Increment delay for each cell
      }
    }
    setTimeout(() => {
      document.querySelector(".winner-text")?.classList.remove("d-none");
      document.querySelector(".btn-container")?.classList.add("d-none")
    }, 2000); // Increment delay for each cell
    return true;
  }
  document.querySelector(".winner-text")?.classList.add("d-none");
  document.querySelector(".btn-container")?.classList.remove("d-none")
  return false;
}

function setLives() {
  const lives = localStorage.getItem("lives");
  const livesElement = document.getElementById("lives");

  if (!lives) {
    localStorage.setItem("lives", 3);
    livesElement.innerHTML = "❤️".repeat(3);
  } else {
    livesElement.innerHTML = "❤️".repeat(lives);
  }
}

function lost() {
  document.querySelector(".lose-text")?.classList.remove("d-none");
  const element = document.querySelector(".btn-container")
  element.style.display = "none";

  const elements = document.querySelectorAll(".input-cell")
  elements.forEach((element) => {element.setAttribute("readonly", true)})
}

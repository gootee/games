// Beginner – 9 * 9 Board and 10 Mines
// Intermediate – 16 * 16 Board and 40 Mines
// Advanced – 24 * 24 Board and 99 Mines

let dimension = 16, mineCount = 0, cells;

function setBoardParams() {
  const cells = document.querySelector(".minesweeper_cells")

  switch (dimension) {
    case 9: {
      cells.classList.add("minesweeper_cells_9x9");
      cells.classList.remove("minesweeper_cells_16x16");
      cells.classList.remove("minesweeper_cells_24x24");
      mineCount = 10;
      break;
    }
    case 16: {
      cells.classList.remove("minesweeper_cells_9x9");
      cells.classList.add("minesweeper_cells_16x16");
      cells.classList.remove("minesweeper_cells_24x24");
      mineCount = 40;
      break;
    }
    case 24: {
      cells.classList.remove("minesweeper_cells_9x9");
      cells.classList.remove("minesweeper_cells_16x16");
      cells.classList.add("minesweeper_cells_24x24");
      mineCount = 99;
      break;
    }    
  }
}

function loadBoard() {
  setBoardParams();
  let htmlString = '',
    mineIndices = [], 
    cellCount = dimension * dimension;

  while (mineIndices.length < mineCount) {
    const testIndex = Math.floor(Math.random() * cellCount)
    if (mineIndices.indexOf(testIndex) === -1) {
      mineIndices.push(testIndex);
    }
  }

  for (let i = 0; i < cellCount; i++) {

    //bomb 
    const classString =
    "class='minesweeper_cell" +
    (mineIndices.indexOf(i) === -1 ? '' : ' hasBomb') +
    "'"

    htmlString += 
    "<div id=" + 
    i.toString() + 
    " " +
    classString +
    ">" + 
    "<p class='cell_display'>&#128163;</p>" +
    "</div>"
  }

  document.querySelector(".minesweeper_cells").insertAdjacentHTML("afterbegin", htmlString)
}

// function revealBoard() {
//   cells.forEach(cell => {
//     cell.
//   })
// }

function revealCell(cell) {
  cell.classList.add("revealed_cell")
}

function clickCell(event) {
  const cell = event.currentTarget;
  revealCell(cell);
  if (cell.classList.contains("hasBomb")) {

  }
}

// function clickDisplay(event) {
//   debugger
//   const cell = event.target.parentElement
//   testCell(cell)
// }

function load() {
  // debugger
  loadBoard();
  cells = document.querySelectorAll(".minesweeper_cell")
  cells.forEach(cell => {
    cell.addEventListener("click", clickCell)
    // cell.querySelector(".cell_display").addEventListener("click", clickDisplay)
  })
}

// console.log("in file")
load();

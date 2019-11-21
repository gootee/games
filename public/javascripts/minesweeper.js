// import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

// Beginner – 9 * 9 Board and 10 Mines
// Intermediate – 16 * 16 Board and 40 Mines
// Advanced – 24 * 24 Board and 99 Mines

let dimension = 16,
  mineCount = 0, 
  cells


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

// function convertIndexToRowAndColumn(index) {
//   const cellPosition = {}

//   cellPosition.row = Math.ceil((index + 1)/dimension);
//   cellPosition.col = ((index + 1) % dimension) > 0 ? ((index + 1) % 9) : 9;
  
//   return cellPosition;
// }

function convertRowAndColumnToIndex(row, col) {
  return (row - 1) * dimension + col - 1
}

function countAdjacentMines(index, mineMap) {
  let adjacentBombCount = 0;
  const indexCellColumnNum = (index > 0 && index % dimension === 0) ? dimension : index % dimension + 1;
  const indexCellRowNum = index === 0 ? 1 : Math.ceil(index/dimension);
  const leftSearchColumnNum = indexCellColumnNum === 1 ? 1 : indexCellColumnNum - 1;
  const rightSearchColumnNum = indexCellColumnNum === dimension ? dimension : indexCellColumnNum + 1;
  const topSearchRowNum = indexCellRowNum === 1 ? 1 : indexCellRowNum - 1;
  const bottomSearchRowNum = indexCellRowNum === dimension ? dimension : indexCellRowNum + 1;

  for (let row = topSearchRowNum; row <= bottomSearchRowNum; row++) {
    for (let col = leftSearchColumnNum; col <= rightSearchColumnNum; col++) {
      const thisIndex = convertRowAndColumnToIndex(row, col)
      if (mineMap[thisIndex]) {
        adjacentBombCount ++;
      }
    }
  }

  return adjacentBombCount;
}

// function getAdjacentMineCount() {

// }

function loadBoard() {
  const cellCount = dimension * dimension;
  let mineMap = Array(cellCount).fill(false),
    htmlString = '',
    minesCreated = 0

  setBoardParams();    

  while (minesCreated < mineCount) {
    const testIndex = Math.floor(Math.random() * cellCount) 
    if (!mineMap[testIndex]) {
      mineMap[testIndex] = true;
      minesCreated ++
    }
  }

  for (let i = 0; i < cellCount; i++) {
    // debugger;
    const hasBomb = mineMap[i];
    const adjacentBombCount = countAdjacentMines(i, mineMap)
    const cellDisplay = getCellDisplay(hasBomb, adjacentBombCount)
    const classString =
      "class='minesweeper_cell" +
      " adjacent_mine_count" +    //keep adjacentMineCount at classList[1]
      adjacentBombCount.toString() +
      (hasBomb ? ' hasBomb' : '') +
      "'"

    htmlString += 
      "<div id=" + 
      i.toString() + 
      " " +
      classString +
      ">" + 
      "<p class='cell_display'>" +
      cellDisplay.display +
      "</p>" +
      "</div>"
  }

  document.querySelector(".minesweeper_cells").insertAdjacentHTML("afterbegin", htmlString)
}

function getCellDisplay(hasBomb, adjacentBombCount) {
  if (hasBomb) {
    return { 
      displayString: "&#128163;",
      color: ""
    }
  } else {
    let assignedColour
    switch (adjacentBombCount) {
      case 0: {
        assignedColour = "green"
        break;        
      }
      case 1: {
        assignedColour = "red"
        break;
      }
      case 2: {
        assignedColour = "blue"
        break;        
      }
      default: {
        assignedColour = "brown"
        break;          
      }
    }
    return {
      displayString: adjacentBombCount.toString(),
      color: assignedColour      
    }
  }

}

function revealCell(cell) {
  cell.classList.add("revealed_cell")
}

function clickCell(event) {
  const cell = event.currentTarget;
  revealCell(cell);
  if (cell.classList.contains("hasBomb")) {

  }
}

function load() {
  // debugger
  loadBoard();
  cells = document.querySelectorAll(".minesweeper_cell")
  cells.forEach(cell => {
    cell.addEventListener("click", clickCell)
  })
}

// console.log("in file")
load();

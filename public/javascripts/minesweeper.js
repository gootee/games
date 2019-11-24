// Beginner – 9 * 9 Board and 10 Mines
// Intermediate – 16 * 16 Board and 40 Mines
// Advanced – 24 * 24 Board and 99 Mines

let dimension = 16,
  mineCount = 0, 
  cells,
  gameStatus,
  leftButtonDown = false,
  rightButtonDown = false,
  clickProcessed = false
   
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

function getAdjacentCells(index) {
  let adjacentCellIndices = [];
  const indexCellColumnNum = (index > 0 && index % dimension === 0) ? 1 : index % dimension + 1;
  const indexCellRowNum = index % dimension === 0 ? index/dimension + 1 : Math.ceil(index/dimension);
  const leftSearchColumnNum = indexCellColumnNum === 1 ? 1 : indexCellColumnNum - 1;
  const rightSearchColumnNum = indexCellColumnNum === dimension ? dimension : indexCellColumnNum + 1;
  const topSearchRowNum = indexCellRowNum === 1 ? 1 : indexCellRowNum - 1;
  const bottomSearchRowNum = indexCellRowNum === dimension ? dimension : indexCellRowNum + 1;

  for (let row = topSearchRowNum; row <= bottomSearchRowNum; row++) {
    for (let col = leftSearchColumnNum; col <= rightSearchColumnNum; col++) {
      const thisIndex = convertRowAndColumnToIndex(row, col)
      if (thisIndex != index) {
        adjacentCellIndices.push(thisIndex);
      }
    }
  }

  return adjacentCellIndices;
}

function countAdjacentMines(index, mineMap) {
  const adjacentCells = getAdjacentCells(index);
  let adjacentMineCount = 0;

  for (adjacentCellIndex of adjacentCells) {

    if (mineMap[adjacentCellIndex]) {
      adjacentMineCount ++;
    }    
  }

  return adjacentMineCount;
}

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
    let cellParams = {}
    cellParams.hasBomb = mineMap[i];
    cellParams.adjacentMineCount = countAdjacentMines(i, mineMap)
    const cellDisplay = getCellDisplay(cellParams)
    const classString =
      "class='minesweeper_cell" +
      " adjacent_mine_count" +    //keep adjacentMineCount at classList[1]
      cellParams.adjacentMineCount.toString() +
      (cellParams.hasBomb ? ' hasBomb' : '') +
      "'"

    htmlString += 
      "<div id=" + 
      i.toString() + 
      " " +
      classString +
      ">" + 
      "<p class='cell_display'" + 
      "style='color:" +
      cellDisplay.color +
      ";'" +
      ">" +
      cellDisplay.displayString +
      "</p>" +
      "</div>"
  }

  document.querySelector(".minesweeper_cells").insertAdjacentHTML("afterbegin", htmlString)
  gameStatus = "active"
}

// function getCellDisplay(hasBomb, adjacentMineCount) {
function getCellDisplay(cellParams) {
  
  if (cellParams.hasFlag) {
    return { 
      displayString: "&#128681;",
      color: ""
    }
  } else if (cellParams.hasQuestion) {
    return { 
      displayString: "&#63;",
      color: ""
    }
  } else if (cellParams.hasBomb) {
      return { 
        displayString: "&#128163;",
        color: ""
      }
  } else {
    let assignedColour = "";
    let adjacentMineCountString = cellParams.adjacentMineCount.toString();
    switch (cellParams.adjacentMineCount) {
      case 0: {
        adjacentMineCountString = "";
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
      case 3: {
        assignedColour = "green"
        break;        
      }
      case 4: {
        assignedColour = "purple"
        break;        
      }
      case 5: {
        assignedColour = "maroon"
        break;        
      }
      case 6: {
        assignedColour = "yellow"
        break;        
      }    
      case 7: {
        assignedColour = "orange"
        break;        
      }
      case 8: {
        assignedColour = "black"
        break;        
      }  
      default: {
        assignedColour = "brown"
        break;          
      }
    }
    return {
      displayString: adjacentMineCountString,
      color: assignedColour      
    }
  }

}

function convertAdjacentMineCount(classString) {
  const num = classString.substr(19)
  return parseInt(num);
}

function revealCell(cell) {
  cell.classList.add("revealed_cell")
}

function flagClick(cell) {
  let cellParams = {}
  cellParams.isCellRevealed = cell.classList.contains("revealed_cell")
  if (!cellParams.isCellRevealed) {
    cellParams.hasFlag = cell.classList.contains("hasFlag")
    cellParams.hasQuestion = cell.classList.contains("hasQuestion")
    cellParams.hasBomb = cell.classList.contains("hasBomb")
  
    if (cellParams.hasFlag) {
      cell.classList.remove("hasFlag");
      cellParams.hasFlag = false;
      cell.classList.add("hasQuestion");
      cellParams.hasQuestion = true;
    } else if (cellParams.hasQuestion) {
      cell.classList.remove("hasQuestion")
      cellParams.hasQuestion = false;
    } else {
      cell.classList.add("hasFlag")
      cellParams.hasFlag = true;
    }
  
    const cellDisplay = getCellDisplay(cellParams);
    cell.firstChild.innerHTML = cellDisplay.displayString;
  }
}

function clickCell(event) {
  processClick(event.currentTarget)
}

function processClick(cell) {
  if (gameStatus === "active") {

    const isCellRevealed = cell.classList.contains("revealed_cell") 
    if (rightButtonDown) {
      event.preventDefault();
      rightButtonDown = false;

      if (isCellRevealed && leftButtonDown) { //both buttons clicked simultaneously
        leftButtonDown = false;
        const adjacentCellIndices = getAdjacentCells(cell.id);
        if (adjacentCellIndices.length > 0) {
          for (index of adjacentCellIndices) {
            const adjacentCell = document.getElementById(index);
            if (!adjacentCell.classList.contains("revealed_cell") &&
            !adjacentCell.classList.contains("hasBomb")) {
              processClick(adjacentCell);
            }
          }
        }
      } else {    //right click only
        flagClick(cell)
      }
    } else {

      if (cell.classList.contains("hasBomb")) {
        cell.classList.add("killer_mine")
        const allBombs = document.querySelectorAll(".hasBomb")
        for (let i = 0; i < allBombs.length; i++) {
          revealCell(allBombs[i]);
        }
        gameStatus = "fail"
      } else {
  
  
        let cellsIndicesToReveal = [parseInt(cell.id)];
        currentCounter = 0;
  
        while ((cellsIndicesToReveal) && cellsIndicesToReveal.length >= currentCounter + 1) {
          const curCellIndex = cellsIndicesToReveal[currentCounter];
          const curCell = document.getElementById(curCellIndex.toString())
          const adjacentMineCount = convertAdjacentMineCount(curCell.classList[1])
  
          if (adjacentMineCount === 0) {
            const adjacentCellIndices = getAdjacentCells(curCell.id)
            if (adjacentCellIndices.length > 0) {
              for (let i = 0; i < adjacentCellIndices.length; i++) {
                const adjacentCellIndex = adjacentCellIndices[i]
                if (!document.getElementById(adjacentCellIndex).classList.contains("revealed_cell")) {
                  if (cellsIndicesToReveal.indexOf(adjacentCellIndex) === -1) {
                    cellsIndicesToReveal.push(adjacentCellIndex)
                  }              
                }
              }          
            }
          }  
  
          revealCell(curCell);
          currentCounter++;
        }
      }
    }
  }
}

function mouseDownOnCell(event) {
  if(event.which === 1) {
    leftButtonDown = true;
  } else if (event.which === 3) {
    rightButtonDown = true;
  }
}

function load() {
  loadBoard();
  cells = document.querySelectorAll(".minesweeper_cell")
  cells.forEach(cell => {
    cell.addEventListener("mousedown", mouseDownOnCell)
    cell.addEventListener("click", clickCell)
    cell.addEventListener("contextmenu", clickCell)
  })
}

load();
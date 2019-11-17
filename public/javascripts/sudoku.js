let puzzleArr, solutionArr, cells, puzzleStatus = "", mostRecentCellRef
  
function checkForValueConflict(targetCell) {
  const cellInput = targetCell.firstChild.value
  let cellsInConflict = [];
  for (let i = 1; i < targetCell.classList.length; i++) {
    const thisCollection = getCollection(targetCell.classList[i])
    for (cell of thisCollection) {
      if (cell === targetCell) {
        continue
      }

      if (cell.firstChild.value === cellInput) {
        if (cellsInConflict.indexOf(cell) === -1) {
          cellsInConflict.push(cell);            
        }
        break;
      }
    }
  }

  return cellsInConflict;
}

function getCollection(collectionType) {
  return document.querySelectorAll("." + collectionType)
}

function formatCells(targetCells, formatClass, status, reset) {
  if (reset) {
    for (cell of cells) {
      cell.firstChild.classList.remove("conflict", "victory")
    }
  }

  for(cell of targetCells) {
    if (status) {
      cell.firstChild.classList.add(formatClass)
    } else {
      cell.firstChild.classList.remove(formatClass)
    }
  }
}

function validateCell(event) {
  const numInput = this.value.replace(/[^0-9]/g,'');
  this.value = numInput;
  formatCells(document.querySelectorAll(".cell"), "conflict", false)
  const targetCell = event.target.parentElement
  mostRecentCellRef = "." + targetCell.classList[1] + "." + targetCell.classList[2]; //row and col
  if (numInput) {
    const collectionsInConflict = checkForValueConflict(targetCell)  
    if (collectionsInConflict.length > 0) {
      formatCells([...collectionsInConflict, targetCell], "conflict", true)
    }      
  }
}

function convertIndexToRowAndColumn(index) {
  const cellPosition = {}

  cellPosition.row = Math.ceil((index + 1)/9);
  cellPosition.col = ((index + 1) % 9) > 0 ? ((index + 1) % 9) : 9;
  
  return cellPosition;
}

function convertRowAndColumnToIndex(cell) {
  const row = parseInt(cell.classList[1].substr(3))
  const col = parseInt(cell.classList[2].substr(3))
  return (row - 1) * 9 + col - 1
}

function loadPuzzle(valueArr) {
  for (let i = 0; i < valueArr.length; i++) {
    const cellValue = valueArr[i]
    const {row, col} = convertIndexToRowAndColumn(i);
    const cellRef = ".row"+row.toString()+".col"+col.toString();    
    if (cellValue > 0) {
      document.querySelector(cellRef).firstChild.value = cellValue;
    } else {
      if (!mostRecentCellRef && mostRecentCellRef != 0) {
        mostRecentCellRef = cellRef  //default to the first empty cell in the puzzle
      }
    }
  }
}

function checkPuzzle() {
  let allCollectionsGood = true, collectionName;
  const collectionTypes = ["row", "col", "grp"];
  for (let i = 1; i <= 9; i++) {
    for (let type = 0; type <= 2; type++) {
      collectionName = collectionTypes[type] + i.toString();
      if (!isCollectionComplete(collectionName)) {
        allCollectionsGood = false;
        break;
      }      
    }

    if (!allCollectionsGood) {
      break;
    }
  }

  if (allCollectionsGood) {
    formatCells(cells, "victory", true, true)
  } else {
    formatCells(document.querySelectorAll("." + collectionName), "conflict", true, true)
  }
}

function isCollectionComplete(collectionClass) {
  const allCells = document.querySelectorAll("." + collectionClass)
  const cellValues = []
  let allValuesGood = false;

  for(let cell of allCells.values()) { 
    const value = cell.firstChild.value
    if (value && value > 0) {
      cellValues.push(parseInt(value))
    } else {
      cellValues.push(0)
    }
  }

  if (cellValues.length === 9) {
    allValuesGood = true;
    for (let i = 1; i <= 9; i++) {
      const thisIndex = cellValues.indexOf(i)
      if (thisIndex === -1 || thisIndex !== cellValues.lastIndexOf(i)) {
        allValuesGood = false;
        break;
      }
    }
  }
  return allValuesGood;
}

function setPuzzleStatus(status) {

  puzzleStatus = status
  document.querySelector(".game_status").innerHTML = status
}

function showSolution() {
  loadPuzzle(solutionArr)
}

function showHint() {
  const hintCell = getHintCell();
  if (hintCell) {
    hintCell.firstChild.value = solutionArr[convertRowAndColumnToIndex(hintCell)];
    mostRecentCellRef = "." + hintCell.classList[1] + "." + hintCell.classList[2]
  }
}

function getHintCell() {
  const mostRecentCell = document.querySelector(mostRecentCellRef)
  for (let i = 3; i >= 1; i--) {
    let emptyCellsInThisCollection = [];
    document.querySelectorAll("." + mostRecentCell.classList[i]).forEach(cell => {
      if (!cell.firstChild.value) {
        emptyCellsInThisCollection.push(cell)
      }
    })

    if (emptyCellsInThisCollection.length > 0) {
      return emptyCellsInThisCollection[Math.floor(Math.random() * emptyCellsInThisCollection.length)];
    }
  } 
}

function load() {
  const puzzleStrings = puzzle.split(',')
  puzzleArr = puzzleStrings[0].split('')
  solutionArr = puzzleStrings[1].split('')
  loadPuzzle(puzzleArr)

  cells = document.querySelectorAll(".cell")
  cells.forEach(cell => {
    cell.firstChild.addEventListener("input", validateCell)
  })
  document.querySelector(".check_game").addEventListener("click", checkPuzzle)
  document.querySelector(".show_solution").addEventListener("click", showSolution)
  document.querySelector(".hint").addEventListener("click", showHint)
}

load();













function sudoku(puzzle) {
  let solveQueue = [],
    updateCount = 0;
  let groups = {
    r1: { vals: [] },
    r2: { vals: [] },
    r3: { vals: [] },
    r4: { vals: [] },
    r5: { vals: [] },
    r6: { vals: [] },
    r7: { vals: [] },
    r8: { vals: [] },
    r9: { vals: [] },
    c1: { vals: [] },
    c2: { vals: [] },
    c3: { vals: [] },
    c4: { vals: [] },
    c5: { vals: [] },
    c6: { vals: [] },
    c7: { vals: [] },
    c8: { vals: [] },
    c9: { vals: [] },
    g1: { vals: [] },
    g2: { vals: [] },
    g3: { vals: [] },
    g4: { vals: [] },
    g5: { vals: [] },
    g6: { vals: [] },
    g7: { vals: [] },
    g8: { vals: [] },
    g9: { vals: [] }
  };

  loadGroupsFromArray(puzzle);

  while (true) {
    Object.values(groups).forEach(evaluateGroup);

    solveQueue = loadSolveQueue();

    groupCount = solveQueue ? solveQueue.length : 0;
    if (groupCount === 0) {
      let finishedPuzzle = [];
      for (n = 1; n <= 9; n++) {
        finishedPuzzle.push(groups["r" + n.toString()].vals);
      }
      return finishedPuzzle;
    } else {
      for (z in groups) {
        groups[z].priority = 0;
      }
      updateCount = 0;

      for (i = 0; i < groupCount; i++) {
        solveGroupName = solveQueue[i][0];
        if (i < groupCount - 1) {
          nextGroupPriority = solveQueue[i + 1][1].priority;
        } else {
          nextGroupPriority = 0;
        }

        solveGroup = groups[solveGroupName];
        solveGroup.vals.forEach(solveForSpace);
        if (updateCount > 0 && nextGroupPriority === 0) {
          break;
        }
      }
    }
  }

  function loadSolveQueue() {
    let orig = Object.entries(groups);
    let orderedGroups = [];

    orig = orig.filter(o => o[1].answerCount < 9).sort(orderGroups);
    for (x = 0; x < orig.length; x++) {
      let cloneGroup = { ...orig[x][1] };
      groupName = orig[x][0];

      orderedGroups.push([groupName, cloneGroup]);
    }
    return orderedGroups;

    function orderGroups(a, b) {
      if (a[1].priority > b[1].priority) return -1;
      if (a[1].priority < b[1].priority) return 1;

      if (a[1].answerCount > b[1].answerCount) return -1;
      if (a[1].answerCount < b[1].answerCount) return 1;
      return 0;
    }
  }

  function solveForSpace(spaceVal, index) {
    if (spaceVal > 0) return;

    let associatedGroups = getGroupsForSpace(solveGroupName, index);
    let uniqueRemainingValues = getUniqueRemainingValues(associatedGroups);
    if (uniqueRemainingValues.length === 1) {
      spaceVal = uniqueRemainingValues[0];
      associatedGroups.forEach(updatePuzzle, { val: spaceVal });
      updateGroupPriority(associatedGroups, 1);
      updateCount++;
    }
  }

  function updateGroupPriority(groupArr, priorityChange) {
    groupArr.forEach(setGroupPriority);

    function setGroupPriority(groupInfo) {
      groupName = groupInfo["group"];
      groups[groupName].priority += priorityChange;
    }
  }

  function getUniqueRemainingValues(ourGroups) {
    let allCombinedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    ourGroups.forEach(combineValues);
    return allCombinedValues;

    function combineValues(groupInfo) {
      groupName = groupInfo["group"];
      thisGroup = groups[groupName];
      for (n = 0; n <= 8; n++) {
        val = thisGroup.vals[n];
        if (val > 0) {
          let posValue = n => n === val;
          valIndex = allCombinedValues.findIndex(posValue);

          if (valIndex > -1) {
            allCombinedValues.splice(valIndex, 1);
          }
        }
      }
    }
  }

  function getGroupsForSpace(groupName, index) {
    let ourGroups = [];

    ourGroups.push({ group: groupName, ind: index });
    switch (groupName.substr(0, 1)) {
      case "g":
        thisGroupNum = parseInt(groupName.substr(1, 1));
        thisSpaceNum = index + 1;

        groupRowOffset = Math.ceil(thisGroupNum / 3) - 1;
        spaceRowInGroup = Math.ceil(thisSpaceNum / 3);
        thisRowNum = groupRowOffset * 3 + spaceRowInGroup;

        groupColOffset = (thisGroupNum % 3 === 0 ? 3 : thisGroupNum % 3) - 1;
        spaceColInGroup = thisSpaceNum % 3 === 0 ? 3 : thisSpaceNum % 3;
        thisColNum = groupColOffset * 3 + spaceColInGroup;

        ourGroups.push({
          group: "r" + thisRowNum.toString(),
          ind: thisColNum - 1
        });
        ourGroups.push({
          group: "c" + thisColNum.toString(),
          ind: thisRowNum - 1
        });
        break;
      case "c":
        thisColNum = parseInt(groupName.substr(1, 1));
        thisRowNum = index + 1;
        ourGroups.push({
          group: "r" + thisRowNum.toString(),
          ind: thisColNum - 1
        });
        ourGroups.push(getGroupNum(thisRowNum, thisColNum));
        break;
      case "r":
        thisColNum = index + 1;

        thisRowNum = parseInt(groupName.substr(1, 1));
        ourGroups.push({
          group: "c" + thisColNum.toString(),
          ind: thisRowNum - 1
        });
        ourGroups.push(getGroupNum(thisRowNum, thisColNum));
        break;
      default:
    }
    return ourGroups;
  }

  function updatePuzzle(groupInfo) {
    ourGroup = groupInfo["group"];
    ourIndex = groupInfo["ind"];
    groups[ourGroup].vals[ourIndex] = this.val;
  }

  function evaluateGroup(group) {
    group.answerCount = group.vals.slice(0).filter(num => num > 0).length;
    if (!group.priority) {
      group.priority = 0;
    }
  }

  function getGroupNum(rowNum, colNum) {
    groupRow = Math.ceil(rowNum / 3);
    groupRowOffset = Math.ceil(colNum / 3);
    groupNum = (groupRow - 1) * 3 + groupRowOffset;

    rowOffset = rowNum % 3 > 0 ? rowNum % 3 : 3;
    colOffset = colNum % 3 > 0 ? colNum % 3 : 3;
    groupIndex = (rowOffset - 1) * 3 + colOffset - 1;
    return { group: "g" + groupNum.toString(), ind: groupIndex };
  }

  function loadGroupsFromArray(puzzle) {
    puzzle.forEach(loadGroupsFromRow);

    function loadGroupsFromRow(puzRow, index) {
      //rows
      groupName = "r" + (index + 1).toString();
      groups[groupName].vals = puzRow.slice(0);
      // columns
      for (n = 0; n <= 8; n++) {
        groupName = "c" + (n + 1).toString();
        groups[groupName].vals.push(puzRow[n]);
      }
      // groups
      groupLevelEnd = Math.ceil((index + 1) / 3) * 3;
      let startIndex = 0;
      for (m = groupLevelEnd - 2; m <= groupLevelEnd; m++) {
        groupName = "g" + m.toString();
        groups[groupName].vals = groups[groupName].vals.concat(
          puzRow.slice(startIndex, startIndex + 3)
        );
        startIndex += 3;
      }
    }
  }
}
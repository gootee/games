'use strict';

let amazonCheckmate = (king, amazon) => {
  const directions = {
    N: { moveVert: 1, moveHorz: 0 },
    NE: { moveVert: 1, moveHorz: 1 },
    E: { moveVert: 0, moveHorz: 1 },
    SE: { moveVert: -1, moveHorz: 1 },
    S: { moveVert: -1, moveHorz: 0 },
    SW: { moveVert: -1, moveHorz: -1 },
    W: { moveVert: 0, moveHorz: -1 },
    NW: { moveVert: 1, moveHorz: -1 },
    NNW: { moveVert: 2, moveHorz: -1 },
    WNW: { moveVert: 1, moveHorz: -2 },
    NNE: { moveVert: 2, moveHorz: 1 },
    ENE: { moveVert: 1, moveHorz: 2 },
    SSW: { moveVert: -2, moveHorz: -1 },
    WSW: { moveVert: -1, moveHorz: -2 },
    SSE: { moveVert: -2, moveHorz: 1 },
    ESE: { moveVert: -1, moveHorz: 2 },
  };
  let solution = [0, 0, 0, 0]
  const checkMate = 0, check = 1, staleMate = 2, safe = 3;
  const dirs = Object.keys(directions)
  let whiteKingProtects = addSpaces(king, "king", dirs);
  const whiteAmazonProtected = whiteKingProtects.indexOf(amazon) > -1 ? true : false;
  let whiteAmazonProtects = addSpaces(amazon, "amazon", dirs);

  for (let row = 1; row <= 8; row++) {
    for (let col = 1; col <= 8; col++) {
      let pos = convertVal(col, "") + row.toString();
      // if (pos === "h8") {
      //   let temp = 1;
      // }
      if (whiteKingProtects.indexOf(pos) > -1 || pos === amazon) {
        //kings can't be next to each other
        continue;
      }
      let blackKingsPossibleMoves = addSpaces(pos, "king", dirs);
      let totalMoves = blackKingsPossibleMoves.length;
      let checkCount = 0, blackSafeInCurrentPos = true;

      for (let n = 0; n < totalMoves; n++) {
        const move = blackKingsPossibleMoves[n];

        if ((whiteAmazonProtects.indexOf(move) > -1) || (whiteKingProtects.indexOf(move) > -1)) {
          if (!whiteAmazonProtected && isAdjacentToAmazon(row, col, amazon)) {
            blackSafeInCurrentPos = false;
            continue;
          }
          if (move === blackKingsPossibleMoves[0]) {  //black king's current position
            blackSafeInCurrentPos = false;
          }
          checkCount++;
        }
      }

      if (blackSafeInCurrentPos) {
        switch (checkCount) {
          case totalMoves -1:
            solution[staleMate]++
            break;
          default:
            solution[safe]++
        }
      } else {
        if (totalMoves === checkCount) {
          solution[checkMate]++
        } else {
          solution[check]++
        }
      }
    }
  }

  return solution;

  function isAdjacentToAmazon(kingRow, kingCol, amazonPos) {
    const amazonRow = parseInt(amazonPos.substr(1, 1));
    const amazonCol = convertVal(0, amazonPos.substr(0, 1));
    return Math.abs(amazonCol - kingCol)<= 1 && Math.abs(amazonRow - kingRow)<= 1 ? true : false;
  }

  function addSpaces(pos, pieceType, dirs) {
    let spaceArray = [pos];
    dirs.forEach(dir => {
      const newSpaces = addDirectionSpaces(pos, pieceType, dir);
      newSpaces.forEach(z => {
        if (spaceArray.indexOf(z) === -1) {spaceArray.push(z)}
      });
    });

    return spaceArray;
  }


  function addDirectionSpaces(pos, pieceType, dirName) {
    let spaceArray = [];
    let origCol = convertVal(0, pos.substr(0, 1)),
    origRow = parseInt(pos.substr(1, 1));
    const vert = directions[dirName].moveVert, horz = directions[dirName].moveHorz;

    const getSpaceName = (horz, vert) => {
      const col = origCol + horz;
      const row = origRow + vert;
      return (col < 1 || col > 8 || row < 1 || row > 8) ? false : convertVal(col, "") + row.toString();
    }

    if (dirName.length === 3) {
      //knight moves
      if (pieceType === "amazon") {
        //no knight moves for kings
        let spaceName = getSpaceName(horz, vert); 
        if (spaceName) {
          spaceArray.push(spaceName);
        }
      }
    } else {
      //queen/king moves
      for (let y = 1; y <= 7; y++) {
        let spaceName = getSpaceName(y * horz, y * vert); 
        if (spaceName === king) {
          break;
        }
        if (spaceName) {
          spaceArray.push(spaceName);
        } else {
          break;
        }
        if (pieceType === "king") {
          //just one move in each direction
          break;
        } 
      }      
    }

    return spaceArray;
  }

  function convertVal(numVal, charVal) {
    return numVal > 0
      ? String.fromCharCode(numVal + 96)
      : charVal.charCodeAt(0) - 96;
  }
}

// debugger
console.log(amazonCheckmate("d3","e4"));  //[5, 21, 0, 29])
console.log(amazonCheckmate("a1","g5"));  //[0, 29, 1, 29])
console.log(amazonCheckmate("a3","e4"));  //[1, 32, 1, 23])
console.log(amazonCheckmate("f3","f2"));  //[6, 11, 0, 38])
console.log(amazonCheckmate("b7","a8"));  //[0, 10, 0, 45])
console.log(amazonCheckmate("f7","d3"));  //[4, 28, 1, 21])
console.log(amazonCheckmate("g2","c3"));  //[9, 21, 0, 24])
console.log(amazonCheckmate("f3","c1"));  //[4, 18, 0, 32])
console.log(amazonCheckmate("d4","h8"));  //[0, 18, 0, 36])
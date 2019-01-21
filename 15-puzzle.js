
/*
  boxes:
     1 - 4 x 4 box
     4 - 3 x 3 boxes
     9 - 2 x 2 boxes
    16 - 1 x 1 boxes

     6 - 2 x 3
     6 - 3 x 2

     3 - 2 x 4
     3 - 4 x 2

     2 - 4 x 3
     2 - 3 x 4
*/


const Sp    = " "
const Space = " "

const Direction = { None: "None",  Up: "Up", Left: "Left", Down: "Down", Right: "Right", Forward: "Forward", Backward: "Backward" }

const Techniques =  {
  "10/9": solveBottomWith9and10,
  "9/13": solveBottomWith9and13,
  "5/9/13": solveBottomWith5and9and13
}

const NewPuzzle = [  1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15, Space]
const testDummy = ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]

var moveCounter = 0
var moves = []
var tiles = []

var positions = {}

// let test2x2 = [1, 2, 3, 4]

// let test2x4 = [1, 2, 3, 4, 5, 6, 7, 8]
// let test4x2 = [1, 2, 3, 4, 5, 6, 7, 8]

// let test2x3 = [1, 2, 3, 4, 5, 6]
// let test3x2 = [1, 2, 3, 4, 5, 6]

// let test2x5 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// let test3x3 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// let test3x4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// let test4x4 = [  1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14,  15, Space]

function PuzzleModel (puzzle, rows, columns, technique) {

  this.puzzle = puzzle.slice ()
  this.model = puzzle.slice ()

  this.rows = rows
  this.columns = columns

  this.chains = []

  this.solve ()
}


PuzzleModel.prototype.toString = function () {

  let s = ""

  for ( let i=0; i<this.model.length; i++ ) {

    if ( this.model [i] == Space )
      s += 0
    else
      s += this.model [i]
  
    if ( i != this.model.length-1 )
      s+= ","
  }

  return s
}


PuzzleModel.prototype.print = function () {

  console.log ("move:", this.moveCounter, "of",  this.moves.length, "moves")

  printPuzzle (this.model)
}

  
PuzzleModel.prototype.solve = function () {

  this.puzzle = this.model.slice ()

  tiles = []
  this.moves = solver (this.model.slice ())
  this.tiles = tiles.slice ()
  this.moveCounter = 0

  return this.moves
}

  
PuzzleModel.prototype.shuffle = function (n) {

  shuffle (this.model, 1000)

  this.puzzle = this.model.slice ()

  this.moves = solver (this.model.slice ())
  this.moveCounter = 0
}


PuzzleModel.prototype.reset = function () {

  this.model = this.puzzle.slice ()

  this.moves = solver (this.model.slice ())
  this.moveCounter = 0
}

  
PuzzleModel.prototype.currentPuzzle = function () {

  return this.puzzle
}


PuzzleModel.prototype.tile = function (index) {

  return this.model [index]
}


PuzzleModel.prototype.extract = function (startIndex, rows, columns) {

}

  
PuzzleModel.prototype.numberOfMoves = function () {

  return this.moves.length
}


PuzzleModel.prototype.currentMove = function () {

  return this.moveCounter
}


PuzzleModel.prototype.currentModel = function () {

  return this.model
}


PuzzleModel.prototype.next = function () {

  if ( this.moveCounter < this.moves.length )
    return move (this.model, moves [this.moveCounter++])
}


PuzzleModel.prototype.prev = function () {

  if ( this.moveCounter == 0 )
    return

  let direction = this.moves [--this.moveCounter]

  switch ( direction ) {

    case Direction.Up:
      return this.move (Direction.Down)

    case Direction.Down:
      return this.move (Direction.Up)

    case Direction.Left:
      return this.move (Direction.Right)

    case Direction.Right:
      return this.move (Direction.Left)
  }
}


PuzzleModel.prototype.move = function (direction) {

  return move (this.model, direction)
}


PuzzleModel.prototype.moveTile = function (number) {

  this.moves = []
  this.moveCounter = 0

  let directionTileCanMove = this.canMove (number)

  switch ( directionTileCanMove ) {

    case Direction.Up:
      this.move (Direction.Down)
      return Direction.Up
 
    case Direction.Down:
      this.move (Direction.Up)
      return Direction.Down
      
    case Direction.Left:
      this.move (Direction.Right)
      return Direction.Left
      
    case Direction.Right:
      this.move (Direction.Left)
      return Direction.Right
    }

    return 0
//  this.puzzle = this.model
}


PuzzleModel.prototype.canMove = function (number) {

  let slot = find (this.model, number)
  let spaceSlot = find (this.model, Space)

  // console.log ("number:", number, "is in slot:", slot)
  // console.log ("Space is in slot:", spaceSlot)

  if ( row (slot) > 0 && this.model [slot - 4] == Space )
    return Direction.Up

  if ( row (slot) < 3 && this.model [slot + 4] == Space )
    return Direction.Down

  if ( column (slot) > 0 && this.model [slot - 1] == Space )
    return Direction.Left

  if ( column (slot) < 3 && this.model [slot + 1] == Space )
    return Direction.Right

  return Direction.None
}



// printPuzzle (test2x2)

// printPuzzle (test2x3)
// printPuzzle (test3x2, portrait = true)

// printPuzzle (test2x4)
// printPuzzle (test4x2, portrait = true)

// printPuzzle (extractPuzzle (NewPuzzle, 0, 2, 2))
// printPuzzle (extractPuzzle (NewPuzzle, 0, 2, 3))

// printPuzzle (extractPuzzle (NewPuzzle, 9, 2, 2))
// printPuzzle (extractPuzzle (NewPuzzle, 9, 2, 3))

// printPuzzle (extractPuzzle (NewPuzzle, 5, 3, 2), portrait = true)

let moveListener = null

if ( typeof window === "undefined" ) {
  moves = testOne (noisy = false)
}

// console.log (moves.length)

// testCases ((noisy = false)

// randomTests (noisy = false)


// bottomHalfUtilities ()

function randomIntegerLessThan (n) {

  n = Math.floor (n)

  return Math.floor (Math.random () * n)
}


function debugExit (puzzle) {

  console.log ("exiting....")
  printPuzzle (puzzle)
  process.exit ()
}


function extractPuzzle (puzzle, startTile, height, width) {

  const length  = rowLength (puzzle, portrait = height > width)

  const startRow = Math.floor (startTile / length)
  const startcolumn = startTile % length

  extracted = puzzle.filter (function (tile, index) {

    const row = Math.floor (index / length)
    const column = index % length

    if ( row < startRow || row >= (startRow + height) )
        return false 

    if ( column < startcolumn || column >= (startcolumn + width) )
      return false

    return true
  })

  console.log ("extracted", extracted)
  return extracted
}


function savePuzzle (puzzle, prefix) {

  if ( !process )
    return

  if ( prefix )
    process.stdout.write (prefix)
    
  process.stdout.write ("[")

  puzzle.forEach (function output (slot, index) {

    if ( slot !==   Space)
      process.stdout.write (slot + "")
    else
      process.stdout.write (slot + '" "')

      if ( index != puzzle.length-1 )
        process.stdout.write (", ")
  })

  process.stdout.write ("]\n")
}


function rowLength (puzzle, portrait) {

    switch ( puzzle.length ) {

    case 4:
      return 2

    case 6:

      if ( !portrait )
        return 3
      return 2
    
    case 9:
      return 3
      
    case 8:
      if ( !portrait )
        return 4
      return 2
    
    case 16:
      return 4

    default:
      break
  }
}


function printPuzzle (puzzle, portrait) {

  let width = rowLength (puzzle, portrait)
  let rows = puzzle.length / width

  for ( let row = 0; row < rows; row++ ) {
    
    let output = ""

    for ( let i=0; i<width; i++ ) {
      output += twoDigits (puzzle [row*width + i])
    }

    console.log (output)
  }

  console.log ()
}

function twoDigit (n) {

  if ( n === Space )
    return "__"

  if ( n < 10 )
    return " " + n

  return "" + n
}

function twoDigits (n) {

  if ( n === Space )
    return "   "

  if ( n === "X" )
    return "  X"

  if ( n < 10 )
    return "  " + n

  return " " + n
}
  
function find (puzzle, number) {

  return puzzle.indexOf (number)
}

function row (slot) {

  if ( slot < 0 )
    return -1

  return Math.floor (slot/4)
}

function column (slot) { 

  if ( slot < 0 )
    return -1

  return slot % 4
}

function targetRow (number) {

  return Math.floor ((number - 1) / 4)
}

function targetColumn (number) {

  return (number - 1) % 4
}

function move (puzzle, direction, noisy) {

  switch ( direction ) {

    case Direction.Up:
      return moveUp (puzzle, noisy)

    case Direction.Down:
      return moveDown (puzzle, noisy)

    case Direction.Left:
      return moveLeft (puzzle, noisy)

    case Direction.Right:
      return moveRight (puzzle, noisy)
  }
}


function moveUp (puzzle, noisy) {

  if ( noisy )
    console.log ("moveUp")

  moveCounter++

  let indexOfSpace = puzzle.indexOf (Space)

  if ( indexOfSpace < 4 )
    return 0

  moves.push (Direction.Up)

  const number = puzzle [indexOfSpace - 4]
  tiles.push (number)
  
  puzzle [indexOfSpace - 4] = Space
  puzzle [indexOfSpace] = number

  notifyMoveListener (number, Direction.Down)

  if ( noisy )
    printPuzzle (puzzle)

  return number
}


function moveDown (puzzle, noisy) {

  if ( noisy )
    console.log ("moveDown")

  moveCounter++

  let indexOfSpace = puzzle.indexOf (Space)

  if ( indexOfSpace > 11 )
    return 0

  moves.push (Direction.Down)

  const number = puzzle [indexOfSpace + 4]
  tiles.push (number)
  
  puzzle [indexOfSpace + 4] = Space
  puzzle [indexOfSpace] = number

  notifyMoveListener (number, Direction.Up)

  if ( noisy )
    printPuzzle (puzzle)

  return number
}


function moveLeft (puzzle, noisy) {

  if ( noisy )
    console.log ("moveLeft")

  moveCounter++

  let indexOfSpace = puzzle.indexOf (Space)

  if ( column (indexOfSpace) == 0 )
    return 0

  moves.push (Direction.Left)
  
  const number = puzzle [indexOfSpace - 1]
  tiles.push (number)
  
  puzzle [indexOfSpace - 1] = Space
  puzzle [indexOfSpace] = number

  notifyMoveListener (number, Direction.Right)

  if ( noisy )
    printPuzzle (puzzle)

  return number
}


function moveRight (puzzle, noisy) {

  moves.push (Direction.Right)

  if ( noisy )
    console.log ("moveRight")

  moveCounter++

  let indexOfSpace = puzzle.indexOf (Space)

  if ( column (indexOfSpace) == 3 )
    return 0

  const number = puzzle [indexOfSpace + 1]
  tiles.push (number)
  
  puzzle [indexOfSpace + 1] = Space
  puzzle [indexOfSpace] = number

  notifyMoveListener (number, Direction.Left)

  if ( noisy )
    printPuzzle (puzzle)

  return number
}


function shuffle (puzzle, n, noisy) {

  for ( let i=0; i<n; i++ ) {

    let direction = randomIntegerLessThan (4)

    switch ( direction ) {

      case 0:
        if ( noisy )
          console.log ("up")
   
        moveUp (puzzle)
        break;
      
      case 1:
        if ( noisy )
          console.log ("down")
  
        moveDown (puzzle)
        break;
      
      case 2:
        if ( noisy )
          console.log ("left")

        moveLeft (puzzle)
        break;
      
      case 3:
        if ( noisy )
          console.log ("right")
  
        moveRight (puzzle)
        break;
    }
  }
}


function moveSpaceToColumn (puzzle, c, noisy) {

  if ( noisy )
    console.log ("moveSpaceToColumn", c)

  let spaceSlot = find (puzzle, Space)

  while ( column (spaceSlot) < c ) {
    moveRight (puzzle, noisy)
    spaceSlot = find (puzzle, Space)
  }

  while ( column (spaceSlot) > c ) {
    moveLeft (puzzle, noisy)
    spaceSlot = find (puzzle, Space)
  }

  if ( noisy )
    printPuzzle (puzzle)
}

function moveSpaceToRow (puzzle, r, noisy) {

  if ( noisy )
    console.log ("moveSpaceToRow", r)
  
  let slotOfSpace = find (puzzle, Space)

  while ( row (slotOfSpace) < r ) {
    moveDown (puzzle, noisy)
    slotOfSpace = find (puzzle, Space)
  }

  while ( row (slotOfSpace) > r ) {
    moveUp (puzzle, noisy)
    slotOfSpace = find (puzzle, Space)
  }

  if ( noisy )
    printPuzzle (puzzle)
}

function moveNumber (puzzle, number, direction, noisy) {
  
  if ( noisy )
    console.log ("move number", number, direction, "\n")

  if ( direction == Direction.Up ) {

    if ( row (find (puzzle, number)) == 0 )
      return

    if ( row (find (puzzle, Space)) < row (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)) - 1, noisy)
      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)
      moveDown (puzzle, noisy)
    }
    else if ( row (find (puzzle, Space)) == row (find (puzzle, number)) ) {
      
      if ( column (find (puzzle, Space)) > column (find (puzzle, number)) ) {
        moveSpaceToColumn (puzzle, column (find (puzzle, number)) + 1, noisy)
        moveUp (puzzle, noisy)
        moveLeft (puzzle, noisy)
        moveDown (puzzle, noisy)
      }
      else {
        moveSpaceToColumn (puzzle, column (find (puzzle, number)) - 1, noisy)
        
        if ( number == 10 ) {
          moveUp (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveUp (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveUp (puzzle, noisy)
          moveRight (puzzle, noisy)
        }
        else {

          if ( column (find (puzzle, number)) < 3 ) {

            if ( row (find (puzzle, number)) < 3 ) {
              moveDown (puzzle, noisy)
              moveRight (puzzle, noisy)
              moveRight (puzzle, noisy)
              moveUp (puzzle, noisy)
              moveUp (puzzle, noisy)
              moveLeft (puzzle, noisy)
              moveDown (puzzle, noisy)
            }
            else {
              moveUp (puzzle, noisy)
              moveRight (puzzle, noisy)
              moveDown (puzzle, noisy)
            }
          }
          else {
            // moveUp (puzzle, noisy)
            // moveRight (puzzle, noisy)
            // moveDown (puzzle, noisy)
              
            moveLeft (puzzle, noisy)
            moveUp (puzzle, noisy)
            moveRight (puzzle, noisy)
            moveRight (puzzle, noisy)
            moveDown (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveUp (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveDown (puzzle, noisy)
          }
        }
      }
    }
    else if ( row (find (puzzle, Space)) > row (find (puzzle, number)) ) {

      const lastColumn = column (find (puzzle, number)) == 3

      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)
      moveSpaceToRow (puzzle, row (find (puzzle, number)) + 1, noisy)

      if ( lastColumn && ((row (find (puzzle, number)) == 2 && targetRow (number) == 1) ||
                          (row (find (puzzle, number)) == 1 && targetRow (number) == 0)) ) {

      // if ( number == 4 ) {
      //   noisy = true
      //   printPuzzle (puzzle)
      //   debugger
      // }
      
        moveLeft (puzzle, noisy)
        moveLeft (puzzle, noisy)

        moveUp (puzzle, noisy)
        moveUp (puzzle, noisy)

        moveRight (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveDown (puzzle, noisy)

        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)

        moveLeft (puzzle, noisy)
        moveDown (puzzle, noisy)
      }
      else {

        if ( !lastColumn )
          moveRight (puzzle, noisy)
        else
          moveLeft (puzzle, noisy)
    
        moveUp (puzzle, noisy)
        moveUp (puzzle, noisy)

        if ( !lastColumn )
          moveLeft (puzzle, noisy)
        else
          moveRight (puzzle, noisy)

        moveDown (puzzle, noisy)
      }
    }
  }

  if ( direction == Direction.Left ) {

    if ( column (find (puzzle, number)) == 0 )
      return

    if ( column (find (puzzle, Space)) < column (find (puzzle, number)) ) {
      moveSpaceToColumn (puzzle, column (find (puzzle, number)) - 1, noisy)
      moveSpaceToRow (puzzle, row (find (puzzle, number)), noisy)
      moveRight (puzzle, noisy)
    }
    else if ( column (find (puzzle, Space)) == column (find (puzzle, number)) ) {

      if ( row (find (puzzle, Space)) < row (find (puzzle, number))) {
        moveSpaceToRow (puzzle, row (find (puzzle, number)) - 1, noisy)

        if ( column (find (puzzle, number)) != 3 ) {

          if ( row (find (puzzle, number)) != 3 ) {
            moveRight (puzzle, noisy)
            moveDown (puzzle, noisy)
            moveDown (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveUp (puzzle, noisy)
            moveRight (puzzle, noisy)
          }
          else {
            moveRight (puzzle, noisy)
            moveDown (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveUp (puzzle, noisy)            
            moveRight (puzzle, noisy)
            moveDown (puzzle, noisy)
            moveRight (puzzle, noisy)
            moveUp (puzzle, noisy)            
            moveLeft (puzzle, noisy)
            moveLeft (puzzle, noisy)
            moveDown (puzzle, noisy)
          }
        }
        else {
          moveLeft (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)          
        }
      }
      else {
        moveSpaceToRow (puzzle, row (find (puzzle, number)) + 1, noisy)
        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)
        moveRight (puzzle, noisy)
      }
    }
    else if ( column (find (puzzle, Space)) > column (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)), noisy)
      moveSpaceToColumn (puzzle, column (find (puzzle, number)) + 1, noisy)

      if ( row (find (puzzle, number)) < 3 ) {
        moveDown (puzzle, noisy)
        moveLeft (puzzle, noisy)
        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)
        moveRight (puzzle, noisy)
      }
      else {

        if ( column (find (puzzle, number)) == 1 ||  column (find (puzzle, number)) == 2 ) {
          moveLeft (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveUp (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveUp (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
        }
        else {
          moveUp (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveLeft (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
          moveDown (puzzle, noisy)
          moveRight (puzzle, noisy)
        }
      }
    }
  }

  if ( direction == Direction.Right ) {

    if ( column (find (puzzle, number)) == 3 )
      return
      
    if ( column (find (puzzle, Space)) > column (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)), noisy)
      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)
    }
    else if ( column (find (puzzle, Space)) == column (find (puzzle, number)) ) {

      const lastRow = row (find (puzzle, number)) === 3

      if ( !lastRow ) {
        moveSpaceToRow (puzzle, row (find (puzzle, number)) + 1, noisy)
        moveRight (puzzle, noisy)
        moveUp (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }
      else {
        moveSpaceToRow (puzzle, row (find (puzzle, number)) - 1, noisy)
        moveRight (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }
    }
    else if ( column (find (puzzle, Space)) < column (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)), noisy)

      if ( row (find (puzzle, number)) < 3 ) {
        moveDown (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveUp (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }
      else {
        moveUp (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }
    }
  }

  if ( direction == Direction.Down ) {

    if ( row (find (puzzle, number)) == 3 )
      return
    
    if ( row (find (puzzle, Space)) < row (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)) - 1, noisy)
      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)

      if ( column (find (puzzle, Space)) != 3 ) {
        moveRight (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)
      }
      else {
        moveLeft (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveDown (puzzle, noisy)
        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)
      }
    }
    else if ( row (find (puzzle, Space)) == row (find (puzzle, number)) ) {
      moveSpaceToRow (puzzle, row (find (puzzle, number)) + 1, noisy)
      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)
      moveUp (puzzle, noisy)
    }
    else if ( row (find (puzzle, Space)) > row (find (puzzle, number)) ) {
      moveSpaceToColumn (puzzle, column (find (puzzle, number)), noisy)
      moveUp (puzzle, noisy)
    }
  }
}

function rotateInBox (puzzle, box, noisy) {

  let spaceSlot = find (puzzle, Space)

  // console.log ("space slot", spaceSlot)

  let spaceIndex = box.indexOf (spaceSlot)
  // console.log ("space index", spaceIndex)

  let nextIndex = (spaceIndex + 1) % box.length
  // console.log ("next index", nextIndex)

  let nextSlot = box [nextIndex]
  // console.log ("next slot", nextSlot)

  if ( nextSlot == spaceSlot + 1 ) {
    moveRight (puzzle, noisy)
  }
  else if ( nextSlot == spaceSlot + 4 ) {
    moveDown (puzzle, noisy)
  }
  else if ( nextSlot == spaceSlot - 1 ) {
    moveLeft (puzzle, noisy)      
  }
  else {
    moveUp (puzzle, noisy)         
  }
}

function rotateBottomCenter (puzzle, direction, noisy) {

  const spaceSlot = find (puzzle, Space)

  if ( direction == Direction.Right ) {

    switch ( spaceSlot ) {

      case 9:
        moveDown (puzzle, noisy)
        break
      
      case 13:
        moveRight (puzzle, noisy)
        break

      case 14:
        moveUp (puzzle, noisy)
        break  

      case 10:
        moveLeft (puzzle, noisy)
        break
    }
  }
  else if ( direction == Direction.Left ) {

    switch ( spaceSlot ) {

      case 9:
        moveRight (puzzle, noisy)
        break
      
      case 10:
        moveDown (puzzle, noisy)
        break
    
      case 14:
        moveLeft (puzzle, noisy)
        break  
  
      case 13:
        moveUp (puzzle, noisy)
        break

    }
  }
}


function solver (puzzle, count, noisy) {

  if ( noisy )
    console.log ("solving bottom half")

  moves = solveBottomWith9and13 (puzzle, noisy)

//  solveBottomWith5and9and13 (puzzle, noisy)
//  solveBottomWith9and10 (puzzle, count, noisy)

  if ( noisy )
    console.log ("solver:", moves.length)

  return moves.slice ()
}


function solveBottomWith9and10 (puzzle, count, noisy) {
  
  if ( noisy) {
    console.log ("solveBottomWith9and10")
    printPuzzle (puzzle)
  }

  moveCounter = 0
  moves = []
  numbers = []

  var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  numbers.forEach (function (number) {
    solveNumber (puzzle, number, noisy)
  })

  moveNumber (puzzle, 9, Direction.Down, noisy)
  moveNumber (puzzle, 10, Direction.Left, noisy)

  while ( column (find (puzzle, 12)) < targetColumn (12) )
    moveNumber (puzzle, 12, Direction.Right, noisy)  
  
  while ( row (find (puzzle, 12)) > targetRow (12) )
    moveNumber (puzzle, 12, Direction.Up, noisy)

  moveSpaceToColumn (puzzle, 2, noisy)

  if ( count == 10 ) {
    moveSpaceToRow (puzzle, 3, noisy)
    return moves
  }
  
  switch ( puzzle [15] ) {

    case 11:
  //      console.log ("rotate bottom center until puzzle [10] == 13 || 14")

      while ( puzzle [10] != 13 && puzzle [10] != 14 )
        rotateBottomCenter (puzzle, Direction.Right, noisy)

      moveSpaceToRow (puzzle, 3, noisy)
      moveSpaceToColumn (puzzle, 2, noisy)

      moveRight (puzzle, noisy)
      moveUp (puzzle, noisy)
      moveLeft (puzzle, noisy)

      while ( puzzle [14] != 15 )
        rotateBottomCenter (puzzle, Direction.Right, noisy)
      
      moveSpaceToRow (puzzle, 2, noisy)
      moveSpaceToColumn (puzzle, 2, noisy)

      moveRight (puzzle, noisy)
      moveDown (puzzle, noisy)
      moveLeft (puzzle, noisy)

      while ( 11 != puzzle [10] )
        rotateBottomCenter (puzzle, Direction.Right, noisy)

      if ( puzzle [14] == Space ) {
        moveLeft (puzzle, noisy)
        moveUp (puzzle, noisy)
      }

      moveLeft (puzzle, noisy)
      moveDown (puzzle, noisy)

      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      break

    case 13:
    case 14:
  //      console.log ("rotate bottom center until puzzle [10] == 11")

      while ( puzzle [10] != 11 )
        rotateBottomCenter (puzzle, Direction.Right, noisy)

      moveSpaceToRow (puzzle, 3, noisy)
      moveSpaceToColumn (puzzle, 2, noisy)

      moveRight (puzzle, noisy)
      moveUp (puzzle, noisy)
      moveLeft (puzzle, noisy)

      while ( puzzle [14] != 15 )
        rotateBottomCenter (puzzle, Direction.Right, noisy)
      
      moveSpaceToRow (puzzle, 2, noisy)
      moveSpaceToColumn (puzzle, 2, noisy)

      moveRight (puzzle, noisy)
      moveDown (puzzle, noisy)
      moveLeft (puzzle, noisy)
      moveLeft (puzzle, noisy)

      moveUp (puzzle, noisy)
      moveLeft (puzzle, noisy)
      moveDown (puzzle, noisy)

      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      break

    case 15:
      // console.log ("solve by hand")

      while ( 11 != puzzle [9] )
        rotateBottomCenter (puzzle, Direction.Right, noisy)

      moveSpaceToColumn (puzzle, 2, noisy)
      moveSpaceToRow (puzzle, 2, noisy)

      moveLeft (puzzle, noisy)
      moveLeft (puzzle, noisy)
      moveDown (puzzle, noisy)

      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      moveRight (puzzle, noisy)
      break
  }

  return moves
}


function solveBottomWith9and13 (puzzle, noisy) {

  if ( noisy) {
    console.log ("solveBottomWith9and13")
    printPuzzle (puzzle)
  }

  moves = []
  moveCounter = 0
  tiles = []

  var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]

  numbers.forEach (function (number) {
    solveNumber (puzzle, number, noisy)
  })

  solveNumber (puzzle, 10, noisy)
  solveNumber (puzzle, 14, noisy)
//    debugExit (puzzle)

  if ( puzzle [13] == 14 ) {

    var box = [10, 11, 15, 14]
    // var box = [10, 14, 15, 11]
    
    while ( puzzle [14] != 15 || puzzle [15] != Space ) {
      rotateInBox (puzzle, box, noisy)
    }
  }
  else if ( puzzle [13] != 14 ) {

    if ( puzzle [13] == Space ) {

      if ( puzzle [14] == 14 )
        moveRight (puzzle, noisy)
      
      else {
        moveUp (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }
    }
    
    moveSpaceToColumn (puzzle, 2, noisy)
    moveSpaceToRow (puzzle, 2, noisy)

    if ( puzzle [13] != 14 ) {

      var box = [10, 11, 15, 14]
      var box = [10, 14, 15, 11]
      
      if ( puzzle [14] == 14 ) {
        moveDown (puzzle, noisy)
        moveRight (puzzle, noisy)
        moveUp (puzzle, noisy)
        moveLeft (puzzle, noisy)
      }

      moveDown (puzzle, noisy)
      moveLeft (puzzle, noisy)
      moveUp (puzzle, noisy)

      moveRight (puzzle, noisy)

      while ( puzzle [14] != 14 ) {
        rotateInBox (puzzle, box, noisy)
      }

      moveSpaceToRow (puzzle, 2, noisy)

      moveSpaceToColumn (puzzle, 2, noisy)

      moveLeft (puzzle, noisy, noisy)
      moveDown (puzzle, noisy, noisy)
      moveRight (puzzle, noisy, noisy)

      while ( puzzle [10] != 11 ) {
        rotateInBox (puzzle, box, noisy)
      }
    }

    solveNumber (puzzle, 11, noisy)
    solveNumber (puzzle, 12, noisy)
    solveNumber (puzzle, 15, noisy)
  }

  return moves
}

function solveBottomWith5and9and13 (puzzle, noisy) {

  if ( noisy) {
    console.log ("solveBottomWith5and9and13")
    printPuzzle (puzzle)
  }

  var numbers = [1, 2, 3, 4, 5, 9, 13, 6, 7, 8]

  numbers.forEach (function (number) {
    solveNumber (puzzle, number, noisy)
  })

  solveNumber (puzzle, 10, noisy)

  if ( puzzle [13] == Space ) {

    if ( puzzle [14] == 14 )
      moveRight (puzzle, noisy)
    
    else {
      moveUp (puzzle, noisy)
      moveLeft (puzzle, noisy)
    }
  }

  printPuzzle (puzzle)

  // moveSpaceToColumn (puzzle, 2, noisy)
  // moveSpaceToRow (puzzle, 2, noisy)

  if ( puzzle [13] != 14 ) {

    var box = [10, 11, 15, 14]
    var box = [10, 14, 15, 11]
    
    if ( puzzle [14] == 14 ) {
      moveDown (puzzle, noisy)
      moveRight (puzzle, noisy)
      moveUp (puzzle, noisy)
      moveLeft (puzzle, noisy)
    }

    moveDown (puzzle, noisy)
    moveLeft (puzzle, noisy)
    moveUp (puzzle, noisy)

    moveRight (puzzle, noisy)

    while ( puzzle [14] != 14 ) {
      rotateInBox (puzzle, box, Direction.Right)
    }

    moveSpaceToRow (puzzle, 2, noisy)
    moveSpaceToColumn (puzzle, 2, noisy)

    moveLeft (puzzle, noisy, noisy)
    moveDown (puzzle, noisy, noisy)
    moveRight (puzzle, noisy, noisy)

    while ( puzzle [10] != 11 ) {
      rotateInBox (puzzle, box)
    }
  }

  solveNumber (puzzle, 11, noisy)
  solveNumber (puzzle, 12, noisy)
  solveNumber (puzzle, 15, noisy)

  return moves
}

function solveNumber (puzzle, number, noisy) {

  if ( noisy && number == 14 ) {
    console.log (number)
    printPuzzle (puzzle, noisy)
  }
  
  let verticalDirection = Direction.None

  if ( targetRow (number) > row (find (puzzle, number)) )
    verticalDirection = Direction.Down

  else if ( targetRow (number) < row (find (puzzle, number)) )
    verticalDirection = Direction.Up

  let horizontalDirection = Direction.None

  if ( targetColumn (number) > column (find (puzzle, number)) )
    horizontalDirection = Direction.Right

  else if ( targetColumn (number) < column (find (puzzle, number)) )
    horizontalDirection = Direction.Left

  if ( verticalDirection == Direction.None && horizontalDirection ==  Direction.None)
    return

  if ( verticalDirection == Direction.Up ) {

    if ( horizontalDirection == Direction.Right ) {

      while ( column (find (puzzle, number)) < targetColumn (number) )
        moveNumber (puzzle, number, Direction.Right, noisy)

      while ( row (find (puzzle, number)) > targetRow (number) )
        moveNumber (puzzle, number, Direction.Up, noisy)
    }
    else if ( horizontalDirection == Direction.Left ) {

      while ( row (find (puzzle, number)) > targetRow (number) )
        moveNumber (puzzle, number, Direction.Up, noisy)

      while ( column (find (puzzle, number)) > targetColumn (number) )
        moveNumber (puzzle, number, Direction.Left, noisy)
    }
    else {

      while ( row (find (puzzle, number)) > targetRow (number) )
        moveNumber (puzzle, number, Direction.Up, noisy)        
    }
  }
  else if ( verticalDirection == Direction.Down ) {

    while ( row (find (puzzle, number)) < targetRow (number) )
      moveNumber (puzzle, number, Direction.Down, noisy)

    while ( column (find (puzzle, number)) > targetColumn (number) )
      moveNumber (puzzle, number, Direction.Left, noisy)

    while ( column (find (puzzle, number)) < targetColumn (number) )
      moveNumber (puzzle, number, Direction.Right, noisy)
  }
  else if ( horizontalDirection == Direction.Left ) {

    while ( column (find (puzzle, number)) > targetColumn (number) )
      moveNumber (puzzle, number, Direction.Left, noisy)
  }
  else if ( horizontalDirection == Direction.Right ) {

    while ( column (find (puzzle, number)) < targetColumn (number) )
      moveNumber (puzzle, number, Direction.Right, noisy)
  }
}


function testOne (testCase, noisy) {

  var testCase = [11, 13, 10, 4, 7, 6, 12, 5, 1,  " ", 15, 9, 3, 2, 14, 8]
  var testCase = [11, 3, 15, 13, 1, 12, 14, 4, 5, 6, 2, 10, 7, 8,  " ", 9]
  var testCase = [9, 7, 5, 8, 1, 14, 11,  " ", 15, 10, 4, 12, 13, 3, 2, 6]
  var testCase = [14, 5, 12, 4, 7, 11, 10, 8, 9, 15, 13, 1, 6, 2,  " ", 3]
  var testCase = [6, 15, 11, 1, 12, 5, 2, 3, 8, 10, 14,  " ", 4, 7, 9, 13]
  var testCase = [2, 6, 8, 4, 10, 15, 9, 11, 14, 7, 5, 3, 12,  " ", 13, 1]
  var testCase = [1, 4, 7, 6, 13, 8, 2, 10, 15, 11, 5, 12,  " ", 14, 9, 3]
  var testCase = [12, 9, 14, 4, 10, 2, 13, 11, 6, 15, 3, 8, 1,  " ", 5, 7]
  var testCase = [10, 13, 8, 11, 9, 7, 5, 1, 4, 12, 3, 6, 14, 2, 15,  " "]
  var testCase = [1, 14, 13, 5, 4, 12, 2,  " ", 15, 9, 7, 10, 8, 11, 3, 6]
  var testCase = [12, 2, 4, 6, 9, 10, 5, 15, 1, 7,  " ", 13, 14, 11, 3, 8]
  var testCase = [15, 12, 11, 1, 14,  " ", 4, 9, 10, 7, 13, 8, 5, 3, 6, 2]
  var testCase = [11, 13, 2, 8, 7, 12, 1, 5, 9,  " ", 4, 15, 3, 14, 10, 6]

  return solver (testCase, 16, noisy)
}


function testCases () {

  var testCases = [
    [4, 7, 12, 9, 2, 11, 1, 15, 13, 5,  " ", 3, 10, 8, 14, 6],
    [ " ", 4, 12, 9, 1, 5, 2, 11, 7, 3, 15, 6, 10, 8, 13, 14],
    [1, 12, 6, 7, 2, 5, 8, 14,  " ", 4, 13, 9, 11, 15, 10, 3],
    [13, 5, 12, 11, 4, 10, 8, 1, 3, 15, 6,  " ", 2, 7, 9, 14],
    [15, 2, 12, 9, 1, 10, 7, 13, 14, 3, 6,  " ", 11, 8, 4, 5],
    [2, 13,  " ", 6, 7, 3, 12, 8, 10, 9, 5, 15, 11, 14, 4, 1],
    [1, 8, 13,  " ", 5, 6, 9, 15, 14, 4, 3, 2, 12, 10, 11, 7],
    [4,  " ", 8, 5, 1, 2, 14, 12, 3, 7, 13, 6, 9, 10, 11, 15],
    [8, 2, 13, 6, 10, 14, 9, 3, 1, 7, 4, 5,  " ", 11, 12, 15],
    [14, 6, 11, 1, 10, 5, 4, 12, 2, 13, 9, 15, 3, 7,  " ", 8],
    [ " ", 10, 5, 12, 14, 4, 13, 3, 11, 2, 15, 1, 6, 7, 8, 9],
    [7, 3, 4, 14, 1,  " ", 2, 12, 8, 10, 6, 15, 13, 5, 11, 9],
    [11, 6, 15, 1, 8, 10, 13, 2, 5,  " ", 12, 7, 3, 14, 4, 9],
    [9, 6, 1, 12, 10, 11, 5,  " ", 4, 7, 8, 15, 2, 13, 14, 3],
    [12, 4, 11, 2, 9, 8, 6, 5, 15, 10, 13, 7,  " ", 3, 14, 1],
    [7, 13, 9, 3, 15, 10, 2, 1, 8,  " ", 14, 12, 6, 4, 5, 11],
    [13, 8, 2, 7, 1, 15, 12, 11, 4, 5, 14, 3, 9,  " ", 6, 10],
    [15, 10, 4, 7, 6, 12, 8, 3, 14, 9, 5, 2, 13, 1,  " ", 11],
    [2, 11, 4,  " ", 6, 7, 5, 12, 9, 13, 1, 8, 15, 10, 3, 14],
    [14, 8, 1, 9, 3, 5, 6,  " ", 11, 12, 13, 7, 4, 10, 15, 2]
  ]

  testCases.forEach (function (testCase, index) {

    console.log ("\n\nTest Case:", index+1)
    console.log ("==============================================================")

    // savePuzzle (testCase)
    solver (testCase, 16, noisy = false)
    printPuzzle (testCase)

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    numbers.forEach (function (number) {

      if ( testCase [number-1] != number ) {
        process.exit (-1)
      }
    })
  })

  console.log ("complete...")  
}


function randomTests (noisy) {

  const numberOfTests = 100000

  let min = 10000
  let max = 0
  let longest = []

  for ( let i=0; i<numberOfTests; i++ ) {

    if ( noisy ) {
      console.log ("\nTest:", i + 1)
      console.log ("========================================================================")
    }

    let testCase = NewPuzzle.slice ()

    shuffle (testCase, 1000)
    // savePuzzle (testCase)

    let currentTest = testCase.slice ()

    const numberOfMoves = solver (testCase, 16, false).length

    if ( numberOfMoves > max ) {
      max = numberOfMoves
      longest = currentTest.slice ()
    }

    if ( numberOfMoves < min )
      min = numberOfMoves

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    numbers.forEach (function (number) {

      if ( number != testCase [number - 1] ) {
        console.log ("test failed....")
        printPuzzle (testCase)
        process.exit (-1)
      }
    })
  }

  console.log ("completed:", numberOfTests, "min:", min, "max:", max)
  console.log ("longest:")
  savePuzzle (longest)
}


function bottomHalfUtilities () {

  let   bottomHalfs = []

  for ( let i=0; i<100; i++ ) {
    console.log ("\nTest:", i + 1)
    console.log ("========================================================================")

    let testCase = NewPuzzle.slice ()

    shuffle (testCase, 1000)
    // savePuzzle (testCase)

    solver (testCase, 10, noisy = false)

    bottomHalfs.push (testCase.filter (function bottomEight (number, index) {

      return index >= 8
    }))

    const firstEightNumbers = [1, 2, 3, 4, 5, 6, 7, 8]

    firstEightNumbers.forEach (function (number) {

      if ( number != testCase [number - 1])
        process.exit (-1)
    })
  }

  console.log (bottomHalfs.length)

  bottomHalfs.forEach (function (lastEight) { printPuzzle (lastEight) })

  bottomHalfs = bottomHalfs.map (function (lastEight) {

    let favoriteFive = lastEight.filter (function (number, index) {
      return index == 1 || index == 2 || index == 5 || index == 6 || index == 7
    })

    favoriteFive = favoriteFive.map (function (number) {
      
      if ( number === Space )
        return 0

      return number
    })

    // console.log (favoriteFive)

    return favoriteFive [0] + 16*favoriteFive [1] + 256*favoriteFive [2] + 4096*favoriteFive [3] + 65536*favoriteFive [4]
  })

  // bottomHalfs.forEach (function (bottomEight) {

  //   console.log (bottomEight)
  // })

  let uniques = Array.from (new Set (bottomHalfs))

  // console.log ("uniques", uniques.length, uniques)
}

/*
  notes

  11 top    -> solve by hand by placing 15 on the bottom
  11 bottom -> 13 top || 14 top => 15 bottom

  13 top    -> 15 bottom
  13 bottom -> 11 top

  14 top    -> 15 bottom
  14 bottom -> 11 top

  15 top    -> 13 bottom || 14 bottom => 11 top
  15 bottom -> solve by hand
  
   9    10    12    15
  --    --    --    --
  13     9    15    14
  

  10    12    14
  --    --    --    --
   9    11    13    15
  */


function setMoveListener (listener) {

  moveListener = listener
}

function notifyMoveListener (number, direction) {

  if ( moveListener )
    moveListener (number, direction)
}

if ( typeof window === "undefined" )
  module.exports = PuzzleModel
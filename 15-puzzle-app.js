document.addEventListener ("DOMContentLoaded", function (event) { 

  let gamePuzzle = document.getElementById ("puzzle")
  let puzzleModel = new PuzzleModel (NewPuzzle.slice (), 4, 4)

  const SolutionMode = { None: 0, Player: 1, Computer: 2}

  let game = {
    gamePuzzle: gamePuzzle,
    gamesgamesTiles: gamePuzzle.querySelectorAll (".tile"),

    puzzleModel: puzzleModel,
    puzzleNodes: {},

    playerSolutionMoves: [],
    playerSolution: [],
    playerSolutionIndex: 0,

    playbackInterval: null,
    playbackSpeed: 300,

    fastForwardInterval: null,
    fastForwardSpeed: 50,

    shuffleCount: 100,
    shuffleSpeed: 65,

    mode: SolutionMode.None
  }

  let solved = isPuzzleSolved ()

  // if ( solved )
  //   document.getElementById ("title").textContent = "15-Puzzle Solved"
  // else
  //   document.getElementById ("title").textContent = "15-Puzzle"

  game.playerSolution = []
  game.playerSolutionIndex = 0

  updateUndoRedo ()
  
  // document.getElementById ("undo").disabled = true    
  // document.getElementById ("redo").disabled = true

  let oneTile = game.gamePuzzle.querySelector ("#_1")

//  console.log (oneTile)

  // game.tiles.forEach (function (tile, index) {

  //   tile.style.left = (index % 4) * (75 + 3) + "px"
  //   tile.style.top = (Math.floor (index / 4)) * (75 + 3) + "px"
  
  //   tile.textContent = game.puzzleModel.tile (index)
  // })

  updateTiles ()

  document.getElementById ("puzzle").onclick = tileClick 
  
  function tileClick (event) {

    console.log ("puzzle clicked")

    if ( game.playbackInterval )
      return

    let element = event.target

    if ( !element.classList.contains ("tile") )
      return

    game.mode = SolutionMode.Player

    let top = parseInt (element.style.top)
    let left = parseInt (element.style.left)

    let number = parseInt (element.textContent)

    let numberMoved = game.puzzleModel.moveTile (number)

    if ( game.playerSolutionIndex > 0 )
      game.playerSolution.splice (game.playerSolutionIndex)
  
    game.playerSolution.push (number)
    game.playerSolutionIndex++

    updateTiles ()
    updateUndoRedo ()
    
    // game.gamesTiles.forEach (function (tile, index) {
    //   tile.textContent = game.puzzleModel.tile (index)
    // })

    if ( number == 12 || number == 15 ) {

     let solved = isPuzzleSolved ()

      if ( solved ) {
        document.getElementById ("title").textContent = "15-Puzzle Solved"
      }
      else
        document.getElementById ("title").textContent = "15-Puzzle"
    }
  }


  function updateUndoRedo () {

    document.getElementById ("undo").disabled = game.playerSolutionIndex == 0
    document.getElementById ("redo").disabled = game.playerSolutionIndex == game.playerSolution.length
  }


  document.getElementById ("undo").onclick = undoClick
  
  function undoClick (event) {

    console.log ("undo clicked")

    // if ( game.playerSolutionIndex == 0 ) {
    //   document.getElementById ("undo").disabled = true
    //   return
    // }

    game.puzzleModel.moveTile (game.playerSolution [--game.playerSolutionIndex])
    updateUndoRedo ()

    // game.gamesTiles.forEach (function (tile, index) {
    //   tile.textContent = game.puzzleModel.tile (index)
    // })

    updateTiles ()

    // if ( game.playerSolution.length == 0 )
    //   document.getElementById ("undo").disabled = true
  }
  

  document.getElementById ("redo").onclick = redoClick
  
  function redoClick (event) {

    console.log ("redo clicked")

    // if ( game.playerSolutionIndex == game.playerSolution.length  )
    //   return

    game.puzzleModel.moveTile (game.playerSolution [game.playerSolutionIndex++])
    updateUndoRedo ()
    
    // game.gamesTiles.forEach (function (tile, index) {
    //   tile.textContent = game.puzzleModel.tile (index)
    // })

    updateTiles ()

    // if ( game.playerSolution.length == 0 )
    //   document.getElementById ("undo").disabled = true
  }
  

  document.getElementById ("solvePauseResume").onclick = solvePauseResume

  function solvePauseResume (event) {
    
    console.log ("playPause clicked")

    if ( game.shuffleInterval ) {
      clearInterval (game.shuffleInterval)
      game.shuffleInterval = null
      document.getElementById ("shuffle").textContent = "Shuffle"
    }

    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null

      event.target.textContent = "Resume"
      return
    }

    if ( !game.puzzleModel.model )
      return

    game.mode = SolutionMode.Computer
    game.moves = game.puzzleModel.solve ()

    if ( game.puzzleModel.numberOfMoves () == 0 )
      return

    event.target.textContent = "Pause"

    updateTiles ()
    
    game.playbackInterval = setInterval (function () {

      game.puzzleModel.next ()

      updateTiles ()
      
      if ( game.puzzleModel.currentMove () == game.puzzleModel.numberOfMoves () ) {
        clearInterval (game.playbackInterval)
        game.playbackInterval = null
        document.getElementById ("solvePauseResume").textContent = "Solve"
      }
    }, game.playbackSpeed)
  }
  

  document.getElementById ("next").onclick = function (event) {

    console.log ("next clicked")

    game.mode = SolutionMode.Computer
    game.playerSolution = []
    game.playerSolutionIndex = 0

    document.getElementById ("undo").disabled = true    

    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null
    }

    if ( document.getElementById ("solvePauseResume").textContent == "Pause" )
      document.getElementById ("solvePauseResume").textContent = "Resume"

    if ( game.puzzleModel.numberOfMoves () == 0 )
      game.puzzleModel.solve ()

    if ( game.puzzleModel.currentMove () == game.puzzleModel.numberOfMoves () ) {
      game.puzzleModel.model = game.puzzleModel.puzzle.slice ()
      game.puzzleModel.moveCounter = 0
      
      // game.gamesTiles.forEach (function (tile, index) {
      //   tile.textContent = game.puzzleModel.tile (index)
      // })

      updateTiles ()
    }
    else if ( game.puzzleModel.currentMove () < game.puzzleModel.numberOfMoves () ) {
      game.puzzleModel.next ()

      // game.gamesTiles.forEach (function (tile, index) {
      //   tile.textContent = game.puzzleModel.tile (index)
      // })
  
      updateTiles ()
    }
  }


  document.getElementById ("prev").onclick = function (event) {

    console.log ("clicked prev")

    game.mode = SolutionMode.Computer
    game.playerSolution = []
    game.playerSolutionIndex = 0
    
    document.getElementById ("undo").disabled = true    
    
    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null
    }

    if ( document.getElementById ("solvePauseResume").textContent == "Pause" )
      document.getElementById ("solvePauseResume").textContent = "Resume"

    if ( game.puzzleModel.currentMove () > 0 ) {
      game.puzzleModel.prev ()

      // game.gamesTiles.forEach (function (tile, index) {
      //   tile.textContent = game.puzzleModel.tile (index)
      // })
    
      updateTiles ()

      return
    }

    if ( game.puzzleModel.numberOfMoves () == 0 )
      return

    // if ( game.playbackIndex == 0 ) {
    //   game.playbackIndex = game.moves.length
    //   game.model = NewPuzzle.slice ()

    //  game.gamesTiles.forEach (function (tile, index) {
    //     tile.textContent = game.puzzleModel.tile (index)
    //   })
    
    //   return
    // }

    // game.puzzleModel.model = game.puzzleModel.puzzle.slice ()
    // game.puzzleModelfti ()
    // game.puzzleModel.solve ()

    game.puzzleModel.model = NewPuzzle.slice ()
    game.puzzleModel.moveCounter = game.puzzleModel.moves.length

    // game.puzzleModel.prev ()
  
    // game.gamesTiles.forEach (function (tile, index) {
    //     tile.textContent = game.puzzleModel.tile (index)
    // })

    updateTiles ()
  }


  document.getElementById ("restart").onclick = function (event) {

    console.log ("restart clicked")

    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null
    }

    document.getElementById ("solvePauseResume").textContent = "Solve"

    game.puzzleModel.reset ()

    // printPuzzle (game.puzzleModel.model)
    // console.log ("\n")

    // game.gamesTiles.forEach (function (tile, index) {
    //   tile.textContent = game.puzzleModel.tile (index)
    // })

    game.playerSolution = []
    game.playerSolutionIndex = 0
    
    updateTiles ()

    document.getElementById ("undo").disabled = true    
  }


  // document.getElementById ("scramble").onclick = function (event) {

  //   console.log ("scramble clicked")

  //   if ( game.playbackInterval ) {
  //     clearInterval (game.playbackInterval)
  //     game.playbackInterval = null
  //   }

  //   document.getElementById ("solvePauseResume").textContent = "Solve"
    
  //   game.puzzleModel.shuffle ()

  //   // printPuzzle (game.puzzleModel.model)
  //   // console.log ("\n")

  //   // game.gamesTiles.forEach (function (tile, index) {
  //   //   tile.textContent = game.puzzleModel.tile (index)
  //   // })

  //   game.playerSolution = []

  //   updateTiles ()
  //   document.getElementById ("undo").disabled = true
    
  //  let solved = isPuzzleSolved ()
  
  //   if ( solved )
  //     document.getElementById ("title").textContent = "15-Puzzle Solved"
  //   else
  //     document.getElementById ("title").textContent = "15-Puzzle"
  // }


  document.getElementById ("reset").onclick = function (event) {

    console.log ("reset clicked")

    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null
    }

    document.getElementById ("solvePauseResume").textContent = "Solve"

    game.puzzleModel.model = NewPuzzle.slice ()
    game.puzzleModel.solve ()

    game.mode = SolutionMode.None

    game.playerSolution = []
    game.playerSolutionIndex = 0
  
    updateTiles ()

    document.getElementById ("undo").disabled = true
    
    let solved = isPuzzleSolved ()

    if ( solved )
      document.getElementById ("title").textContent = "15-Puzzle Solved"
    else
      document.getElementById ("title").textContent = "15-Puzzle"    
  }


  document.getElementById ("shuffle").onclick = function (event) {
    
    console.log ("shuffle clicked")

    if ( game.playbackInterval ) {
      clearInterval (game.playbackInterval)
      game.playbackInterval = null
    }

    if ( game.shuffleInterval ) {
      clearInterval (game.shuffleInterval)
      game.shuffleInterval = null
      document.getElementById ("shuffle").textContent = "Shuffle"
      return
    }

    game.mode = SolutionMode.Computer

    let step = 0
    let lastNumber = -1
  
    game.playerSolution = []
    game.playerSolutionIndex = 0

    game.shuffleInterval = setInterval (function () {

      do {
        var number = randomIntegerLessThan (15) + 1
        var directionTileCanMove = game.puzzleModel.canMove (number)
      
      } while ( number == lastNumber || directionTileCanMove == Direction.None )

      lastNumber = number

      switch ( directionTileCanMove ) {
    
        case Direction.Up:
          game.puzzleModel.move (Direction.Down)
          break

        case Direction.Down:
          game.puzzleModel.move (Direction.Up)
          break      
                
        case Direction.Left:
          game.puzzleModel.move (Direction.Right)
          break            
        
        case Direction.Right:
          game.puzzleModel.move (Direction.Left)
          break
      }

      game.mode = SolutionMode.Computer
      game.puzzleModel.solve ()

      updateTiles ()

      document.getElementById ("shuffle").textContent = "Stop"
      document.getElementById ("solvePauseResume").textContent = "Solve"
        
      if ( ++step >= game.shuffleCount ) {
        clearInterval (game.shuffleInterval)
        game.shuffleInterval = null
        document.getElementById ("shuffle").textContent = "Shuffle"
      }

    }, game.shuffleSpeed)
  }


  document.getElementById ("load").onclick = function (event) {
    
    console.log ("load clicked")

    let position = document.getElementById ("position").value
    console.log (position)

    let tiles = position.split (",")

    if ( tiles.length != 16 )
      return

    tiles = tiles.map (function (tile) {

      if ( tile == 0 )
        return " "

      return parseInt (tile)
    })
  
    console.log (tiles)

    game.puzzleModel = new PuzzleModel (tiles, 4, 4)

    game.moves = game.puzzleModel.solve ()

    game.playerSolution = []
    game.playerSolutionIndex = 0

    updateTiles ()
  }

  document.getElementById ("solution").onclick = function (event) {
      
    console.log ("solution clicked")
    
    if ( game.SolutionMode == SolutionMode.Player )
      return

    if ( event.target.id > game.puzzleModel.moveCounter )
      var direction = Direction.Forward

    else if ( event.target.id < game.puzzleModel.moveCounter )
      var direction = Direction.Backward

    else
      return    

    game.fastForwardInterval = setInterval (function () {
      
      if ( direction == Direction.Forward )
        game.puzzleModel.next ()
      else
        game.puzzleModel.prev ()
    
      if ( event.target.id == game.puzzleModel.moveCounter ) {
        clearInterval (game.fastForwardInterval)
        game.fastForwardInterval = null
      }

      updateTiles ()
            
    }, game.fastForwardSpeed)

    updateTiles ()
  }


  function isPuzzleSolved () {
    
    let solved = true

    for ( let index = 0; index < 15; index++ ) {

      if ( game.puzzleModel.model [index] != index + 1) {
        solved = false
        break
      }
    }

    return solved
  }


  function updateTiles () {
    
    game.puzzleModel.model.forEach (function (number, index) {

      if ( number == Space )
        return

      let tile = game.gamePuzzle.querySelector (`#_${number}`)

      tile.style.left = (index % 4) * (75 + 3) + "px"
      tile.style.top = (Math.floor (index / 4)) * (75 + 3) + "px"
    })

    let position = game.puzzleModel.toString ()

    if ( game.mode == SolutionMode.Player ) {

      document.getElementById ("playerSolutionIndex").textContent = "Current Move: " + game.playerSolutionIndex
      document.getElementById ("playerSolutionLength").textContent = "Total Moves: " + game.playerSolution.length

      let html = ""
      
      for ( var index=0 ; index < game.playerSolution.length; index++ ) {

        if ( index == game.playerSolutionIndex )
          html += `<span id="${index}" class="current-move">${twoDigitNonBreakingSpace (game.playerSolution [index])} </span>`
        else
          html += `<span id="${index}" class="move">${twoDigitNonBreakingSpace (game.playerSolution [index])} </span>`

        document.getElementById ("solution").innerHTML = html        
      }
    }
    else if ( game.mode == SolutionMode.Computer ) {
      document.getElementById ("playerSolutionIndex").textContent = "Current Move: " + game.puzzleModel.moveCounter
      document.getElementById ("playerSolutionLength").textContent = "Total Moves: " + game.puzzleModel.moves.length 
      
      let html = ""

      for ( var index=0 ; index < game.puzzleModel.tiles.length; index++ ) {

        if ( index == game.puzzleModel.moveCounter )
          html += `<span id="${index}" class="current-move">${twoDigitNonBreakingSpace (game.puzzleModel.tiles [index])} </span>`
        else
          html += `<span id="${index}" class="move">${twoDigitNonBreakingSpace (game.puzzleModel.tiles [index])} </span>`
      }

      html += `<span id="${index}" class="move">&nbsp;&nbsp;</span>`
      
      document.getElementById ("solution").innerHTML = html
    }
    else {
      document.getElementById ("playerSolutionIndex").textContent = "Current Move: 0"
      document.getElementById ("playerSolutionLength").textContent = "Total Moves: 0"
      document.getElementById ("solution").innerHTML = ``
    }
  
    document.getElementById ("position").value = position    

    // if ( typeof game.puzzleNodes [position] !== "undefined")
    //   console.log ("found node")

    // else
    //   game.puzzleNodes [position] = {}

    // console.log ("number of nodes:", Object.keys (game.puzzleNodes).length)    
  }

  function twoDigitNonBreakingSpace (n) {
    
      if ( n < 10 )
        return "&nbsp;&nbsp;" + n
    
      return n
    }
})

// 1,2,3,4,5,6,11,8,9,7,14,12,13,10,15,_

/*

  <div>

    <span class="move">1</span>, <span  class="current-move">2</span>, <span class="move">3</span>

  </div>


*/

let gameProgress = {
  wordle: 'blast',
  grid: [
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','','']
  ],
  currRow: 0,
  currCol: 0,
  currGuess: ''
}

function startup () {
  generateKeys()
  generateGrid()
}
startup()


// create a function that takes in parameters for specific grid coordinates
  // "row" argument will be assigned via loop
  // "col" aka "column" will be assigned via loop
  // "char" or "character" will be assigned via user input
function createTile(row, col, char = '') {
  const tile = document.createElement('div');
  // use .className and .id instead of setAttribute() to be less verbose
    // "The className property of the Element interface gets and sets the value of the class attribute of the specified element." - MDN
    // "The id property of the Element interface represents the element's identifier, reflecting the id global attribute." - MDN
  // Give the tile a specific id with coordinates
    // Use textContent instead of innerText because the text within the tile is a child of tile element
    // "The textContent property of the Node interface represents the text content of the node and its descendants." - MDN
    tile.className = 'tile';
    tile.id = `tile${row}${col}`;
    tile.textContent = char;
  // Append tile (child) to grid (parent)
  const gameGrid = document.getElementById('game-tiles')
  gameGrid.appendChild(tile)
}

// Create a function that generates grid with tiles
function generateGrid() {
  //create a nested loop that generates 6 rows and for every row, generate 5 columns
    // outer loop generates 6 rows
  for (let r = 0; r < 6; r++) {
    // inner loop generates 5 columns
    for (let c = 0; c < 5; c++) {
      createTile(r, c);
    }
  }
}

// Create function that generates keyboard keys
  // keyboards have (3) rows
  // each row will contain a specified number of characters
  // create a for loop that iterates each nested array (row of characters)
    // create a div for each key within that current row
    // give each div the ability to act as a virtual keyboard using event listener
function generateKeys () {
  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L",],
    ["Z", "X", "C", "V", "B", "N", "M",]
  ];

  for (let i = 0; i < keyboard.length; i++) {
    const keyboardContainer = document.getElementById('keyboard-keys-container')
    const row = keyboard[i];
    const keyboardRow = document.createElement('div');
    keyboardRow.setAttribute('class', 'keyboard-row');
    keyboardContainer.appendChild(keyboardRow);
    
    for (let j = 0; j < row.length; j++) {
      const character = row[j];
      const characterKey = document.createElement('div');
      characterKey.setAttribute('class', 'char-key');
      characterKey.id = character + " Key";
      characterKey.innerText = character;
      // Add 'click' functionality to DOM keyboard
      characterKey.addEventListener('click', (input) => {
        input.key = character.toLowerCase();
        if(isCharKey(input.key)) {
          keyInputLister(input.key);
        }
      })
      keyboardRow.append(characterKey);
    }
  }
}


// Check if keyboard input is a valid character and will return false if any other input is pressed
function isCharKey (input) {
  return (input.length === 1 && input.match(/[a-z]/i));
      // input.length is used because the 'key' property from eventListener can return multicharacter-inputs like "Enter", "Escape", "Space", etc.
      // input.match uses a regexp that matches the 'key' value from eventListener to letter within the range 'a' to 'z' while ignoring case (upper or lower) using the 'i' flag
};

// DOM event listener for user input via physical keyboard presses
document.addEventListener('keydown', (input) => {
  if (isCharKey(input.key)) {
    keyInputLister(input.key.toLowerCase());
  } else if (input.key === 'Enter') {
    checkGuess();
  } else if (input.key === 'Backspace') {
    // deleteCharacter();
    console.log(input.key)
  }
});



function keyInputLister (input) {
  let currRow = gameProgress.currRow;
  let currCol = gameProgress.currCol;
  let currTile = document.getElementById(`tile${currRow}${currCol}`);
  if ((currCol >= 0 && currCol <= 4) && currTile) {
    currTile.textContent = input; // <-- set's tile character
    gameProgress.currGuess += input; // <-- updates current guess per character input
    gameProgress.currCol += 1; // <-- after each input, go to next tile
  };

  // useful console.logs
    // console.log('input key: ', input)  // <-- logs all character inputs (DOM keyboard and user's keyboard)
    // console.log('currCol: ' + currCol); //  <-- used as a cross reference with tile.id (place before currCol += 1)
    // console.log('currRow: ' + currRow); // <-- used as a cross reference with tile.id (place before currCol += 1)
    // console.log('currGuess: ', gameProgress.currGuess); // <-- tracks user's current guess attempt
    // console.log('currTile: ', currTile); // <-- tracks current tile being affected (place before currCol += 1)

}



function checkGuess () {
  if (gameProgress.currGuess.length === 5) {
    if (wordList.includes(gameProgress.currGuess) || guessList.includes(gameProgress.currGuess)) {
      // console.log('guess present in either list: ', gameProgress.currGuess);
      if (gameProgress.currGuess === gameProgress.wordle) {
        console.log('correct guess: ', gameProgress.currGuess);
        showGuess() 
          // checks each character, its index and adds .correct class and animation to each tile
        // newGame()
          // updates game stats
          // resets tiles to default, changes wordle, and resets currCol/currRow to 0
      } else {
          console.log('incorrect guess: ', gameProgress.currGuess);
          showGuess()
          nextRow();
      }

    }
  }

  function nextRow () {
    gameProgress.currRow++;
    gameProgress.currCol = 0;
    gameProgress.currGuess = '';
  }

  // showguess() checks each character, its index and adds .correct class and animation to each tile
    // check for all present characters in currGuess that are in the chosenWordle
      // create a loop that cross references each present character's index with the character indexes of the chosenWordle
        // if the currGuess character and it's index is === to those of the chosenWordle
          // turn the tile "green"
        // else if the currGuess character is present but not in the same position as that of the chosenWordle
          //turn the tile "yellow"
        // else turn the tile "grey"
  function showGuess () {
    console.log('**guess animation happening**');
  }

}


let gameProgress = {
  corrWord: '',
  grid: [
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','','']
  ],
  row: 0,
  col: 0
}

function startup () {
  generateKeys()
  generateGrid()
  keyboardLister ()
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
  ]
  for (let i = 0; i < keyboard.length; i++) {
    const keyboardContainer = document.getElementById('keyboard-keys-container')
    const row = keyboard[i];
    const keyboardRow = document.createElement('div')
    keyboardRow.setAttribute('class', 'keyboard-row')
    keyboardContainer.appendChild(keyboardRow)
    
    for (let j = 0; j < row.length; j++) {
      const character = row[j];
      const characterKey = document.createElement('div');
      characterKey.setAttribute('class', 'char-key');
      characterKey.id = character + " Key"
      characterKey.innerText = character;
      // Add 'click' functionality to DOM keyboard
      characterKey.addEventListener('click', (input) => {
        input.key = character
        isCharKey(input)
      })
      keyboardRow.append(characterKey)
    }
  }
}

// Check if keyboard input is a valid character
function isCharKey (key) {
  // key.length is used because the 'key' property can return "Enter", "Escape", "Space", etc.
  // key.match uses a regexp that matches the 'key' value to an letter within the range 'a' to 'z' while ignoring case (upper or lower) using the 'i' flag
  // isCharKey() will return false if any other input is pressed
      // console.log(key); <-- Used to check if input is being read
    return (key.length === 1 && key.match(/[a-z]/i));
}







function keyboardLister () {
  let row = 0;
  let col = 0;
  let currRow = gameProgress.row;
  let currCol = gameProgress.col;
  let currGuess = '';
  document.addEventListener('keydown', (input) => {
    let currTile = document.getElementById(`tile${row}${col}`);
      if (!isCharKey(input.key)) {
        if (input.key == 'Enter'){
          console.log(currGuess);
          col = 0;
          row ++;
          // return // <-- delete when submitAnswer() function declared
        } else if (input.key == 'Backspace') {
          // deleteCharacter();
          return //<-- delete when deleteCharacter() function declared
        }
      } else if (col <= 5 && currTile) {
          currTile.textContent = input.key;
          currGuess.concat(input.key)
                        // logs current tile positioning is accurate and checks if conditionals are true
                          console.log('currTile: ', currTile);
                          console.log('row: ' + row);
                          console.log('col: ' + col);
                          console.log('currRow: ' + currRow);
                          console.log('currCol: ' + currCol);
                          console.log('input key: ', input.key)
          col ++;
          currCol ++;
      }
    })
  }


// create guessInput()
  // this function would be a callback function that allows the user to use both the DOM keyboard and user's physical keyboard to type, submit and edit their currGuess



// Create a submitGuess() that checks the currGuess with: guessList
  // if currGuess is present in guessList, then...
  // check for all present characters in currGuess that are in the chosenWordle
    // create a loop that cross references each present character's index with the character indexes of the chosenWordle
      // if the currGuess character and it's index is === to those of the chosenWordle
        // turn the tile "green"
      // else if the currGuess character is present but not in the same position as that of the chosenWordle
        //turn the tile "yello"
      // else turn the tile "grey"
    // increase the currRow value by 1 and reset the currCol value back to 0

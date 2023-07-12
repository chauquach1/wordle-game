let gameProgress = {
  wordle: wordList[Math.floor(Math.random() * wordList.length) + 1],
  // wordle: 'holty',
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
  currGuess: '',
  gamesPlayed: 0,
  gamesWon: 0,
  winRate: Math.floor(this.gamesWon/this.gamesPlayed * 100),
  currWinStreak: 0,
  longestStreak: 0
}

function startup () {
  console.log(gameProgress.wordle);
  generateKeyboard()
  generateGrid()
  keyboardEventListener()
}
startup()


// create a function that takes in parameters for specific grid coordinates
  // "row" argument will be assigned via loop
  // "col" aka "column" will be assigned via loop
  // "char" or "character" will be assigned via user input
function createTile(row, col) {
  const tile = document.createElement('div');
  // use .className and .id instead of setAttribute() to be less verbose
    // "The className property of the Element interface gets and sets the value of the class attribute of the specified element." - MDN
    // "The id property of the Element interface represents the element's identifier, reflecting the id global attribute." - MDN
  // Give the tile a specific id with coordinates
    // Use textContent instead of innerText because the text within the tile is a child of tile element
    // "The textContent property of the Node interface represents the text content of the node and its descendants." - MDN
    tile.className = 'tile';
    tile.id = `tile${row}${col}`;
    tile.textContent = '';
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
function generateKeyboard () {
  // generating keyboard character keys
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
      const character = row[j].toLowerCase();
      const characterKey = document.createElement('div');
      characterKey.setAttribute('class', 'char-key');
      characterKey.id = character + " Key";
      characterKey.textContent = character;
      // Add 'click' functionality to DOM keyboard
      characterKey.addEventListener('click', (input) => {
        input.key = character.toLowerCase();
        if(isCharKey(input.key)) {
          updateTile(input.key);
        }
      })
      keyboardRow.append(characterKey);
    }
  }

  // generate 'submit' and 'delete' keys that act like physical counterparts
  const deleteSubmitKeysContainer = document.getElementById('delete-submit-keys-container')
  const nonCharKeys = [['delete-key','delete', 'Backspace'], ['submit-key','submit', 'Enter']];
  for (let i = 0; i < nonCharKeys.length; i++) {
    const button = document.createElement('button');
    button.classList.add('non-char-keys');
    button.id = nonCharKeys[i][0];
    button.textContent = nonCharKeys[i][1]
    button.addEventListener('click', (click) => {
      click.key = nonCharKeys[i][2]
      updateTile(click.key)
    })
    deleteSubmitKeysContainer.appendChild(button)
  }
}


// Check if keyboard input is a valid character and will return false if any other input is pressed
function isCharKey (input) {
  return (input.length === 1 && input.match(/[a-z]/i));
      // input.length is used because the 'key' property from eventListener can return multicharacter-inputs like "Enter", "Escape", "Space", etc.
      // input.match uses a regexp that matches the 'key' value from eventListener to letter within the range 'a' to 'z' while ignoring case (upper or lower) using the 'i' flag
};

// DOM event listener for user input via physical keyboard presses
function keyboardEventListener () {
document.addEventListener('keydown', (input) => {
    if (isCharKey(input.key) || input.key === 'Enter' || input.key === 'Backspace') {
      updateTile(input.key)
    } 
    else {return};
  });
}


function updateTile (input) {
  let grid = gameProgress.grid;
  let currRow = gameProgress.currRow;
  let currCol = gameProgress.currCol;
  let currTile = document.getElementById(`tile${currRow}${currCol}`)
  let prevTile = document.getElementById(`tile${currRow}${currCol-1}`)

  if (input === 'Enter') {
    checkLength();
  }

  if (input === 'Backspace') {
    if (gameProgress.currCol === 0) {
      return
    } else {
      prevTile.textContent = '';  // <-- remove previous tile.textContent
      gameProgress.currCol -= 1; // <-- move to previous tile, which is now empty
      grid[gameProgress.currRow][gameProgress.currCol] = ''; // <-- updates grid to reflect character removal
      return
    }
  }
  
  else if ((currCol >= 0 && currCol < 5) && currTile) {
    input = input.toLowerCase()
    grid[gameProgress.currRow][gameProgress.currCol] = input; // <-- updates grid with character addition
    currTile.textContent = input; // <-- set's tile character
    gameProgress.currCol ++; // <-- after each input, go to next tile
    return
  };

  // useful console.logs (use only before currCOl += 1)
    // console.log('key pressed: ', input); // <-- check for 'keydown' event and which key was pressed
    // console.log('curr grid row and grid col: ', grid.indexOf(grid[currRow]), 'x', grid[currRow].indexOf(input))
    // console.log('curr grid text at curr grid row x curr grid col: ', grid[currRow][currCol]);
    // console.log(grid[currRow]);
    // console.log('input key: ', input)  // <-- logs all character inputs (DOM keyboard and user's keyboard)
    // console.log('currCol: ' + currCol); //  <-- used as a cross reference with tile.id
    // console.log('currRow: ' + currRow); // <-- used as a cross reference with tile.id
    // console.log('currGuess: ', gameProgress.currGuess); // <-- tracks user's current guess attempt
    // console.log('currTile: ', currTile); // <-- tracks current tile being affected
}


// check for length of currGuess
function checkLength () {
  const grid = gameProgress.grid;
  const guessString = grid[gameProgress.currRow].join('');
  if (guessString.length === 5) {
    isValidGuess(guessString);
  } else {
    return;
  }

  // check if guess is a usable word
  function isValidGuess () {
    if (wordList.includes(guessString) || guessList.includes(guessString)) {
      gameProgress.currGuess = guessString;
      checkGuess(guessString)
    }
  }
}



function checkGuess (guessString) {
  const wordle = gameProgress.wordle;
  const guess = guessString;
  console.log(`Curr guess: ${guess} | Wordle: ${wordle}`);
  
  for (let i = 0; i < 5; i++) {
    let currTile = document.getElementById(`tile${gameProgress.currRow}${i}`);
    let keyboardKey = document.getElementById(`${guess[i]} Key`);
    const guessCharFrequency = checkCharFrequency(guess, guess[i])
    const guessCharIndex = checkCharIndex(guess, guess[i], i)
    const wordleCharFrequency = checkCharFrequency(wordle, guess[i])
    const wordleCharIndex = checkCharIndex(wordle, wordle[i], i)

    // if the character frequency is greater in the guess than that of the wordle and the character shows after the furthest index in that of the wordle, then that tile should be grey 
      // example:
        // wordle = ['A','A','B','C','D']
        // guess = ['A','A','B','C','A'] <-- guess[4] is past its max index and occurences
    // Why is this necessary? If the last A was highlighted 'yellow', the user would think that "A" needs to be used again but in a different index 

    if ((guessCharFrequency > wordleCharFrequency && guessCharIndex > wordleCharIndex)) {
      if (keyboardKey.classList.contains('correct') || keyboardKey.classList.contains('wrong-position')) {
        currTile.classList.add('unused', 'animation');
      } else {
        currTile.classList.add('unused', 'animation');
        keyboardKey.classList.add('unused');
      }
    } else {
      if (guess[i] === wordle[i]) {
        if (keyboardKey.classList.contains('wrong-position')) {
          keyboardKey.classList.remove('class', 'wrong-position');
        } else if (keyboardKey.classList.contains('unused')) {
          keyboardKey.classList.remove('class', 'unused');
        }
        currTile.classList.add('correct', 'animation');
        keyboardKey.classList.add('correct');

      } else if (wordle.includes(guess[i])) {
          if(keyboardKey.classList.contains('correct')) {
            currTile.classList.add('wrong-position', 'animation');
          } else {
            keyboardKey.classList.add('wrong-position');
            currTile.classList.add('wrong-position', 'animation');
          }

      } else {
        if (keyboardKey.classList.contains('correct') || keyboardKey.classList.contains('wrong-position')) {
          currTile.classList.add('unused', 'animation');
        } else {
          keyboardKey.classList.add('unused');
          currTile.classList.add('unused', 'animation');
        }
      }
    }
  }
  submitGuess();
}


// check number of Frequency of a single character
function checkCharFrequency (word, char) {
  let charFrequency = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === char ) {
      charFrequency ++;
    }
  }
  return charFrequency;
}

// check a character's index
function checkCharIndex (word, char, index) {
  let charIndex = 0;
  for (let i = 0; i <= index; i++) {
    if (word[i] === char) {
      charIndex++;
    }
  }
  return charIndex;
}

// after submit, go to next available row
function submitGuess () {
  const gameWon = gameProgress.currGuess === gameProgress.wordle;
  const gameLoss = (gameProgress.currCol === 4 && gameProgress.currRow === 5 && gameProgress.currGuess !== gameProgress.wordle)
  if (gameWon) {
    console.log('game won');
    finishGame('gameWon');
    return
  } else if (gameLoss) {
    console.log('game over');
    finishGame('gameLoss');
    return
  } else {
    gameProgress.currCol = 0;
    gameProgress.currRow++;
    console.log(gameProgress.currGuess);
  }
}

function finishGame () {
  gameProgress.gamesPlayed++;

  if ('gameWon') {
    gameProgress.gamesWon++;
    gameProgress.currWinStreak++;
    if (gameProgress.longestStreak > gameProgress.currWinStreak) {
      return
    } else {
      gameProgress.longestStreak = gameProgress.currWinStreak
    }

  } else if ('gameLoss') {
    gameProgress.currWinStreak = 0;
  }
  console.log('games played: ', gameProgress.gamesPlayed);
  console.log('games won: ', gameProgress.gamesWon);
  console.log('win rate: ', );
  console.log('curr win streak: ', gameProgress.currWinStreak);
  console.log('longest win streak: ', gameProgress.longestStreak);
}
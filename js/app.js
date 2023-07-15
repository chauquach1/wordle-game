// game progress tracker for all crucial variables
let gameProgress = {
  wordle: wordList[Math.floor(Math.random() * wordList.length) + 1],
  grid: [
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','','']
  ],
  keyboard: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L",],
    ["Z", "X", "C", "V", "B", "N", "M",]
  ],
  currRow: 0,
  currCol: 0,
  currGuess: '',
  inProgress: true,
  gamesPlayed: 0,
  gamesWon: 0,
  currWinStreak: 0,
  longestStreak: 0,
  instructionsShowing: false,
  winRate () {
    return Math.floor((this.gamesWon/this.gamesPlayed ) * 100)
  },
  newWordle () {
    this.wordle = wordList[Math.floor(Math.random() * wordList.length) + 1]
  }
}

function startup () {
  gameProgress.gamesPlayed++;
  generateKeyboard();
  generateGrid();
  keyboardEventListener();
  generateNewWordleBtn();
  generateInstructions();
}
startup()


// Create a function that generates grid with tiles
function generateGrid() {
  // generates 6 rows
  for (let r = 0; r < 6; r++) {
    // inner loop generates 5 columns
    for (let c = 0; c < 5; c++) {
      createTile(r, c);
    }
  }
}

// create a function that takes in parameters from specific grid coordinates
  // "row" argument will be assigned via loop
  // "col" aka "column" will be assigned via loop
function createTile(row, col) {
  const tile = document.createElement('div');
    tile.className = 'tile';
    tile.id = `tile${row}${col}`;
    tile.textContent = '';

  // Append tile (child) to grid (parent)
  const gameGrid = document.getElementById('game-tiles')
  gameGrid.appendChild(tile)
}


// Create function that generates keyboard keys, submit button and delete button
function generateKeyboard () {
  let keyboard = gameProgress.keyboard;
  // generating keyboard character keys
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
      characterKey.textContent = character; //<-- "innerText is defined only for HTMLElement objects, while textContent is defined for all Node objects." - https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext 
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
      if (click.key === 'Backspace') {
        updateTile(click.key)
      } else if (click.key === 'Enter' && gameProgress.inProgress === true) {
        checkLength()
      }
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
    if (gameProgress.inProgress === true) {
      if (isCharKey(input.key) || input.key === 'Backspace') {
        updateTile(input.key)
      } else if (input.key === 'Enter') {
        checkLength()
      }
      else {return};
    }
  });
}

// update tile.textContent if input is a character or remove tile.textContent if input is "Backspace"
function updateTile (input) {
  if (gameProgress.inProgress !== true) {
    return
  }

  let grid = gameProgress.grid;
  let currRow = gameProgress.currRow;
  let currCol = gameProgress.currCol;
  let currTile = document.getElementById(`tile${currRow}${currCol}`)
  let prevTile = document.getElementById(`tile${currRow}${currCol-1}`)

  if (input === 'Backspace') {
    if (gameProgress.currCol === 0) {
      return
    } else {
      // gameProgress.currGuess.replace(`${gameProgress.currGuess[gameProgress.currCol]}`, '')
      gameProgress.currGuess = gameProgress.currGuess.substring(gameProgress.currGuess[gameProgress.currCol], gameProgress.currGuess.length - 1); // <-- delete last character in gameProgress.currGuess
      gameProgress.currCol -= 1; // <-- move to previous tile, which is now empty
      grid[gameProgress.currRow][gameProgress.currCol] = ''; // <-- updates grid to reflect character removal
      prevTile.textContent = '';  // <-- remove previous tile.textContent
      return
    }
  }
  
  else if ((currCol >= 0 && currCol < 5) && currTile) {
    input = input.toLowerCase()
    grid[gameProgress.currRow][gameProgress.currCol] = input; // <-- updates grid with character addition
    currTile.textContent = input; // <-- set's tile character
    gameProgress.currGuess += input; // <-- updates currGuess
    gameProgress.currCol ++; // <-- after each input, go to next tile
    return
  };
}


// check for length of currGuess
function checkLength () {
  if (gameProgress.currGuess.length === 5) {
    isValidGuess(gameProgress.currGuess);
  } else {
    return;
  }
}

// check if guess is a usable word
function isValidGuess (guessString) {
  if (wordList.includes(guessString) || guessList.includes(guessString)) {
    checkGuess(guessString)
  }
}

// check each character of currGuess
function checkGuess (guessString) {
  const wordle = gameProgress.wordle;
  const guess = guessString;
  animationDelay = 500;
  
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
      setTimeout(() => {
      if ((guessCharFrequency > wordleCharFrequency && guessCharIndex > wordleCharIndex)) {
        if (keyboardKey.classList.contains('correct') || keyboardKey.classList.contains('wrong-position')) {
          currTile.classList.add('unused', 'flip');
        } else {
          currTile.classList.add('unused', 'flip');
          keyboardKey.classList.add('unused');
        }
      } else {
        if (guess[i] === wordle[i]) {
          if (keyboardKey.classList.contains('wrong-position')) {
            keyboardKey.classList.remove('class', 'wrong-position');
          } else if (keyboardKey.classList.contains('unused')) {
            keyboardKey.classList.remove('class', 'unused');
          }
          currTile.classList.add('correct', 'flip');
          keyboardKey.classList.add('correct');

        } else if (wordle.includes(guess[i])) {
            if(keyboardKey.classList.contains('correct')) {
              currTile.classList.add('wrong-position', 'flip');
            } else {
              keyboardKey.classList.add('wrong-position');
              currTile.classList.add('wrong-position', 'flip');
            }

        } else {
          if (keyboardKey.classList.contains('correct') || keyboardKey.classList.contains('wrong-position')) {
            currTile.classList.add('unused', 'flip');
          } else {
            keyboardKey.classList.add('unused');
            currTile.classList.add('unused', 'flip');
          }
        }
      }
    }, (animationDelay)/2)
    animationDelay += 100; // <-- increase animation delay for staggered "flip" effect
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
  const gameLoss = ((gameProgress.currCol === 5 && gameProgress.currRow === 5 )&& gameProgress.currGuess !== gameProgress.wordle)
  
  if (gameWon || gameLoss) {
    gameProgress.inProgress = false;
    if (gameWon) {
      updateStats('gameWon');
      return
    } else if (gameLoss) {
      updateStats('gameLoss');
      return
    } 
  } else if (gameProgress.currRow < 5){
      gameProgress.currGuess = '';
      gameProgress.currCol = 0;
      gameProgress.currRow++;
    } 
}


// update game stats
function updateStats (gameOutcome) {
  if (gameOutcome === 'gameWon') {
    gameProgress.gamesWon++;
    gameProgress.currWinStreak++;
    if (gameProgress.longestStreak > gameProgress.currWinStreak) {
      return
    } else {
      gameProgress.longestStreak = gameProgress.currWinStreak
    }
    confirmNewGame('gameWon');

  } else if (gameOutcome === 'gameLoss') {
    gameProgress.currWinStreak = 0;
    confirmNewGame('gameLoss')
  }
}



function confirmNewGame (gameOutcome) {
  setTimeout(() => {
    // show wordle
    displayWordle();

    // add stats tracker
    generateStats();

    // create new game button
    generateNewGameBtn();

    // add results prompt
    const feedback = document.getElementById('nav-new-wordle')
    feedback.classList.add('game-text')
    feedback.style.textDecoration = 'underline'
    feedback.textContent = '';
    if (gameOutcome === 'gameWon'){
      let gameWonPrompt = '';
      if (gameProgress.currRow === 0) {
        gameWonPrompt = 'You\'re a genius!';
      } else if (gameProgress.currRow >= 1 && gameProgress.currRow <= 3) {
        gameWonPrompt = 'Wow! You\'re pretty good.';
      } else {
        gameWonPrompt = 'Congratualions! You solved the wordle.';
      }
      feedback.textContent = gameWonPrompt;
      
    } else if (gameOutcome === 'gameLoss'){
      feedback.textContent = 'Nice try!';
    }
  }, 1000)
}


//update game stats and game progress to reflect new game
function startNewGame () {
  gameProgress.gamesPlayed++;
  gameProgress.currRow = 0;
  gameProgress.currCol = 0;
  gameProgress.currGuess = '';
  gameProgress.inProgress = true;
  gameProgress.newWordle();
  gameProgress.grid = [
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','',''], 
    ['','','','','']
  ];

  
  // show 'new-wordle-btn'
  document.getElementById('nav-new-wordle').textContent = '';
  generateNewWordleBtn()

  
  // remove stats tracker and start new game button
  if (document.getElementById('results-div').contains(document.getElementById('confirmation-btn'))) {
    document.getElementById('confirmation-btn').remove();
  }
  if (document.getElementById('results-div').contains(document.getElementById('results-aside'))) {
    document.getElementById('results-aside').remove();
  }

  // remove wordle reveal
  if (document.querySelector('p.wordle-reveal'))
  document.querySelector('p.wordle-reveal').remove()
  

  // reset tile classes and textContent
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 4; j++) {
      let currTile = document.getElementById(`tile${i}${j}`);
      currTile.textContent = '';
      currTile.setAttribute('class', 'tile')
    }
  }

  // reset keyboard character keys
  let keyboard = gameProgress.keyboard;
  for (let i = 0; i < keyboard.length; i++) {
    const row = keyboard[i];
    
    for (let j = 0; j < row.length; j++) {
      const character = row[j].toLowerCase();
      const characterKey = document.getElementById(character + " Key")
      characterKey.setAttribute('class', 'char-key');
    }
  }
}

// generateNewWordleBtn
function generateNewWordleBtn () {
  const feedback = document.getElementById('nav-new-wordle');
  const newWordleBtn = document.createElement('button');
  newWordleBtn.textContent = 'New Wordle Please!'
  newWordleBtn.id = 'new-wordle-btn'
  newWordleBtn.classList.add('game-text', 'button')
  newWordleBtn.addEventListener('click', () => {
    startNewGame();
    gameProgress.currWinStreak = 0
  })
  feedback.appendChild(newWordleBtn);
}


// generateStats
function generateStats () {
  const resultsDiv = document.getElementById('results-div');
  
  const statsAside = document.createElement('aside');
    statsAside.id = 'results-aside';
    statsAside.classList.add('game-text', 'aside');
  
  const resultsUl = document.createElement('ul');
    resultsUl.setAttribute('class', 'results-ul');

  const statsArray = ['games-played', 'win-rate', 'curr-win-streak', 'longest-win-streak'];
  const statText = [
      `Games Played: ${gameProgress.gamesPlayed}`, 
      `Win Rate: ${gameProgress.winRate()}%`,
      `Current Win Streak: ${gameProgress.currWinStreak}`,
      `Longest Win Streak: ${gameProgress.longestStreak}`
    ]

  for (let i = 0; i < statsArray.length; i++) {
    const stat = document.createElement('li');
    const statName = statsArray[i];
    stat.id = statName;
    stat.classList.add('results-li');
    stat.textContent = statText[i]
    resultsUl.appendChild(stat);
  }
  resultsDiv.appendChild(statsAside)
  statsAside.appendChild(resultsUl)
}


// generateNewGameBtn
function generateNewGameBtn () {
  const resultsDiv = document.getElementById('results-div')
  const startNewGameBtn = document.createElement('button');
    startNewGameBtn.textContent = 'Play Again?';
    startNewGameBtn.setAttribute('id', 'confirmation-btn')
    startNewGameBtn.classList.add('non-char-keys', 'correct')
    startNewGameBtn.addEventListener('click', function() {
      startNewGame();
    })
    resultsDiv.appendChild(startNewGameBtn)
}


// generateInstructions
function generateInstructions () {
  const instructionsDiv = document.getElementById('instructions-div');
  
  const instructionsAside = document.createElement('aside');
    instructionsAside.id = 'instructions-aside';
    instructionsAside.classList.add('game-text', 'aside')

  const instructionsOl = document.createElement('ol')
    instructionsOl.setAttribute('class', 'instructions-ol')

  instructionsArray = [
    'You have six tries to guess the five-letter word!',
    'Type in your guess and submit your word.',
    'The tiles will turn "Green" if the letter is present and in the correct spot. The tile will turn "Yellow" if you guessed the right letter, but it\'s in the wrong spot. A "Gray" tile means that the letter is not included in the word!',
    'Keep guessing until you solve the Wordle!'
  ]
  
  for (let i = 0; i < instructionsArray.length; i++) {
    const instructionText = instructionsArray[i];
    const instruction = document.createElement('li');
    const lineBreak = document.createElement('br');
    instruction.textContent = instructionText;
    instructionsOl.appendChild(instruction);

    if (i < 3) {
      instructionsOl.appendChild(lineBreak);
    }
  }

  instructionsDiv.appendChild(instructionsAside);
  instructionsAside.appendChild(instructionsOl);
  instructionsAside.style.visibility = 'hidden';
}


// show and hide instructions
const instructionsAside = document.getElementById('instructions-aside')
const howToPlaybtn = document.getElementById('instructions-btn')
howToPlaybtn.addEventListener('click', () => {
  if (gameProgress.instructionsShowing === false) {
    instructionsAside.style.visibility = 'visible';
    gameProgress.instructionsShowing = true;
  } else if (gameProgress.instructionsShowing === true){
    instructionsAside.style.visibility = 'hidden';
    gameProgress.instructionsShowing = false;
  }
})


// Display wordle at end of game
function displayWordle () {
  const wordleRevealDiv = document.getElementById('wordle-reveal-div');
  const wordleDisplay = document.createElement('p')
  wordleDisplay.classList.add('wordle-reveal')
  wordleRevealDiv.appendChild(wordleDisplay)
  if (gameProgress.inProgress === false) {
    wordleDisplay.textContent = gameProgress.wordle
  }
}
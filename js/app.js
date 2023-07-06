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
  const gameGrid = document.getElementById('game-grid')
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
      // characterKey.addEventListener('click', ) // <-- revisit to add function on 'click'
      keyboardRow.append(characterKey)
    }
  }
}




function generateGame () {
  generateKeys()
  generateGrid()
}

generateGame()
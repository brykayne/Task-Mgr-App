document.onreadystatechange = function() {
  if(document.readyState === 'interactive') {
    main();
  }
}

function main() {
  let boards = getBoards();
  let appData = {
    boards: boards,
    selectedBoard: boards[Object.keys(boards)[0]],
    selectedBoardEl: null,
    selectedColumn: null,
    selectedColumnEl: null,
    selectedCard: null,
    selectedCardEl: null,
    myBoardsListEl: document.getElementById('myBoardsListEl')
  };
  setMyBoardsListView(appData.boards, appData.myBoardsListEl);
  updateSelectedBoardInModel(appData.selectedBoard.name, appData.myBoardsListEl.firstElementChild, appData);
  setListeners(appData);
}

function setListeners(appData) {
  document.getElementById('myBoardsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let boardName = event.target.myboardsInput.value;
    if(!appData.boards.hasOwnProperty(boardName)) {
      let myBoard = addBoardToBoardsInModel(
        createBoard(boardName),
        appData.boards);
        let myColumn = addColumnToBoardInModel(createColumn('To Do', 0), appData.boards, myBoard);
        let myBoardEl = addBoardToMyBoardsListView(myBoard);
        updateSelectedBoardInModel(myBoard.name, myBoardEl, appData);
        event.target.reset();
      } else {
        alert('You already have a board with this name!');
      }
  });

  document.getElementById('cardForm').addEventListener('submit', function(event) {
    event.preventDefault();
    debugger;

    let cardRank = appData.selectedBoard.cards.length;

    let card = addCardToBoardInModel(
      createCard(event.target.cardInput.value, cardRank),
      appData.selectedBoard.cards);
      let cardColumn = card.column;
      updateChangedColumnCardsToView([cardToCardEl(card, cardRank)], cardColumn);
      event.target.reset();
    });

  document.getElementById('myBoardsListEl').addEventListener('click', function(event) {
    event.preventDefault();
    let targetEl = event.target;
    if(targetEl.hasAttribute('data-el-type') && targetEl.getAttribute('data-el-type') === 'myBoardsListEl') {
      updateSelectedBoardInModel(targetEl.getAttribute('data-board-name'), targetEl, appData);
    }
  });

  document.getElementById('boardDeleteBtn').addEventListener('click', function(event) {
    event.preventDefault();
    if(Object.keys(appData.boards).length > 1) {
      delete appData.boards[appData.selectedBoard.name];
      addClass(appData.selectedBoardEl, 'fadeout-el');
      window.setTimeout(function() {
        appData.selectedBoardEl.remove();
        let myBoardEl = document.getElementById('myBoardsListEl').firstElementChild;
        updateSelectedBoardInModel(Object.keys(appData.boards)[0], myBoardEl, appData);
      }, 500)
    } else {
      alert('You only have one board left! Do not delete it!');
    }
  });

  document.getElementById('addColumnBtn').addEventListener('click', function(event) {
    event.preventDefault();
    let columnPos = appData.selectedBoard.columns.length;
    let column = addColumnToBoardInModel(createColumn('Rename Me', columnPos),
    appData.boards, appData.selectedBoard);
    addColumnToBoardView(column, columnPos);
  });

  document.getElementById('removeColumnBtn').addEventListener('click', function(event) {
    event.preventDefault();

    if (appData.selectedColumnEl != null && appData.selectedColumn != null) {

      let columns = appData.selectedBoard.columns;
      let cards = appData.selectedBoard.cards;
      let selectedColumnEl = appData.selectedColumnEl;
      let selectedColumnPos = appData.selectedColumn.columnPosition;
      let currentColumns = getCurrentColumns(columns);

      if(Object.keys(currentColumns).length > 1) {
        removeColumnFromBoardInModel(selectedColumnPos, columns);
        let newColumnPos = updateRemovedColumnCardsInModel(cards, selectedColumnPos,
          getCurrentColumns(columns));
          let ulId = "ul" + selectedColumnEl.getAttribute('data-ar-pos');
          let updatedCardsElArr = Array.from(appData.selectedColumnEl.children[ulId].children);
          updateChangedColumnCardsToView(updatedCardsElArr, newColumnPos);
          addClass(appData.selectedColumnEl, 'fadeout-el');
          window.setTimeout(function() {
            appData.selectedColumnEl.remove();
            let myColumnEl = document.getElementById('boardColumns').firstElementChild;
            updateSelectedColumnInModel(newColumnPos, myColumnEl, appData);
          })
        } else {
          alert("You only have one column left! Do not delete it!")
        }
      }
    });

  document.getElementById('cardDeleteBtn').addEventListener('click', function(event) {
    event.preventDefault();
    if (appData.selectedCardEl != null && appData.selectedCard != null) {
      deleteCard(appData.selectedCardEl.getAttribute('data-ar-pos'),
      appData.selectedCardEl,
      appData.selectedBoard.cards);
      appData.selectedCardEl = null;
      appData.selectedCard = null;
    }
  });

  document.getElementById('selectedBoardEl').addEventListener('click', function(event) {

    let targ = event.target;

    if(targ.hasAttribute('data-el-type')) {

      switch(targ.getAttribute('data-el-type')) {
        case 'cardEl' :
        selectCardInModel(targ.getAttribute('data-ar-pos'), targ, appData);
        break;
        case 'columnEl' :
        updateSelectedColumnInModel(targ.getAttribute('data-ar-pos'), targ, appData);
        break;
      }
    }
  });

  document.getElementById('cardForwardBtn').addEventListener('click', function(event) {
    event.preventDefault();
    if (appData.selectedCardEl != null && appData.selectedCard != null) {
      let direction = true;
      let nextColumn = moveCardInModel(direction, appData.selectedCard,
        getCurrentColumns(appData.selectedBoard.columns));
        updateChangedColumnCardsToView([appData.selectedCardEl], nextColumn);
      }
  });

  document.getElementById('cardBackwardBtn').addEventListener('click', function(event) {
    event.preventDefault();
    if (appData.selectedCardEl != null && appData.selectedCard != null) {
      let direction = false;
      let nextColumn = moveCardInModel(direction, appData.selectedCard,
        getCurrentColumns(appData.selectedBoard.columns));
        updateChangedColumnCardsToView([appData.selectedCardEl], nextColumn);
      }
  });

  document.getElementById('boardColumns').addEventListener('dblclick', function(event) {
    event.preventDefault();
    debugger;
    let targ = event.target;
    let columnTitleEl = document.getElementById(targ.id);

    if(targ.hasAttribute('data-el-type')) {

      switch(targ.getAttribute('data-el-type')) {
        case 'columnTitle' :
          toggleColumnTitleToEditView(targ.id);
          debugger;
          //let newColumnTitle = getColumnTitleInputValueFromView(targ.id);
          //pdateColumnTitleInModel(newColumnTitle, targ.id, boardName, appData);
        break;
      }
    }
  });

  document.getElementById('columnForm').addEventListener('submit', function(event) {
    event.preventDefault();
    debugger;
    let targ = event.target;
    let colId = targ.parentElement.id;
    let newColumnTitle = event.target.columnTitleInput.value;

    if(!appData.selectedBoard.hasOwnProperty(newColumnTitle)) {
      updateColumnTitleInModel(newColumnTitle, colId, appData);
    } else {
      alert("You already have a column with that name, choose again.");
    }

  });

  document.getElementById('boardsExpand').addEventListener('click', function(event) {
    event.preventDefault();
    let myBoardsEl = document.getElementById('myBoardsNav');
    if (myBoardsEl.style.display === '') {
      myBoardsEl.style.display = 'inline-block';
      addClass(myBoardsEl, 'myboards-nav-mobile');
    }
    else if (myBoardsEl.style.display !== 'none') {
      myBoardsEl.style.display = 'none';
    }
    else {
      myBoardsEl.style.display = 'inline-block';
      addClass(myBoardsEl, 'myboards-nav-mobile');
    }

  });
};

function getBoards() {
  let boards =
  {
    'Agenda':
    {
      name: 'Agenda',
      cards:[
        {name: 'Clean Room', rank: 0, column: 0, isComplete: false, isDeleted: false},
        {name: 'Take a Shower', rank: 1, column: 1, isComplete: false, isDeleted: false},
        {name: 'Haircut', rank: 2, column: 2, isComplete: false, isDeleted: false},
        {name: 'Cook Dinner', rank: 3, column: 0, isComplete: false, isDeleted: false}
      ],
      isDeleted: false,
      columns: [
        {columnName: 'To Do', columnPosition: 0, columnIsDeleted: false},
        {columnName: 'In Progress', columnPosition: 1, columnIsDeleted: false},
        {columnName: 'Done', columnPosition: 2, columnIsDeleted: false}
      ]
    }
  };

  return boards;
}

//////////////////////////////////////////////
//////////////CREATE FUNCTIONS////////////////
//////////////////////////////////////////////

function createBoard(name) {
  return {
    name: name,
    cards:[],
    isDeleted: false,
    columns: [],
  }
};

function createColumn(name, columnPos) {
  return {
    columnName: name,
    columnPosition: columnPos,
    columnIsDeleted: false
  }
};

function createCard(name, rank) {
  return {
    name: name,
    rank: rank,
    column: 0,
    isDeleted: false,
  }
};

//////////////////////////////////////////////
//////////////MYBOARDS LIST FUNCTIONS/////////
//////////////////////////////////////////////

//Purpose: To set the board items in the myBoards element
function setMyBoardsListView(boards, myBoardsListEl) {
  for(let board in boards) {
    myBoardsListEl.appendChild(boardToMyBoardListEl(boards[board]));
  }
};

//Purpose: To make a 'myBoards' html element
function boardToMyBoardListEl(board) {
  let boardEl = document.createElement('li');
  boardEl.innerHTML = board.name;
  boardEl.setAttribute('data-board-name', board.name);
  boardEl.setAttribute('data-el-type', 'myBoardsListEl')
  addClass(boardEl, "myboards-el");
  return boardEl;
};

//Purpose: To add board to boards in appData
function addBoardToBoardsInModel(board, boards) {
  boards[board.name] = board;
  return boards[board.name];
};

//Purpose: To add a board to the myBoards List view on the left nav (doesn't touch model)
function addBoardToMyBoardsListView(board) {
  let myBoardsListEl = document.getElementById('myBoardsListEl');
  let myBoardEl = boardToMyBoardListEl(board);
  addClass(myBoardEl, 'fade-in');
  myBoardsListEl.appendChild(myBoardEl);
  return myBoardEl;
};

//////////////////////////////////////////////
///////UPDATE SELECTED BOARD FUNCTIONS////////
//////////////////////////////////////////////

//Purpose: To update appData with the selectedBoard, then trigger view update
function updateSelectedBoardInModel(boardName, selectedBoardEl, appData) {
  appData.selectedCardEl = null;
  appData.selectedCard = null;
  appData.selectedColumnEl = null;
  appData.selectedColumn = null;

  let prevSelectedBoardEl = appData.selectedBoardEl;

  appData.selectedBoard = appData.boards[boardName];
  appData.selectedBoardEl = selectedBoardEl;

  updateSelectedMyBoardListElView(prevSelectedBoardEl, selectedBoardEl);
  updateSelectedBoardView(appData.selectedBoard);
};

//Purpose: Updates the classes of myBoardEl's when selected
function updateSelectedMyBoardListElView(prevEl, selectedBoardEl) {
  if(prevEl != null) {
    removeClass(prevEl, 'active-board-item-selected');
  }
  addClass(selectedBoardEl, 'active-board-item-selected');
};

//Purpose: To update the view based on the selected Board
function updateSelectedBoardView(board) {
  let selectedBoardTitle = document.getElementById('selectedBoardTitle');
  selectedBoardTitle.innerHTML = board.name;
  let boardColumnsEl = document.getElementById('boardColumns');
  boardColumnsEl.innerHTML = '';
  updateSelectedBoardColumnsView(board);
  updateSelectedBoardColumnsCardsView(board);
};

//Purpose: To add cards to the view if their column has changed
function updateChangedColumnCardsToView(updatedCardsElArr, newColumnPos) {
  let newColumnEl = document.getElementById('ul' + newColumnPos);
  updatedCardsElArr.forEach((cardEl, i) => {
    addClass(cardEl, 'fade-in');
    newColumnEl.appendChild(cardEl);
  });
};

//Purpose: To add cards to view based on their appData.cards.card.column
function updateSelectedBoardColumnsCardsView(board, selectedColumnEl) {
  let cardsToAddToView = [];
  let ulsEl = [];

  for (i = 0; i < board.columns.length; i++) {
    if (board.columns[i].columnIsDeleted === false) {
      var newUlEl = document.getElementById('ul' + i);
      ulsEl.push(newUlEl);
    };
  };

  for (var i = 0, len = board.columns.length; i < len; i++) {
    for (var j = 0, len2 = board.cards.length; j < len2; j++) {
      if (board.columns[i].columnPosition === board.cards[j].column) {
        cardsToAddToView.push(board.cards[j])
        len2=board.cards.length;
      };
    };
  };

  // logCardsToAddToView(cardsToAddToView)
  for (var i = 0, len = cardsToAddToView.length; i < len; i++) {
    if (cardsToAddToView[i].isDeleted === false) {
      for (var j = 0, len2 = ulsEl.length; j < len2; j++) {
        if (('ul' + cardsToAddToView[i].column) === ulsEl[j].id) {
          ulsEl[j].appendChild(cardToCardEl(cardsToAddToView[i], cardsToAddToView[i].rank));
          len2=ulsEl.length;
        };
      };
    };
  };
};

//Purpose: To add columns to view based on their appData.boards.columns
function updateSelectedBoardColumnsView(board) {
  let boardColumnsEl = document.getElementById('boardColumns');
  boardColumnsEl.innerHTML = '';
  for(let column in board.columns) {
    if (board.columns[column].columnIsDeleted === false) {
      boardColumnsEl.appendChild(columnToColumnEl(board.columns[column], board.columns[column].columnPosition));
    };
  };
};

//////////////////////////////////////////////
////////////BOARD COLUMN FUNCTIONS////////////
//////////////////////////////////////////////

//Purpose: To create a board column HTML element
function columnToColumnEl(column, columnPosition) {
  let columnEl = document.createElement('div');
  let formEl = document.createElement('form');
  let columnTitleEl = document.createElement('input');
  let columnCardListEl = document.createElement('ul');
  columnEl.setAttribute('data-el-type', 'columnEl');
  columnEl.setAttribute('id', 'column' + columnPosition);
  columnEl.setAttribute('data-ar-pos', columnPosition);
  formEl.setAttribute('id', 'columnForm');
  formEl.setAttribute('type', 'text');
  formEl.setAttribute('autocomplete', 'off');
  columnTitleEl.setAttribute('data-el-type', 'columnTitle');
  columnTitleEl.setAttribute('id', 'title' + columnPosition);
  columnTitleEl.disabled = true;
  columnTitleEl.name = 'columnTitleInput';
  columnCardListEl.setAttribute('data-el-type', 'columnCardListEl');
  columnCardListEl.setAttribute('id', 'ul' + columnPosition);
  addClass(columnCardListEl, 'column-el');
  addClass(columnTitleEl, 'column-header');
  addClass(columnEl, 'column');
  columnTitleEl.value = column.columnName;

  formEl.appendChild(columnTitleEl);
  columnEl.appendChild(formEl);
  columnEl.appendChild(columnCardListEl);
  return columnEl;
};

//Purpose: to add column to board in model
function addColumnToBoardInModel(column, boards, board) {
  boards[board.name].columns.push(column);
  return column;
};


//Purpose: to remove column from board in model
function removeColumnFromBoardInModel(column, columns) {
  columns[column].columnIsDeleted = true;
};

//Purpose: to add column to board view without selecting a new board
function addColumnToBoardView(column, columnPosition) {
  let boardColumnsEl = document.getElementById('boardColumns');
  let columnEl = columnToColumnEl(column, columnPosition);
  addClass(columnEl, 'fade-in');
  boardColumnsEl.appendChild(columnEl);
  window.setTimeout(function(){removeClass(columnEl, 'fade-in')}, 200);
  return columnEl;
};

//Purpose: To update the selected card in AppData, then trigger an update to the view
function updateSelectedColumnInModel(columnPos, columnEl, appData) {
  let prevSelectedColumnEl = appData.selectedColumnEl;
  appData.selectedColumn = appData.selectedBoard.columns[columnPos];
  appData.selectedColumnEl = columnEl;
  updateSelectedColumnView(prevSelectedColumnEl, columnEl);
};

//Purpose: To update the selected column view
function updateSelectedColumnView(prevColumnEl, columnEl) {
  if(prevColumnEl != null) {
    removeClass(prevColumnEl, 'active-column');
  }
  addClass(columnEl, 'active-column');
};

function toggleColumnTitleToEditView(columnId) {
  let columnTitleEl = document.getElementById(columnId);
  if (columnTitleEl.disabled === true) {
    columnTitleEl.disabled = false;
  } else {
    columnTitleEl.disabled = true;
  }
}

function getColumnTitleInputValueFromView(columnId) {
  return document.getElementById(columnId).value;
}

function updateColumnTitleInModel(newColumnTitle, columnTitleId, appData) {
  let currentColumns = getCurrentColumns(appData.selectedBoard.columns);
  for (let i = 0; i<currentColumns.length; i++) {
    break;
  }
}

//////////////////////////////////////////////
////////////////CARD FUNCTIONS////////////////
//////////////////////////////////////////////

//Purpose: to create a card html element
function cardToCardEl(card, cardRank) {
  let cardEl = document.createElement('li');
  cardEl.innerHTML = card.name;
  cardEl.setAttribute('data-ar-pos', cardRank);
  cardEl.setAttribute('data-el-type', 'cardEl');
  addClass(cardEl, 'card-el');
  return cardEl;
};

//Purpose: to add a card to a board in the model.
function addCardToBoardInModel(card, cards) {
  cards.push(card);
  return cards[cards.length - 1];
};

//Purpose: Set the card that's selected in AppData, then update the view
function selectCardInModel(cardRank, cardEl, appData) {
  let prevSelectedCardEl = appData.selectedCardEl;

  appData.selectedCard = appData.selectedBoard.cards[cardRank];
  appData.selectedCardEl = cardEl;

  updateSelectedCardView(prevSelectedCardEl, cardEl);
};

//Purpose: Update selected card element view
function updateSelectedCardView(prevCardEl, cardEl) {
  if(prevCardEl != null) {
    removeClass(prevCardEl, 'active-card');
  }
  addClass(cardEl, 'active-card');
};

//Purpose: Marks a card as deleted and applies a fadeout class
function deleteCard(cardRank, cardEl, cards) {
  cards[cardRank].isDeleted = true;
  addClass(cardEl, 'fadeout-el');
  window.setTimeout(function(){cardEl.remove();},500);
};

//Purpose: Increase or decrease a card's column number depending on
//which direction the user moves the card (forward or backward)
// True = forwards; False = backwards
function moveCardInModel(direction, card, currentColumns) {
  let cardColumn = card.column;
  //true = forward
  if (direction === true) {
    let nextColumn;
    let currentColsEndPos = currentColumns.length;
    for (let p = 0; p < currentColumns.length; p++) {
      if(cardColumn > currentColsEndPos) {
        nextColumn = currentColumns[currentColsEndPos - 1].columnPosition;
        break;
      }
      if(currentColumns[p].columnPosition > cardColumn) {
        nextColumn = currentColumns[p].columnPosition;
        break;
      }

      if((currentColumns[p].columnPosition === cardColumn) && (p === currentColsEndPos - 1)) {
        nextColumn = currentColumns[p].columnPosition;
        break;
      }
    }
    card.column = nextColumn;
    return nextColumn;
  }
  //false = backwards
  if (direction === false) {
    let nextColumn = currentColumns.length-1;
    for (let i = nextColumn; i >= -1; i--) {
      if (i === -1) {
        nextColumn = 0;
        break;
      }
      if (currentColumns[i].columnPosition < cardColumn) {
        nextColumn = currentColumns[i].columnPosition;
        break;
      }
    }
    card.column = nextColumn
    return nextColumn;
  }
};

//Purpose: Update cards who's column has been removed in the model
function updateRemovedColumnCardsInModel(cards, column, currentColumns) {
  let updatedCards = [];
  let newColumnPos;
  for (let i=0; i<cards.length; i++) {
    if(cards[i].column === column && cards[i].column >= 0) {
      let z = currentColumns.length - 1;
      while(z >= 0) {
        if(currentColumns[z].columnIsDeleted === false) {
          cards[i].column = currentColumns[z].columnPosition;
          newColumnPos = cards[i].column;
        }
        z--;
      };
      updatedCards.push(cards[i]);
    } else if (cards[i].column === column && cards[i].column <= 0) {
      cards[i].column = 0;
    };
  };
  return newColumnPos;
};

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
    // boardsToView(appData);
    // selectedBoardToView(appData);
}

function setListeners(appData) {
    document.getElementById('myBoardsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let boardName = event.target.myboardsInput.value;
        if(!appData.boards.hasOwnProperty(boardName)) {
            let myBoard = addBoardToBoardsInModel(
                createBoard(boardName),
                appData.boards);
            let myBoardEl = addBoardToMyBoardsListView(myBoard);
            updateSelectedBoardInModel(myBoard.name, myBoardEl, appData);
            event.target.reset();
        } else {
            alert('You already have a board with this name!');
        }
    });

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // addCard(createCard(event.target.cardInput.value), appData);
        let boardCard = addBoardCardToBoard(
            createCard(event.target.cardInput.value),
            appData.selectedBoard.cards);
        let cardPos = appData.selectedBoard.cards.length - 1;
        //might want to change cardPos to column number and cardPos in column
        let boardCardEl = addBoardCardToView(boardCard, cardPos);
        event.target.reset();
    });

    document.getElementById('myBoardsListEl').addEventListener('click', function(event) {
        event.preventDefault();
        let targetEl = event.target;
        if(targetEl.hasAttribute('data-el-type') && targetEl.getAttribute('data-el-type') === 'myBoardsListEl') {
            updateSelectedBoardInModel(targetEl.getAttribute('data-board-name'), targetEl, appData);
        }
    });

    document.getElementById('selectedBoardEl').addEventListener('click', function(event) {

        let targ = event.target;
        if(targ.hasAttribute('data-el-type')) {

            switch(targ.getAttribute('data-el-type')) {
                case 'boardCardEl' :
                    selectCard(targ.getAttribute('data-ar-pos'), targ, appData);
                    break;
                case 'boardCardName' :
                    selectCard(targ.parentElement.getAttribute('data-ar-pos'),
                    targ.parentElement,
                    appData);
                    break;
                case 'boardCardDeleteBtn' :
                    deleteCard(targ.parentElement.getAttribute('data-ar-pos'),
                    targ.parentElement,
                    appData.selectedBoard.cards);
                    break;
            }
        }
    });

    document.getElementById('selectedBoardEl').addEventListener('click', function(event) {
        let targ = event.target;

        if(targ.hasAttribute('data-el-type') &&
            targ.getAttribute('data-el-type') === 'boardCardDeleteBtn' &&
            Object.keys(appData.boards).length > 1) {
                delete appData.boards[appData.selectedBoard.name];
                addClass(appData.selectedBoardEl, 'fadeout-el');
                window.setTimeout(function() {
                    appData.selectedBoardEl.remove();
                    let myBoardEl = document.getElementById('myBoardsListEl').firstElementChild;
                    updateSelectedBoardInModel(Object.keys(appData.boards[0], myBoardEl, appData));
                }, 500)
            } else {
                alert('You only have one board left! Do not delete it!');
            }
    });

    document.getElementById('cardForwardBtn').addEventListener('click', function(event) {
        event.preventDefault();
        console.log('forward clicked!');
        moveCardForward(appData.selectedCardEl, appData);
    });

    document.getElementById('cardBackwardBtn').addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Backward clicked!');
        moveCardBackward(appData.selectedCardEl, appData)
    });
};

function getBoards() {
    let boards =
    {
        'Agenda':
        {
            name: 'Agenda',
            cards:[
                {name: '1 Clean room.', rank: 0, column: 0, isComplete: false, isDeleted: false},
                {name: '2 Clean room.', rank: 0, column: 1, isComplete: false, isDeleted: false},
                {name: '3 Clean room.', rank: 0, column: 2, isComplete: false, isDeleted: false},
                {name: '4 Clean room.', rank: 0, column: 0, isComplete: false, isDeleted: false}
            ],
            isDeleted: false,
            columns: [
                {columnName: 'To Do', columnPosition: 0, columnIsDeleted: false},
                {columnName: 'In Progress', columnPosition: 1, columnIsDeleted: false},
                {columnName: 'Done', columnPosition: 2, columnIsDeleted: false}
            ]
        },
        'List of Things':
        {
            name: 'List of Things',
            cards:[
                {name: 'Do other things.', column: 0, rank: 0, isComplete: false, isDeleted: false},
                {name: 'In progresssss.', column: 1, rank: 0, isComplete: false, isDeleted: false},
                {name: 'Done!', column: 2, rank: 0, isComplete: true, isDeleted: false}
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

/*
Purpose: Create a board with the specified key/values
Consumes: Name of a board
Produces: a board object
Action: none
*/
function createBoard(name) {
    return {
        name: name,
        cards:[],
        isDeleted: false,
        columns: [],
    }
}


/*
Purpose: Create a column  with the specified key/values
Consumes: Name of a column, position of the column (integer)
Produces: a column object
Action: none
*/
function createColumn(name, columnPos) {
    return {
        columnName: name,
        columnPosition: columnPos,
        columnIsDeleted: false
    }
}

/*
Purpose: Create a card with the specified key/values
Consumes: Name of a card
Produces: a card object
Action: none
Definitions:
--Rank: Vertical order of card.
--Column: column number to which a card belongs.
*/
function createCard(name) {
    return {
        name: name,
        rank: 0,
        column: 0,
        //where 0 = starting, 1 = in progress, 2 = complete
        // isComplete: false,
        isDeleted: false,
    }
}


//////////////////////////////////////////////
//////////////MYBOARDS LIST FUNCTIONS/////////
//////////////////////////////////////////////

/*
MyBoardsList is the list that is displayed on the left nav, it is
an unordered list of the boards that the user has created. It pulls
from appData.boards. Each list element is updated if the user selects
it.
*/


/*
Purpose: To set the board items in the myBoards element
Consumes: a boards object, and a myBoards Element
Produces: nothing
Action: creates a myBoard element for each board and
adds it to the myBoard element
*/
function setMyBoardsListView(boards, myBoardsListEl) {
    for(let board in boards) {
        myBoardsListEl.appendChild(boardToMyBoardListEl(boards[board]));
    }
}

/*
Purpose: To make a 'myBoards' html element
Consumes: a board board object
Produces: an html board element (list item)
*/
function boardToMyBoardListEl(board) {
    let boardEl = document.createElement('li');
    boardEl.innerHTML = board.name;
    boardEl.setAttribute('data-board-name', board.name);
    boardEl.setAttribute('data-el-type', 'myBoardsListEl')
    addClass(boardEl, "myboards-el");
    return boardEl;
}

/*
Purpose: To add board to boards in appData
Consumes: a board object, a boards object (all the boards)
Produces: board object from appData.boards[name]
*/
function addBoardToBoardsInModel(board, boards) {
    boards[board.name] = board;
    return boards[board.name];
}

/*
Purpose: To add a board to the myBoards List on the left nav (doesn't touch model)
Consumes: a board object
Produces: a myBoards List item (html element)
*/
function addBoardToMyBoardsListView(board) {
    let myBoardsListEl = document.getElementById('myBoardsListEl');
    let myBoardEl = boardToMyBoardListEl(board);
    addClass(myBoardEl, 'fade-in');
    myBoardsListEl.appendChild(myBoardEl);
    return myBoardEl;
}

/*
Purpose: To update appData with the selectedBoard, then trigger view update
Consumes: a board name, the selected myBoards List element, and appData
Produces: nothing
Actions:
-- Resets selectedCard and selectedCardEl in appData
-- Sets selectedBoard and selectedBoardEl in appData
-- Invokes updateSelectedMyBoardListElView which modifies CSS classes/updates view
-- Invokes updateSelectedBoardView which updates the board view based off of
appData.selectedBoard
*/
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
}



//////////////////////////////////////////////
///////UPDATE SELECTED BOARD FUNCTIONS////////
//////////////////////////////////////////////

/*
Purpose: To update the view based on the selected Board
Consumes: a board object
Produces: nothing
Actions:
-- Sets columns to blank
-- Sets board title to blank
-- Updates board title
-- Updates cards in columns based off of their column (board.cards[card].column)
*/
function updateSelectedBoardView(board) {


    //Display board title
    let selectedBoardTitle = document.getElementById('selectedBoardTitle');
    selectedBoardTitle.innerHTML = board.name;
    //set board columns to nothing
    let boardColumnsEl = document.getElementById('boardColumns');
    boardColumnsEl.innerHTML = '';
    updateSelectedBoardColumnsView(board);
    updateSelectedBoardColumnsCardsView(board);

}

function updateSelectedBoardColumnsCardsView(board) {
    let boardColumns = board.columns;
    let boardCards = board.cards;
    let cardsToAdd = [];

    let columnsEl = [];
    for (i = 0; i < board.columns.length; i++) {
        columnsEl[i] = document.getElementById('column' + i);
    }

    for (var i = 0, len = boardColumns.length; i < len; i++) {
        for (var j = 0, len2 = boardCards.length; j < len2; j++) {
            if (boardColumns[i].columnPosition === boardCards[j].column) {
                cardsToAdd.push(boardCards[j])
                len2=boardCards.length;
            }
        }
    }

    for (var i = 0, len = cardsToAdd.length; i < len; i++) {
        console.log("cardName:"+cardsToAdd[i].name+" pos:"+ cardsToAdd[i].column);
    }

    for (var i = 0, len = cardsToAdd.length; i < len; i++) {
        for (var j = 0, len2 = columnsEl.length; j < len2; j++) {
            if (('column' + cardsToAdd[i].column) === columnsEl[j].id) {
                columnsEl[j].appendChild(cardToCardEl(cardsToAdd[i], i));
                len2=columnsEl.length;
            }
        }
    }

    // Column example: {columnName: 'To Do', columnPosition: 0, columnIsDeleted: false},
    // Card example: {name: '1 Clean room.', rank: 0, column: 0, isComplete: false, isDeleted: false}
    // columnsEl[j].appendChild(cardToCardEl(board.cards[i], card));

}

function updateSelectedBoardColumnsView(board) {
    let boardColumnsEl = document.getElementById('boardColumns');
    boardColumnsEl.innerHTML = '';
    for(let column in board.columns) {
        if (board.columns[column].columnIsDeleted === false) {
            boardColumnsEl.appendChild(columnToColumnEl(board.columns[column], board.columns[column].columnPosition));
        };
    }
}

//////////////////////////////////////////////
////////////BOARD COLUMN FUNCTIONS////////////
//////////////////////////////////////////////

/*
Purpose: To create a board column HTML element
Consumes: a column object, a desired column position (not needed?)
Produces: a column html element
*/
function columnToColumnEl(column, columnPosition) {
    let columnEl = document.createElement('div');
    let columnTitleEl = document.createElement('h2');
    let columnCardListEl = document.createElement('ul');

    columnEl.setAttribute('data-el-type', 'columnEl');
    columnEl.setAttribute('id', 'column' + columnPosition);
    columnTitleEl.setAttribute('data-el-type', 'columnTitle');
    columnCardListEl.setAttribute('data-el-type', 'columnCardListEl');
    columnCardListEl.setAttribute('id', columnPosition);

    addClass(columnCardListEl, 'column-el');
    addClass(columnTitleEl, 'column-header');
    addClass(columnEl, 'column');

    columnTitleEl.innerHTML = column.columnName;

    columnEl.appendChild(columnTitleEl);
    columnEl.appendChild(columnCardListEl);

    return columnEl;

}

/*
Purpose: to add column to board in model
*/

function addColumnToBoardInModel(board, column) {

}

/*
Purpose: to add column to board view
*/
function addColumnToBoardView(board) {

}

/*
Purpose: update the selected column in the model and trigger view changes
*/

function updateSelectedColumnInModel(columnName, selectedColumnEl, appData) {

}


function cardToCardEl(card, arRank) {
    let cardEl = document.createElement('li');
    cardEl.innerHTML = card.name;
    cardEl.setAttribute('data-ar-pos', arRank);
    cardEl.setAttribute('data-el-type', 'boardCardEl');
    addClass(cardEl, 'card-el');
    return cardEl;
}



function addBoardCardToBoard(boardCard, cards) {
    cards.push(boardCard);
    return cards[cards.length - 1];
}

function addBoardCardToView(boardCard, arPos) {
    let selectedBoardEl = document.getElementById('selectedBoardEl');
    let boardCardEl = cardToCardEl(boardCard, arPos);
    addClass(boardCardEl, 'fade-in');
    selectedBoardEl.appendChild(boardCardEl);
    window.setTimeout(function(){removeClass(boardCardEl, 'fade-in')}, 200);
    return boardCardEl;
}



//Need to check these classes...

/*
Purpose: Updates the classes of myBoardEl's when selected
*/
function updateSelectedMyBoardListElView(prevEl, selectedBoardEl) {
    if(prevEl != null) {
        removeClass(prevEl, 'active-board-item-selected');
    }
    addClass(selectedBoardEl, 'active-board-item-selected');
}

function selectCard(cardPos, cardEl, appData) {
    let prevCardEl = appData.selectedCardEl;

    appData.selectedCard = appData.selectedCard.cards[cardPos];
    appData.selectedCardEl = cardEl;

    updateSelectedCardView(prevCardEl, cardEl);
}

function updateSelectedCardView(prevCardEl, cardEl) {
    if(prevCardEl != null) {
        removeClass(prevCardEl, 'active-board-card-selected');
    }
    addClass(cardEl, 'active-board-card-selected');
}


function deleteCard(cardPos, cardEl, cards) {
    cards[cardPos].isDeleted = true;
    addClass(cardEl, 'fadeout-el');
    window.setTimeout(function(){cardEl.remove();},500);
}

function moveCardForward(cardEl, appData) {

    var currentCardPos = appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column;
    //hard coding column count in if... for now...
    if (currentCardPos <= 1) {
        currentCardPos += 1;
    } else if (currentCardPos < 0) {
        currentCardPos = 0
    } else if (currentCardPos >= 3) {
        currentCardPos = 2;
    };
    appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column = currentCardPos;
    selectedBoardToView(appData)
}

function moveCardBackward(cardEl, appData) {
    var currentCardPos = appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column;
    //hard coding column count for now...
    if (currentCardPos > 0) {
        currentCardPos -= 1;
    } else if (currentCardPos <= 0) {
        currentCardPos = 0;
    };
    appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column = currentCardPos;
    selectedBoardToView(appData)
}

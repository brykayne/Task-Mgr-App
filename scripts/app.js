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
    /*
    Purpose: Listens for submit on myBoardsForm. If submitted, checks to see if board name
    already exists. If it does, alert pops up and user cannot create board. if board name
    does not exist, a board is created in appData and the view is updated as well.
    */
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

    /*
    Purpose: To listen for submission of card form, if card is added, add card to
    model and then add the card to the view.
    */
    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // addCard(createCard(event.target.cardInput.value), appData);
        let card = addCardToBoardInModel(
            createCard(event.target.cardInput.value),
            appData.selectedBoard.cards);
        let cardRank = appData.selectedBoard.cards.length - 1;
        let cardColumn = card.column;
        //might want to change cardPos to column number and cardPos in column
        let cardEl = addCardToView(card, cardRank, cardColumn, appData.selectedBoard.columns);
        event.target.reset();
    });


    document.getElementById('myBoardsListEl').addEventListener('click', function(event) {
        event.preventDefault();
        let targetEl = event.target;
        if(targetEl.hasAttribute('data-el-type') && targetEl.getAttribute('data-el-type') === 'myBoardsListEl') {
            updateSelectedBoardInModel(targetEl.getAttribute('data-board-name'), targetEl, appData);
        }
    });

    //All Board Listeners
    document.getElementById('boardHeader').addEventListener('click', function(event) {
        event.preventDefault;

        //DeleteBoard

        //AddColumn

        //Remove Column (if one remaining, do not delete)
    })

    //All Card action Listeners
    document.getElementById('cardButtons').addEventListener('click', function(event) {
        event.preventDefault;

        //Card forward

        //Card Backward

        //Card Delete

    })

    //Select/Edit Card, Select/Edit Column

    document.getElementById('')


    document.getElementById('selectedBoardEl').addEventListener('click', function(event) {

        let targ = event.target;

        if(targ.hasAttribute('data-el-type')) {

            switch(targ.getAttribute('data-el-type')) {
                case 'cardEl' :
                    selectCardInModel(targ.getAttribute('data-ar-pos'), targ, appData);
                    break;
                // case 'cardName' :
                //     selectCardInModel(targ.parentElement.getAttribute('data-ar-pos'),
                //     targ.parentElement,
                //     appData);
                //     break;
                case 'cardDeleteBtn' :
                debugger;
                    deleteCard(targ.parentElement.getAttribute('data-ar-pos'),
                    targ.parentElement,
                    appData.selectedBoard.cards);
                    break;
            }
        }
    });

    // document.getElementById('selectedBoardEl').addEventListener('click', function(event) {
    //     let targ = event.target;
    //
    //     if(targ.hasAttribute('data-el-type') &&
    //         targ.getAttribute('data-el-type') === 'boardCardDeleteBtn' &&
    //         Object.keys(appData.boards).length > 1) {
    //             delete appData.boards[appData.selectedBoard.name];
    //             addClass(appData.selectedBoardEl, 'fadeout-el');
    //             window.setTimeout(function() {
    //                 appData.selectedBoardEl.remove();
    //                 let myBoardEl = document.getElementById('myBoardsListEl').firstElementChild;
    //                 updateSelectedBoardInModel(Object.keys(appData.boards[0], myBoardEl, appData));
    //             }, 500)
    //         } else {
    //             alert('You only have one board left! Do not delete it!');
    //         }
    // });
    //
    // document.getElementById('cardForwardBtn').addEventListener('click', function(event) {
    //     event.preventDefault();
    //     console.log('forward clicked!');
    //     moveCardForward(appData.selectedCardEl, appData);
    // });
    //
    // document.getElementById('cardBackwardBtn').addEventListener('click', function(event) {
    //     event.preventDefault();
    //     console.log('Backward clicked!');
    //     moveCardBackward(appData.selectedCardEl, appData)
    // });
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
Purpose: To add a board to the myBoards List view on the left nav (doesn't touch model)
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

//////////////////////////////////////////////
///////UPDATE SELECTED BOARD FUNCTIONS////////
//////////////////////////////////////////////

/*
The purpose of these functions are to facilitate the action of user selecting a
board and displaying the board. This includes displaying columns.
*/

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

/*
Purpose: Updates the classes of myBoardEl's when selected
Consumes: a previously selected board html el and a selectedBoard html el
Produces: Nothing
Actions: Removes class from previously selected MyBoards element and adds
a class to the newly selected myBoards element.
*/
function updateSelectedMyBoardListElView(prevEl, selectedBoardEl) {
    //Need to check these classes...
    if(prevEl != null) {
        removeClass(prevEl, 'active-board-item-selected');
    }
    addClass(selectedBoardEl, 'active-board-item-selected');
}

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

    let selectedBoardTitle = document.getElementById('selectedBoardTitle');
    selectedBoardTitle.innerHTML = board.name;

    let boardColumnsEl = document.getElementById('boardColumns');
    boardColumnsEl.innerHTML = '';
    updateSelectedBoardColumnsView(board);
    updateSelectedBoardColumnsCardsView(board);
}

/*
Purpose: To add cards to view based on their appData.cards.card.column
Consumes: a board object
Produces: nothing
Actions:
-- Builds a cardsToAddToView array of cards and their respective columns by
matching cards with real column numbers that exist in the board.
-- Appends cardsToAddToView to the DOM.

This was the hardest challenge thus far, to figure out with no unique IDs, how
to determine which values match each other from the columnPosition to the card's
column.
*/
function updateSelectedBoardColumnsCardsView(board) {

    let cardsToAddToView = [];

    //get uls of columns added to board.
    let ulsEl = [];
    for (i = 0; i < board.columns.length; i++) {
        ulsEl[i] = document.getElementById('ul' + i);
    }

    for (var i = 0, len = board.columns.length; i < len; i++) {
        for (var j = 0, len2 = board.cards.length; j < len2; j++) {
            if (board.columns[i].columnPosition === board.cards[j].column) {
                cardsToAddToView.push(board.cards[j])
                len2=board.cards.length;
            }
        }
    }

    // logCardsToAddToView(cardsToAddToView)

    for (var i = 0, len = cardsToAddToView.length; i < len; i++) {
        for (var j = 0, len2 = ulsEl.length; j < len2; j++) {
            if (('ul' + cardsToAddToView[i].column) === ulsEl[j].id) {
                ulsEl[j].appendChild(cardToCardEl(cardsToAddToView[i], i));
                len2=ulsEl.length;
            }
        }
    }
}

/*
Purpose: To add columns to view based on their appData.boards.columns
Consumes: a board object
Produces: nothing
Actions:
-- Removes boardColumns from view
-- Appends columns if they are not deleted.
*/

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

//GOING TO NEED SELECT COLUMN FUNCTIONS

/*
Purpose: To create a board column HTML element
Consumes: a column object, a desired column position
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
    columnCardListEl.setAttribute('id', 'ul' + columnPosition);

    addClass(columnCardListEl, 'column-el');
    addClass(columnTitleEl, 'column-header');
    addClass(columnEl, 'column');

    columnTitleEl.innerHTML = column.columnName;

    columnEl.appendChild(columnTitleEl);
    columnEl.appendChild(columnCardListEl);

    return columnEl;

}

/*
COME BACK TO THIS POST CARD-REMAKE
Purpose: to add column to board in model
Consumes: a board object, a column object
Produces: the board in which the user added a column to
Actions: adds column to the model
*/

function addColumnToBoardInModel(column, boards, board) {
    boards[board.name].columns.push(column);
    return boards[board.name];
}

/*
COME BACK TO THIS POST CARD-REMAKE
Purpose: to add column to board view without selecting a new board
Consumes: a column object and a columnPosition (number)
Produces: a column html element
*/
function addColumnToBoardView(column, columnPosition) {
    let boardColumnsEl = document.getElementById('boardColumns');
    let columnEl = columnToColumnEl(column, columnPosition);
    addClass(columnEl, 'fade-in');
    //Additional css classes if columnn count is greater than x?
    boardColumnsEl.appendChild(columnEl);
    window.setTimeout(function(){removeClass(columnEl, 'fade-in')}, 200);
    return columnEl;
}

/*
COME BACK TO THIS POST CARD-REMAKE
Purpose: update the selected column in the model and trigger view changes
*/

function updateSelectedColumnInModel(columnName, selectedColumnEl, appData) {
//Line 261 https://github.com/wkashdan/todo-app/commit/ Oct 19th
}



//////////////////////////////////////////////
////////////////CARD FUNCTIONS////////////////
//////////////////////////////////////////////

/*
Purpose: to create a card html element
Consumes: a card object, a card's rank in the list (number)
Produces: a card html element
*/

function cardToCardEl(card, cardRank) {
    let cardEl = document.createElement('li');
    cardEl.innerHTML = card.name;
    cardEl.setAttribute('data-ar-pos', cardRank);
    cardEl.setAttribute('data-el-type', 'cardEl');
    addClass(cardEl, 'card-el');
    return cardEl;
}


/*
Purpose: to add a card to a board in the model.
Consumes: a card object, a cards array of objects (for a given board)
Produces: the card object most recently pushed to array (length - 1)
*/
function addCardToBoardInModel(card, cards) {
    cards.push(card);
    return cards[cards.length - 1];
}

/*
Purpose: to add a card to a board in the view.
Consumes: a card object, a card's column (number), and a board's columns array of objects
Produces: the card object most recently pushed to array (length - 1)
*/
function addCardToView(card, cardRank, cardColumn, columns) {
    //This isn't the best way to do this. Need to remodel because
    //I'm iterating through all columns, should just find one column that
    //matches card column.

    var boardColumnsEl = document.getElementById('boardColumns');
    let ulsEl = boardColumns.querySelectorAll('ul');
    console.log('ulsEl', ulsEl);

    let cardEl = cardToCardEl(card, cardRank);
    addClass(cardEl, 'fade-in');

    for (let j = 0, len2 = ulsEl.length; j < len2; j++) {
        if (('ul' + card.column) === ulsEl[j].id) {
            ulsEl[j].appendChild(cardEl);
            len2=ulsEl.length;
        }
    }

    window.setTimeout(function(){removeClass(cardEl, 'fade-in')}, 200);
    return cardEl;
}

/*
Purpose: Set the card that's selected in AppData, then update the view
Consumes: Card Rank (number), card html element, and appData object
Produces: nothing
Actions:
-- Sets previous card element to the previously selected card element
-- Sets selected card/selected card element based off of card rank...
MIGHT NEED FIXING
-- Updates the selected card view
*/
function selectCardInModel(cardRank, cardEl, appData) {
    let prevSelectedCardEl = appData.selectedCardEl;

    appData.selectedCard = appData.selectedBoard.cards[cardRank];
    appData.selectedCardEl = cardEl;

    updateSelectedCardView(prevSelectedCardEl, cardEl);
}

/*
Purpose: Update selected card element view
Consumes: Previous selected card html element and card html element
Produces: nothing
Actions: Removes active styling from previously selected card element
and adds styling to newly selected card element
*/

function updateSelectedCardView(prevCardEl, cardEl) {
    if(prevCardEl != null) {
        removeClass(prevCardEl, 'active-card');
    }
    addClass(cardEl, 'active-card');
}

/*
Purpose: Marks a card as deleted and applies a fadeout class
Consumes: a cardRank (number), card html element, and array of cards
Produces: nothing
Actions: Ads fadeout style to card and marks card as deleted in appData
*/
function deleteCard(cardRank, cardEl, cards) {
    cards[cardRank].isDeleted = true;
    addClass(cardEl, 'fadeout-el');
    window.setTimeout(function(){cardEl.remove();},500);
}

/*
Purpose: To move a card forward
Consumes: Card html element and appData
Produces: nothing
Actions:
-- gets current card position (NEEDS FIXING)
-- Modifies card position based on columns (NEEDS FIXING)
-- Updates appData with card's new columnPosition (NEEDS FIXING)
-- Updates board view
*/
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


/*
Purpose: To move a card backwards a column
Consumes: Card html element and appData
Produces: nothing
Actions:
-- gets current card position (NEEDS FIXING)
-- Modifies card position based on columns (NEEDS FIXING)
-- Updates appData with card's new columnPosition (NEEDS FIXING)
-- Updates board view
*/
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

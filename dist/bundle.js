/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	document.onreadystatechange = function () {
	    if (document.readyState === 'interactive') {
	        main();
	    }
	};

	function main() {
	    var boards = getBoards();
	    var appData = {
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
	    document.getElementById('myBoardsForm').addEventListener('submit', function (event) {
	        event.preventDefault();
	        var boardName = event.target.myboardsInput.value;
	        if (!appData.boards.hasOwnProperty(boardName)) {
	            var myBoard = addBoardToBoardsInModel(createBoard(boardName), appData.boards);
	            var myColumn = addColumnToBoardInModel(createColumn('To Do', 0), appData.boards, myBoard);
	            var myBoardEl = addBoardToMyBoardsListView(myBoard);
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
	    document.getElementById('cardForm').addEventListener('submit', function (event) {
	        event.preventDefault();

	        var cardRank = appData.selectedBoard.cards.length;

	        var card = addCardToBoardInModel(createCard(event.target.cardInput.value, cardRank), appData.selectedBoard.cards);
	        var cardColumn = card.column;
	        var cardEl = addCardToView(card, cardRank, cardColumn, appData.selectedBoard.columns);

	        event.target.reset();
	    });

	    document.getElementById('myBoardsListEl').addEventListener('click', function (event) {
	        event.preventDefault();
	        var targetEl = event.target;
	        if (targetEl.hasAttribute('data-el-type') && targetEl.getAttribute('data-el-type') === 'myBoardsListEl') {
	            updateSelectedBoardInModel(targetEl.getAttribute('data-board-name'), targetEl, appData);
	        }
	    });

	    document.getElementById('boardDeleteBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        if (Object.keys(appData.boards).length > 1) {
	            delete appData.boards[appData.selectedBoard.name];
	            addClass(appData.selectedBoardEl, 'fadeout-el');
	            window.setTimeout(function () {
	                appData.selectedBoardEl.remove();
	                var myBoardEl = document.getElementById('myBoardsListEl').firstElementChild;
	                updateSelectedBoardInModel(Object.keys(appData.boards)[0], myBoardEl, appData);
	            }, 500);
	        } else {
	            alert('You only have one board left! Do not delete it!');
	        }
	    });

	    document.getElementById('addColumnBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        var columnPos = appData.selectedBoard.columns.length;
	        var column = addColumnToBoardInModel(createColumn('Rename Me', columnPos), appData.boards, appData.selectedBoard);
	        addColumnToBoardView(column, columnPos);
	    });

	    document.getElementById('removeColumnBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        var columns = appData.selectedBoard.columns;
	        var cards = appData.selectedBoard.cards;
	        var selectedColumnEl = appData.selectedColumnEl;
	        var selectedColumnPos = appData.selectedColumn.columnPosition;
	        var currentColumns = getCurrentColumns(columns);

	        if (Object.keys(currentColumns).length > 1) {
	            removeColumnFromBoardInModel(selectedColumnPos, columns);
	            var newColumnPos = modifyRemovedColumnCardsInModel(cards, selectedColumnPos, getCurrentColumns(columns));
	            var ulId = "ul" + selectedColumnEl.getAttribute('data-ar-pos');
	            var updatedCardsElArr = Array.from(appData.selectedColumnEl.children[ulId].children);
	            updateChangedColumnCardsToView(updatedCardsElArr, newColumnPos);
	            addClass(appData.selectedColumnEl, 'fadeout-el');
	            window.setTimeout(function () {
	                appData.selectedColumnEl.remove();
	                var myColumnEl = document.getElementById('boardColumns').firstElementChild;
	                updateSelectedColumnInModel(newColumnPos, myColumnEl, appData);
	            });
	        } else {
	            alert("You only have one column left! Do not delete it!");
	        }
	    });

	    document.getElementById('cardDeleteBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        deleteCard(appData.selectedCardEl.getAttribute('data-ar-pos'), appData.selectedCardEl, appData.selectedBoard.cards);
	    });

	    //Select/Edit Card, Select/Edit Column
	    document.getElementById('selectedBoardEl').addEventListener('click', function (event) {

	        var targ = event.target;

	        if (targ.hasAttribute('data-el-type')) {

	            switch (targ.getAttribute('data-el-type')) {
	                case 'cardEl':
	                    selectCardInModel(targ.getAttribute('data-ar-pos'), targ, appData);
	                    break;
	                case 'columnEl':
	                    updateSelectedColumnInModel(targ.getAttribute('data-ar-pos'), targ, appData);
	                    break;
	            }
	        }
	    });

	    document.getElementById('cardForwardBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        var direction = true;
	        var nextColumn = moveCardInModel(direction, appData.selectedCard, getCurrentColumns(appData.selectedBoard.columns));
	        //moveCardForward(appData.selectedCardEl, appData);
	        updateChangedColumnCardsToView([appData.selectedCardEl], nextColumn);
	    });

	    document.getElementById('cardBackwardBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        var direction = false;
	        var nextColumn = moveCardInModel(direction, appData.selectedCard, getCurrentColumns(appData.selectedBoard.columns));
	        //moveCardBackward(appData.selectedCardEl, appData)
	        updateChangedColumnCardsToView([appData.selectedCardEl], nextColumn);
	    });
	};

	function getBoards() {
	    var boards = {
	        'Agenda': {
	            name: 'Agenda',
	            cards: [{ name: '1 Clean room.', rank: 0, column: 0, isComplete: false, isDeleted: false }, { name: '2 Clean room.', rank: 1, column: 1, isComplete: false, isDeleted: false }, { name: '3 Clean room.', rank: 2, column: 2, isComplete: false, isDeleted: false }, { name: '4 Clean room.', rank: 3, column: 0, isComplete: false, isDeleted: false }],
	            isDeleted: false,
	            columns: [{ columnName: 'To Do', columnPosition: 0, columnIsDeleted: false }, { columnName: 'In Progress', columnPosition: 1, columnIsDeleted: false }, { columnName: 'Done', columnPosition: 2, columnIsDeleted: false }]
	        },
	        'List of Things': {
	            name: 'List of Things',
	            cards: [{ name: 'Do other things.', column: 0, rank: 0, isComplete: false, isDeleted: false }, { name: 'In progresssss.', column: 1, rank: 1, isComplete: false, isDeleted: false }, { name: 'Done!', column: 2, rank: 2, isComplete: true, isDeleted: false }],
	            isDeleted: false,
	            columns: [{ columnName: 'To Do', columnPosition: 0, columnIsDeleted: false }, { columnName: 'In Progress', columnPosition: 1, columnIsDeleted: false }, { columnName: 'Done', columnPosition: 2, columnIsDeleted: false }]
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
	        cards: [],
	        isDeleted: false,
	        columns: []
	    };
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
	    };
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
	function createCard(name, rank) {
	    return {
	        name: name,
	        rank: rank,
	        column: 0,
	        //where 0 = starting, 1 = in progress, 2 = complete
	        // isComplete: false,
	        isDeleted: false
	    };
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
	    for (var board in boards) {
	        myBoardsListEl.appendChild(boardToMyBoardListEl(boards[board]));
	    }
	}

	/*
	Purpose: To make a 'myBoards' html element
	Consumes: a board board object
	Produces: an html board element (list item)
	*/
	function boardToMyBoardListEl(board) {
	    var boardEl = document.createElement('li');
	    boardEl.innerHTML = board.name;
	    boardEl.setAttribute('data-board-name', board.name);
	    boardEl.setAttribute('data-el-type', 'myBoardsListEl');
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
	    var myBoardsListEl = document.getElementById('myBoardsListEl');
	    var myBoardEl = boardToMyBoardListEl(board);
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

	    var prevSelectedBoardEl = appData.selectedBoardEl;

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
	    if (prevEl != null) {
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

	    var selectedBoardTitle = document.getElementById('selectedBoardTitle');
	    selectedBoardTitle.innerHTML = board.name;

	    var boardColumnsEl = document.getElementById('boardColumns');
	    boardColumnsEl.innerHTML = '';
	    updateSelectedBoardColumnsView(board);
	    updateSelectedBoardColumnsCardsView(board);
	}

	function updateChangedColumnCardsToView(updatedCardsElArr, newColumnPos) {
	    var newColumnEl = document.getElementById('ul' + newColumnPos);
	    updatedCardsElArr.forEach(function (cardEl, i) {
	        addClass(cardEl, 'fade-in');
	        newColumnEl.appendChild(cardEl);
	    });
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
	function updateSelectedBoardColumnsCardsView(board, selectedColumnEl) {

	    //Find card ranks.
	    var cardsToAddToView = [];

	    //get uls of columns added to board.
	    var ulsEl = [];
	    for (i = 0; i < board.columns.length; i++) {
	        if (board.columns[i].columnIsDeleted === false) {
	            var newUlEl = document.getElementById('ul' + i);
	            ulsEl.push(newUlEl);
	        }
	    }

	    for (var i = 0, len = board.columns.length; i < len; i++) {
	        for (var j = 0, len2 = board.cards.length; j < len2; j++) {
	            if (board.columns[i].columnPosition === board.cards[j].column) {
	                cardsToAddToView.push(board.cards[j]);
	                len2 = board.cards.length;
	            }
	        }
	    }

	    // logCardsToAddToView(cardsToAddToView)

	    for (var i = 0, len = cardsToAddToView.length; i < len; i++) {
	        if (cardsToAddToView[i].isDeleted === false) {
	            for (var j = 0, len2 = ulsEl.length; j < len2; j++) {
	                if ('ul' + cardsToAddToView[i].column === ulsEl[j].id) {
	                    ulsEl[j].appendChild(cardToCardEl(cardsToAddToView[i], cardsToAddToView[i].rank));
	                    len2 = ulsEl.length;
	                }
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
	    var boardColumnsEl = document.getElementById('boardColumns');
	    boardColumnsEl.innerHTML = '';
	    for (var column in board.columns) {
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
	    var columnEl = document.createElement('div');
	    //let columnTitleEl = document.createElement('h2');
	    var columnTitleEl = document.createElement('input');
	    var columnCardListEl = document.createElement('ul');

	    columnEl.setAttribute('data-el-type', 'columnEl');
	    columnEl.setAttribute('id', 'column' + columnPosition);
	    columnEl.setAttribute('data-ar-pos', columnPosition);
	    columnTitleEl.setAttribute('data-el-type', 'columnTitle');
	    columnTitleEl.setAttribute('id', 'title' + columnPosition);
	    columnTitleEl.disabled = true;
	    columnCardListEl.setAttribute('data-el-type', 'columnCardListEl');
	    columnCardListEl.setAttribute('id', 'ul' + columnPosition);

	    addClass(columnCardListEl, 'column-el');
	    addClass(columnTitleEl, 'column-header');
	    addClass(columnEl, 'column');

	    columnTitleEl.value = column.columnName;

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
	    return column;
	}
	//columnPosition = number
	//columns = array of board columns
	//board = board column is on
	function removeColumnFromBoardInModel(column, columns) {
	    columns[column].columnIsDeleted = true;
	}

	function modifyRemovedColumnCardsInModel(cards, column, currentColumns) {
	    var updatedCards = [];
	    var newColumnPos = void 0;
	    for (var i = 0; i < cards.length; i++) {
	        if (cards[i].column === column && cards[i].column >= 0) {
	            var z = currentColumns.length - 1;
	            while (z >= 0) {
	                if (currentColumns[z].columnIsDeleted === false) {
	                    cards[i].column = currentColumns[z].columnPosition;
	                    newColumnPos = cards[i].column;
	                }
	                z--;
	            };
	            updatedCards.push(cards[i]);
	        } else if (cards[i].column === column && cards[i].column <= 0) {
	            cards[i].column = 0;
	        };
	        //If no cards are on the column??
	    };
	    return newColumnPos;
	}

	/*
	COME BACK TO THIS POST CARD-REMAKE
	Purpose: to add column to board view without selecting a new board
	Consumes: a column object and a columnPosition (number)
	Produces: a column html element
	*/
	function addColumnToBoardView(column, columnPosition) {
	    var boardColumnsEl = document.getElementById('boardColumns');
	    var columnEl = columnToColumnEl(column, columnPosition);
	    addClass(columnEl, 'fade-in');
	    //Additional css classes if columnn count is greater than x?
	    boardColumnsEl.appendChild(columnEl);
	    window.setTimeout(function () {
	        removeClass(columnEl, 'fade-in');
	    }, 200);
	    return columnEl;
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
	    var cardEl = document.createElement('li');
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
	    var ulsEl = boardColumns.querySelectorAll('ul');
	    console.log('ulsEl', ulsEl);

	    var cardEl = cardToCardEl(card, cardRank);
	    addClass(cardEl, 'fade-in');

	    for (var j = 0, len2 = ulsEl.length; j < len2; j++) {
	        if ('ul' + card.column === ulsEl[j].id) {
	            ulsEl[j].appendChild(cardEl);
	            len2 = ulsEl.length;
	        }
	    }

	    window.setTimeout(function () {
	        removeClass(cardEl, 'fade-in');
	    }, 200);
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
	    var prevSelectedCardEl = appData.selectedCardEl;

	    appData.selectedCard = appData.selectedBoard.cards[cardRank];
	    appData.selectedCardEl = cardEl;

	    updateSelectedCardView(prevSelectedCardEl, cardEl);
	}

	function updateSelectedColumnInModel(columnPos, columnEl, appData) {

	    var prevSelectedColumnEl = appData.selectedColumnEl;

	    appData.selectedColumn = appData.selectedBoard.columns[columnPos];
	    appData.selectedColumnEl = columnEl;

	    updateSelectedColumnView(prevSelectedColumnEl, columnEl);
	}

	function updateSelectedColumnView(prevColumnEl, columnEl) {
	    if (prevColumnEl != null) {
	        removeClass(prevColumnEl, 'active-column');
	    }
	    addClass(columnEl, 'active-column');
	}

	/*
	Purpose: Update selected card element view
	Consumes: Previous selected card html element and card html element
	Produces: nothing
	Actions: Removes active styling from previously selected card element
	and adds styling to newly selected card element
	*/

	function updateSelectedCardView(prevCardEl, cardEl) {
	    if (prevCardEl != null) {
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
	    window.setTimeout(function () {
	        cardEl.remove();
	    }, 500);
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
	// function moveCardForward(cardEl, appData) {
	//     //let cardColumn = appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column;
	//     let cardColumn = appData.selectedCard.column;
	//     let card = appData.selectedCard;
	//     //let columns = appData.selectedBoard.columns;
	//     //currentColumns - model
	//     let currentColumns = getCurrentColumns(columns);
	//     let nextColumn;
	//     let currentColsEndPos = currentColumns.length;
	//     for (let p = 0; p < currentColumns.length; p++) {
	//         if(cardColumn > currentColsEndPos) {
	//             nextColumn = currentColumns[currentColsEndPos - 1].columnPosition;
	//             break;
	//         }
	//         if(currentColumns[p].columnPosition > cardColumn) {
	//             nextColumn = currentColumns[p].columnPosition;
	//             break;
	//         }
	//
	//         if((currentColumns[p].columnPosition === cardColumn) && (p === currentColsEndPos - 1)) {
	//           nextColumn = currentColumns[p].columnPosition;
	//           break;
	//         }
	//     }
	//     appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column = nextColumn;
	//     //addMovedCardToView(cardEl, nextColumn);
	//     let updatedCardElArr = [cardEl];
	//     updateChangedColumnCardsToView(updatedCardElArr, nextColumn);
	// }

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
	// function moveCardBackward(cardEl, appData) {
	//     let cardColumn = appData.selectedCard.column;
	//     let card = appData.selectedCard;
	//     let columns = appData.selectedBoard.columns;
	//
	//     let currentColumns = getCurrentColumns(columns);
	//     let nextColumn = currentColumns.length-1;
	//     for (let i = nextColumn; i >= -1; i--) {
	//         if (i === -1) {
	//             nextColumn = 0;
	//             break;
	//         }
	//
	//         if (currentColumns[i].columnPosition < cardColumn) {
	//             nextColumn = currentColumns[i].columnPosition;
	//
	//             break;
	//         }
	//     }
	//     appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].column = nextColumn;
	//     let updatedCardsElArr = [cardEl];
	//     addMovedCardToView(cardEl, nextColumn);
	// }

	function moveCardInModel(direction, card, currentColumns) {
	    var cardColumn = card.column;
	    debugger;
	    //true = forward
	    if (direction === true) {
	        var nextColumn = void 0;
	        var currentColsEndPos = currentColumns.length;
	        for (var p = 0; p < currentColumns.length; p++) {
	            if (cardColumn > currentColsEndPos) {
	                nextColumn = currentColumns[currentColsEndPos - 1].columnPosition;
	                break;
	            }
	            if (currentColumns[p].columnPosition > cardColumn) {
	                nextColumn = currentColumns[p].columnPosition;
	                break;
	            }

	            if (currentColumns[p].columnPosition === cardColumn && p === currentColsEndPos - 1) {
	                nextColumn = currentColumns[p].columnPosition;
	                break;
	            }
	        }
	        card.column = nextColumn;
	        return nextColumn;
	    }
	    //false = backwards
	    if (direction === false) {
	        var _nextColumn = currentColumns.length - 1;
	        for (var i = _nextColumn; i >= -1; i--) {
	            if (i === -1) {
	                _nextColumn = 0;
	                break;
	            }
	            if (currentColumns[i].columnPosition < cardColumn) {
	                _nextColumn = currentColumns[i].columnPosition;
	                break;
	            }
	        }
	        card.column = _nextColumn;
	        return _nextColumn;
	    }
	}

	function addMovedCardToView(selectedCardEl, cardColumn) {
	    var boardColumnsEl = document.getElementById('boardColumns');
	    var ulsEl = boardColumns.querySelectorAll('ul');
	    console.log('ulsEl', ulsEl);

	    for (var j = 0, len2 = ulsEl.length; j < len2; j++) {
	        if ('ul' + cardColumn === ulsEl[j].id) {
	            ulsEl[j].appendChild(selectedCardEl);
	            len2 = ulsEl.length;
	        }
	    }
	}

/***/ })
/******/ ]);
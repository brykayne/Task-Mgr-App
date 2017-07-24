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
	        selectedBoardEl: null
	    };
	    setListeners(appData);
	    boardsToView(appData.boards);
	    selectedBoardToView(appData.selectedBoard);
	    selectBoard(document.getElementById('myBoards').firstElementChild, appData);
	}

	function setListeners(appData) {
	    document.getElementById('myBoardsForm').addEventListener('submit', function (event) {
	        event.preventDefault();
	        console.log(event);
	        addBoard(createBoard(event.target.myboardsInput.value), appData);
	    });

	    document.getElementById('cardForm').addEventListener('submit', function (event) {
	        event.preventDefault();
	        addCard(createCard(event.target.cardInput.value), appData);
	    });

	    document.getElementById('myBoards').addEventListener('click', function (event) {
	        event.preventDefault();
	        if (event.target.tagName === 'LI') {
	            console.log(event.target.getAttribute('data-board'));
	            selectBoard(event.target, appData);
	        }
	    });

	    document.getElementById('forwardBtn').addEventListener('click', function (event) {
	        event.preventDefault();
	        console.log('forward clicked!');
	        //Pseudo-code for pushing card forward:
	        //1. Click card to select
	        //2. Make active card (style, appData)
	        //3. Click forward button
	        //4. Update appData object
	        //5. show card moved to new column
	    });
	}

	function getBoards() {
	    var boards = {
	        'Agenda': {
	            name: 'Agenda',
	            cards: [{ name: 'Clean room.', position: 0, isComplete: false, isDeleted: false }]
	        },
	        'List of Things': {
	            name: 'List of Things',
	            cards: [{ name: 'Do other things.', position: 0, isComplete: false, isDeleted: false }, { name: 'In progresssss.', position: 1, isComplete: false, isDeleted: false }, { name: 'Done!', position: 2, isComplete: true, isDeleted: false }]
	        }
	    };

	    return boards;
	}

	function boardsToView(boards) {
	    var myBoardsEl = document.getElementById('myBoards');
	    for (var board in boards) {
	        myBoardsEl.appendChild(boardtoBoardEl(boards[board]));
	    }
	}

	function boardtoBoardEl(board) {
	    var boardEl = document.createElement('li');
	    boardEl.innerHTML = board.name;
	    boardEl.setAttribute('data-board', JSON.stringify(board));
	    addClass(boardEl, "myboards-el");
	    return boardEl;
	}

	function createBoard(name) {
	    return {
	        name: name,
	        cards: []
	    };
	}

	function addBoard(board, appData) {
	    appData.boards[board.name] = { name: board.name, cards: [] };
	    console.log(appData);
	    var myBoardsEl = document.getElementById('myBoards');
	    var boardEl = boardtoBoardEl(board);
	    //Add fade-in class here...
	    addClass(boardEl, 'fade-in');
	    myBoardsEl.appendChild(boardEl);
	    selectBoard(boardEl, appData);
	}

	function selectedBoardToView(selectedBoard) {
	    var todoCardsEl = document.getElementById('toDoCards');
	    var inProgressCardsEl = document.getElementById('inProgressCards');
	    var doneCardsEl = document.getElementById('doneCards');
	    todoCardsEl.innerHTML = '';
	    inProgressCardsEl.innerHTML = '';
	    doneCardsEl.innerHTML = '';

	    for (var card in selectedBoard.cards) {
	        console.log(selectedBoard.cards[card]);
	        if (selectedBoard.cards[card].position == 0) {
	            todoCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
	        } else if (selectedBoard.cards[card].position == 1) {
	            inProgressCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
	        } else if (selectedBoard.cards[card].position == 2) {
	            doneCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
	        } else {
	            console.log('Position could not be found');
	        };
	    };
	}

	function cardToCardEl(card) {
	    var cardEl = document.createElement('li');
	    cardEl.innerHTML = card.name;
	    addClass(cardEl, 'card-el');
	    return cardEl;
	}

	function createCard(name) {
	    return {
	        name: name,
	        position: 0,
	        //where 0 = starting, 1 = in progress, 2 = complete
	        isComplete: false,
	        isDeleted: false
	    };
	}

	function addCard(card, appData) {
	    appData.selectedBoard.cards.push(card);
	    appData.selectedBoardEl.setAttribute('data-board', JSON.stringify(appData.selectedBoard));
	    console.log(JSON.stringify(appData.selectedBoard));
	    console.log(appData);
	    var todoCardsEl = document.getElementById('toDoCards');
	    var cardEl = cardToCardEl(card);
	    addClass(cardEl, 'fade-in');
	    todoCardsEl.appendChild(cardEl);
	}

	function selectBoard(boardEl, appData) {
	    if (appData.selectedBoardEl != null) {
	        removeClass(appData.selectedBoardEl, 'active-board-item-selected');
	    }
	    appData.selectedBoardEl = boardEl;
	    addClass(boardEl, 'active-board-item-selected');
	    appData.selectedBoard = JSON.parse(boardEl.getAttribute('data-board'));
	    selectedBoardToView(appData.selectedBoard);
	}

	// function cardForward(cardEl, appData) {
	//
	// }
	//
	// function cardBackward(cardEl, appData) {
	//
	// }

/***/ })
/******/ ]);
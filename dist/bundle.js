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
	        selectedBoard: boards[Object.keys(boards)[0]]
	    };
	    setListeners(appData);
	    boardsToView(appData.boards);
	    selectedBoardToView(appData.selectedBoard);
	}

	function setListeners(appData) {
	    document.getElementById('myBoardsForm').addEventListener('submit', function (event) {
	        event.preventDefault();
	        console.log(event);
	        debugger;
	        addBoard(createBoard(event.target.myboardsInput.value), appData);
	    });

	    document.getElementById('cardForm').addEventListener('submit', function (event) {
	        event.preventDefault();
	        addCard(createCard(event.target.cardInput.value), appData);
	    });
	}

	function getBoards() {
	    var boards = {
	        'Agenda': {
	            name: 'Agenda',
	            cards: [{ name: 'Clean room.' }]
	        },
	        'List of Things': {
	            name: 'List of Things',
	            cards: [{ name: 'Do other things.' }]
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
	    boardEl.className = "myboards-el";
	    return boardEl;
	}

	function createBoard(name) {
	    return {
	        name: name
	    };
	}

	function addBoard(board, appData) {
	    appData.boards[board.name] = { name: board.name, cards: [] };
	    console.log(appData);
	    var myBoardsEl = document.getElementById('myBoards');
	    var boardEl = boardtoBoardEl(board);
	    //Add fade-in class here...
	    boardEl.className += ' fade-in';
	    myBoardsEl.appendChild(boardEl);
	}

	function selectedBoardToView(selectedBoard) {
	    var todoCardsEl = document.getElementById('toDoCards');
	    for (var card in selectedBoard.cards) {
	        todoCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
	    }
	}

	function cardToCardEl(card) {
	    var cardEl = document.createElement('li');
	    cardEl.innerHTML = card.name;
	    cardEl.className = 'card-el';
	    return cardEl;
	}

	function createCard(name) {
	    return {
	        name: name,
	        cards: []
	    };
	}

	function addCard(card, appData) {
	    appData.selectedBoard.cards.push(card);
	    console.log(appData);
	    var todoCardsEl = document.getElementById('toDoCards');
	    var cardEl = cardToCardEl(card);
	    // addClass(cardEl, 'fade-in');
	    todoCardsEl.appendChild(cardEl);
	}

/***/ })
/******/ ]);
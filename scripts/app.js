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
        selectedBoardEl: null
    };
    setListeners(appData);
    boardsToView(appData.boards);
    selectedBoardToView(appData.selectedBoard);
    selectBoard(document.getElementById('myBoards').firstElementChild, appData);
}

function setListeners(appData) {
    document.getElementById('myBoardsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log(event);
        addBoard(createBoard(event.target.myboardsInput.value), appData);
    });

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addCard(createCard(event.target.cardInput.value), appData);
    });

    document.getElementById('myBoards').addEventListener('click', function(event) {
        event.preventDefault();
        if(event.target.tagName === 'LI') {
            console.log(event.target.getAttribute('data-board'));
            selectBoard(event.target, appData);
        }
    });
}

function getBoards() {
    let boards =
    {
        'Agenda':
        {
            name: 'Agenda',
            cards:[
                {name: 'Clean room.', position: 0, isComplete: false, isDeleted: false}
            ]
        },
        'List of Things':
        {
            name: 'List of Things',
            cards:[
                {name: 'Do other things.', position: 0, isComplete: false, isDeleted: false}
            ]
        }
    };

    return boards;
}

function boardsToView(boards) {
    let myBoardsEl = document.getElementById('myBoards');
    for(let board in boards) {
        myBoardsEl.appendChild(boardtoBoardEl(boards[board]));
    }
}

function boardtoBoardEl(board) {
    let boardEl = document.createElement('li');
    boardEl.innerHTML = board.name;
    boardEl.setAttribute('data-board', JSON.stringify(board));
    addClass(boardEl, "myboards-el");
    return boardEl;
}

function createBoard(name) {
    return {
        name: name,
        cards:[]
    }
}

function addBoard(board, appData) {
    appData.boards[board.name] = {name:board.name, cards:[]};
    console.log(appData);
    let myBoardsEl = document.getElementById('myBoards');
    let boardEl = boardtoBoardEl(board);
    //Add fade-in class here...
    addClass(boardEl, 'fade-in');
    myBoardsEl.appendChild(boardEl);
    selectBoard(boardEl, appData);
}

function selectedBoardToView(selectedBoard) {
    let todoCardsEl = document.getElementById('toDoCards');
    todoCardsEl.innerHTML = '';
    //Will need to clear other columns when add in move card functionality
    for(let card in selectedBoard.cards) {
        todoCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
    }
}

function cardToCardEl(card) {
    let cardEl = document.createElement('li');
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
        isDeleted: false,
    }
}

function addCard(card, appData) {
    appData.selectedBoard.cards.push(card);
    appData.selectedBoardEl.setAttribute('data-board',JSON.stringify(appData.selectedBoard));
    console.log(JSON.stringify(appData.selectedBoard));
    console.log(appData);
    let todoCardsEl = document.getElementById('toDoCards');
    let cardEl = cardToCardEl(card);
    addClass(cardEl, 'fade-in');
    todoCardsEl.appendChild(cardEl);
}

function selectBoard(boardEl, appData) {
    if(appData.selectedBoardEl != null) {
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

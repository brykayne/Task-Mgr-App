document.onreadystatechange = function() {
    if(document.readyState === 'interactive') {
        main();
    }
}

function main() {
    let boards = getBoards();
    let appData = {
        boards: boards,
        selectedBoard: boards[Object.keys(boards)[0]]
    };
    setListeners(appData);
    boardsToView(appData.boards);
    selectedBoardToView(appData.selectedBoard);
}

function setListeners(appData) {
    document.getElementById('myBoardsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addBoard(createBoard(event.target.myboardInput.value), appData);
    });

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addItem(createItem(event.target.cardInput.value), appData);
    });
}

function getBoards() {
    let boards =
    {
        'Agenda':
        {
            name: 'Agenda',
            cards:[
                {name: 'Clean room.'}
            ]
        },
        'List of Things':
        {
            name: 'List of Things',
            cards:[
                {name: 'Do other things.'}
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
    boardEl.className = "myboards-el";
    return boardEl;
}

function createBoard(name) {
    return {
        name: name
    }
}

function addBoard(board, appData) {
    appData.boards[board.name] = {name:board.name, cards:[]};
    console.log(appData);
    let myBoardsEl = document.getElementById('myLists');
    let boardEl = boardtoBoardEl(board);
    addClass(boardEl, 'fade-in');
    myBoardsEl.appendChild(boardEl);
}

function selectedBoardToView(selectedBoard) {
    // let selectedBoardEl = document.getElementById('selectedBoardEl');
    let todoCardsEl = document.getElementById('toDoCards');
    for(let card in selectedBoard.cards) {
        todoCardsEl.appendChild(cardToCardEl(selectedBoard.cards[card]));
    }
}

function cardToCardEl(card) {
    let cardEl = document.createElement('li');
    cardEl.innerHTML = card.name;
    cardEl.className = 'card-el';
    return cardEl;
}

function createCard(name) {
    return {
        name: name,
        cards: []
    }
}

function addCard(card, appData) {
    appData.selectedBoard.cards.push(item);
    console.log(appData);
    let myBoardsEl = document.getElementById('selectedBoard');
    let cardEl = cardToCardEl(card);
    addClass(cardEl, 'fade-in');
    myBoardsEl.appendChild(cardEl);
}

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
        selectedCard: null,
        selectedCardEl: null
    };
    setListeners(appData);
    boardsToView(appData);
    selectedBoardToView(appData);
}

function setListeners(appData) {
    document.getElementById('myBoardsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addBoard(createBoard(event.target.myboardsInput.value), appData);
        event.target.reset();
    });

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addCard(createCard(event.target.cardInput.value), appData);
        event.target.reset();
    });

    document.getElementById('myBoards').addEventListener('click', function(event) {
        event.preventDefault();
        if(event.target.tagName === 'LI') {
            selectBoard(event.target, appData);
        }
    });

    document.getElementById('selectedBoard').addEventListener('click', function(event) {
        //41

        //Add unique id to each card: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        // if(event.target.tagName === 'LI') {
        //     // selectCard(event.target,)
        //     console.log('woah! Board LI hit.')
        //
        // }
    })

    document.getElementById('forwardBtn').addEventListener('click', function(event) {
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
                {name: 'Do other things.', position: 0, isComplete: false, isDeleted: false},
                {name: 'In progresssss.', position: 1, isComplete: false, isDeleted: false},
                {name: 'Done!', position: 2, isComplete: true, isDeleted: false}
            ]
        }
    };

    return boards;
}

function boardsToView(appData) {
    let myBoardsEl = document.getElementById('myBoards');
    for(let board in appData.boards) {
        myBoardsEl.appendChild(boardtoBoardEl(appData.boards[board]));
    };

    appData.selectedBoardEl = myBoardsEl.firstElementChild;
    addClass(appData.selectedBoardEl, 'active-board-item-selected');
    console.log(appData.selectedBoardEl);
}

function boardtoBoardEl(board) {
    let boardEl = document.createElement('li');
    boardEl.innerHTML = board.name;
    boardEl.setAttribute('data-board-name', board.name);
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
    let myBoardsEl = document.getElementById('myBoards');
    let boardEl = boardtoBoardEl(board);
    addClass(boardEl, 'fade-in');
    myBoardsEl.appendChild(boardEl);
    selectBoard(boardEl, appData);
}

function selectedBoardToView(appData) {
    let todoCardsEl = document.getElementById('toDoCards');
    let inProgressCardsEl = document.getElementById('inProgressCards');
    let doneCardsEl = document.getElementById('doneCards');
    todoCardsEl.innerHTML = '';
    inProgressCardsEl.innerHTML = '';
    doneCardsEl.innerHTML = '';

    //Might need if(!appData.selectedList.items[item].isDeleted)



    for(let card in appData.selectedBoard.cards) {
        console.log(appData.selectedBoard.cards[card]);
        if(!appData.selectedBoard.cards[card].isDeleted) {
            if (appData.selectedBoard.cards[card].position == 0) {
                todoCardsEl.appendChild(cardToCardEl(appData.selectedBoard.cards[card]));
            } else if (appData.selectedBoard.cards[card].position == 1) {
                inProgressCardsEl.appendChild(cardToCardEl(appData.selectedBoard.cards[card]));
            } else if (appData.selectedBoard.cards[card].position == 2) {
                doneCardsEl.appendChild(cardToCardEl(appData.selectedBoard.cards[card]));
            } else {
                console.log('Position could not be found');
            };
        };
    };
}

function cardToCardEl(card, arPosition) {
    let cardEl = document.createElement('li');
    cardEl.innerHTML = card.name;
    cardEl.setAttribute('data-card', JSON.stringify(card));
    cardEl.setAttribute('data-ar-pos', arPosition);

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
    // appData.selectedBoardEl.setAttribute('data-board',JSON.stringify(appData.selectedBoard));
    // console.log(appData);
    let todoCardsEl = document.getElementById('toDoCards');
    let cardEl = cardToCardEl(card, appData.selectedBoard.cards.length-1);
    addClass(cardEl, 'fade-in');
    todoCardsEl.appendChild(cardEl);
    // selectCard(cardEl, appData);
    window.setTimeout(function(){removeClass(cardEl, 'fade-in')}, 200);
}

function selectBoard(boardEl, appData) {
    debugger;
    appData.selectedCardEl = null; //162
    appData.selectedCard = null;
    appData.selectedBoard = appData.boards[boardEl.getAttribute('data-board-name')];
    if(appData.selectedBoardEl != null) {
        removeClass(appData.selectedBoardEl, 'active-board-item-selected');
    }
    appData.selectedBoardEl = boardEl;
    addClass(appData.selectedBoardEl, 'active-board-item-selected');
    // appData.selectedBoard = JSON.parse(boardEl.getAttribute('data-board-name'));
    selectedBoardToView(appData);
}

function selectCard(cardEl, appData) {
    console.log('Card selected');
    if (appData.selectedCardEl != null) {
        removeClass(appData.selectedCardEl, 'active-board-item-selected');
    };
    appData.selectedCardEl = cardEl;
    addClass(cardEl, 'active-board-item-selected');
    appData.selectedCard = JSON.parse(card.getAttribute('data-card'));
    //card details view
}

function deleteCard(cardEl, appData) {
    appData.selectedBoard.cards[cardEl.getAttribute('data-ar-pos')].isDeleted = true;
    addClass(cardEl, 'fadeout-el');
    window.setTimeout(function(){cardEl.remove();},500);
}

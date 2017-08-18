function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function ascendingOrder(array) {
    array.sort(function(a, b) {
        return a - b;
    });
}

//Pulls in columns that are not in an 'isDeleted' status
function getCurrentColumns(columns) {
  let x = 0;
  let currentColumns = [];
  while(x < columns.length) {
      if(columns[x].columnIsDeleted === false) {
          currentColumns.push(columns[x]);
      }
      x++;
  }
  return currentColumns;
}

//Purpose: to console log cards that are added to view for testing purposes.
function logCardsToAddToView(cardsToAddToView) {
    for (var i = 0, len = cardsToAddToView.length; i < len; i++) {
        console.log("cardName:"+cardsToAddToView[i].name+" pos:"+ cardsToAddToView[i].column);
    }
}

function setLocalStore(key, obj) {
  if(typeof(Storage) !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  return obj;
}

function getLocalStore(key, obj) {
  if(typeof(Storage) !== 'undefined') {
    return JSON.parse(localStorage.getItem(key));
  } else {
    return null;
  }
}

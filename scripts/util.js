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


//Purpose: to console log cards that are added to view for testing purposes.
function logCardsToAddToView(cardsToAddToView) {
    for (var i = 0, len = cardsToAddToView.length; i < len; i++) {
        console.log("cardName:"+cardsToAddToView[i].name+" pos:"+ cardsToAddToView[i].column);
    }
}

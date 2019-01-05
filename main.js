var titleInput = document.getElementById('title-input');
var captionInput = document.getElementById('caption-input');

document.getElementById('add-button').addEventListener('click', addCard);

function addCard(foto) {
  var card = document.createElement('section');
  var cardSection = document.querySelector('.card-section');
  card.className = 'photo-card';
  card.innerHTML = 
  `<div class="card-content">
  <h2 class="card-title" contenteditable= "true"></h2>
  <img class="card-image" src=${photo.file}>
  <h4 class="card-caption" contenteditable="true"></h4>
  </div>
  <div class="card-bottom">
  <img class="delete-icon card-icon" src="images/delete.svg">
  <img class="favorite-icon card-icon">
  </div>
  `
  cardSection.insertBefore(card, cardSection.firstChild); 
  if (photo.favorite) {
    update(photo.favorite);
    document.querySelector('.favorite-icon').classList.add('favorite-active');
  }
};
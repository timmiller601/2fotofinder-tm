var fotoArray = [];
var addToAlbumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');
var fotoCardSection = document.querySelector('.foto-card-section');
var userInputForm = document.querySelector('.user-inputs-form');
var fotoInput = document.getElementById('foto-upload-input');
var userFoto = document.getElementById('foto-upload-input');
var showMoreBtn = document.querySelector('.show-more-btn');
var reader = new FileReader();

addToAlbumBtn.addEventListener('click', createFotoString);
document.querySelector('.search-input').addEventListener('keyup', liveSearch);
fotoCardSection.addEventListener('dblclick', updateFotoCard);
showMoreBtn.addEventListener('click', showAll)
window.addEventListener('load', createCardsOnReload);

favoritesBtn.addEventListener('click', event => {
    favoriteFilter(event)
  });

fotoCardSection.addEventListener('click', event => {
  if (event.target.classList.contains('favorite-btn')){
    favoriteVote(event);
  } else if (event.target.classList.contains('delete-btn')) {
    deleteCard(event);
  }
})

userInputForm.addEventListener('input', function() {
  if (title.value !== '' && caption.value !== '' && fotoInput.value !== '')
    enableButton(addToAlbumBtn);
  });

function checkFotoArrayLength(foto, direction) {
  if (fotoArray.length <= 5) {
    createCards(foto, direction);
  } else {
    enableButton(showMoreBtn);
    showTen();
  }
}

function clearInputs() {
  title.value = '';
  caption.value = '';
  userFoto.value = '';
}

function createCards(foto, direction) {
  fotoCardSection.insertAdjacentHTML(direction, 
    `<article class="foto-card" data-id=${foto.id}>
      <h2  class="text searchable title" maxlength="66" contenteditable="false">${foto.title}</h2>
      <img class="foto" src="${foto.file}">
      <p  class="text searchable caption" maxlength="66" contenteditable="false">${foto.caption}</p>
      <div class="footer">
        <button class="delete-btn"></button>
        <button id="${foto.id}" class="favorite-btn"></button>
      </div>
    </article>`);
  if (foto.favorite === true) {
    document.getElementById(foto.id).classList.add('favorite');
  }
  clearInputs(); 
} 

function createCardsOnReload() {
  if (localStorage.length !== 0) {
    var storedArray = localStorage.getItem("array");
    var parsedArray = JSON.parse(storedArray);
    parsedArray.forEach(function(foto) {
      var foto = new Foto(foto.title, foto.caption, foto.file, foto.favorite, foto.id);
      fotoArray.push(foto);
      checkFotoArrayLength(foto, 'beforeend');
    }) 
  } 
  favoriteCountUpdate();
  insertPrompt();
}

function createFotoString(event) {
  event.preventDefault();
  if (document.getElementById('foto-upload-input').files[0]) {
    reader.readAsDataURL(document.getElementById('foto-upload-input').files[0]);
    reader.onload = createNewFoto;
  }
}

function createNewFoto(event) {
  event.preventDefault();
  disableButton(addToAlbumBtn);
  var userFoto =  reader.result;
  var foto = new Foto(title.value, caption.value, userFoto);
  fotoArray.unshift(foto);
  foto.saveToStorage(fotoArray);
  checkFotoArrayLength(foto, 'afterbegin');
  if (fotoArray.length === 1) { 
    document.querySelector('.no-photo-text').remove();
  } 
}

function deleteCard(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  var card = event.target.parentElement.parentElement;
  fotoArray[index].deleteFromStorage(fotoArray, index);
  card.remove();
  favoriteCountUpdate();
  insertPrompt();
  if (fotoArray.length <=5) {
    disableButton(showMoreBtn);
    showMoreBtn.innerText = 'Show More';
  }
}

function disableButton(button) {
    button.disabled = true;
}

function enableButton(button) {
    button.disabled = false;
}

function favoriteCountUpdate() {
  var favoriteCount = 0;
  fotoArray.forEach(function(foto) {
    if (foto.favorite === true) {
      favoriteCount++
    };
  });
  document.querySelector('.favorite-number').innerText = favoriteCount;
}
  
function favoriteFilter(event) {
  event.preventDefault();
  removeCards();
  if (document.querySelector('.fav-btn').innerText === 'View All') {
    fotoArray.forEach(function(foto) {
      checkFotoArrayLength(foto, 'beforeend')
    })
    document.querySelector('.fav-btn').innerHTML = 'View <span class="favorite-number">#</span> Favorites';
    favoriteCountUpdate();  
  } else {
    removeCards();
    fotoArray.forEach(function(foto) {
      favoriteFilterTrueChecker(foto);
    })
    document.querySelector('.fav-btn').innerText = 'View All';
  }
}

function favoriteFilterTrueChecker (foto) {
  if(foto.favorite === true) {
      createCards(foto, 'beforeend');
  }
}

function favoriteUpdateCall(index) {
  fotoArray[index].updateFavorite();
  fotoArray[index].saveToStorage(fotoArray);
  favoriteCountUpdate();
}

function favoriteVote(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  if (event.target.classList.contains('favorite')) {
    favoriteUpdateCall(index);
    event.target.classList.remove('favorite');
  } else {
    favoriteUpdateCall(index);
    event.target.classList.add('favorite');
  };
}

function findIndexNumber(fotoId) {
 for (var i = 0; i < fotoArray.length; i++) {
    if (fotoArray[i].id === fotoId) {
      return i;
    };
  }
}

function insertPrompt() {
  if (fotoArray.length === 0) {
    fotoCardSection.insertAdjacentHTML('beforebegin',
      '<h3 class="no-photo-text">Add photo above to start your album!</h3>');
  }
}

function liveSearch() {
  var searchInput = this.value.toLowerCase();
  var shownArray = fotoArray.filter(function(foto) {
   return foto.title.toLowerCase().includes(searchInput) || foto.caption.toLowerCase().includes(searchInput)
  })
  removeCards();
  shownArray.forEach(function(foto) {
    createCards(foto, 'beforeend');
  })
}

function removeCards() {
  var cards = document.querySelectorAll('.foto-card');
  cards.forEach(function(card) {
    card.remove();
  });
}

function saveTextOnClick(event) {
  updateFoto();    
  setUneditable(); 
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
};

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateFoto();    
    setUneditable(); 
    document.body.removeEventListener('keypress', saveTextOnEnter);
    event.target.removeEventListener('blur', saveTextOnClick);
  }
}; 

function setEditable() {
  event.target.contentEditable = true;
}

function setUneditable() {
  event.target.contentEditable = false;
};

function showAll() {
  if (showMoreBtn.innerText === 'Show More') {
    removeCards();
    fotoArray.forEach(function(foto) {
      createCards(foto, 'beforeend');
    });
    showMoreBtn.innerText = 'Show Less';
  } else if (showMoreBtn.innerText === 'Show Less') {
    showMoreBtn.innerText = 'Show More';  
    showTen();
  }
}

function showTen() {  
    removeCards();
    fotoArray.forEach(function(foto, i) {
      if(i<5) {
        createCards(foto, 'beforeend');
      }
    })
}

function updateFoto() {
var index = findIndexNumber(event.target.parentElement.dataset.id);
  if (event.target.classList.contains('title')) {
    fotoArray[index].updateSelf(event.target.innerText, 'title');
  } else {
    fotoArray[index].updateSelf(event.target.innerText, 'caption');
  }
  fotoArray[index].saveToStorage(fotoArray);
}

function updateFotoCard(event) {
 if (event.target.classList.contains('text')) {
  setEditable();
  document.body.addEventListener('keypress', saveTextOnEnter);
  event.target.addEventListener('blur', saveTextOnClick);
 }
}

// ------------ JS file for info modal in index.html
let modal = document.getElementById('myModal');

// Open info Modal 
function infoFunction() {
	Modal();
}

// Starts the game
function startGame() {
	location.href = 'game.html';
}

// Declares variables to Modal
const closeModal = document.getElementsByClassName('close')[0];
const closeMain = document.getElementById('close');
const again = document.getElementsByClassName('again')[0];
if (localStorage.length === 0) {
	document.getElementById('record-info-text').innerHTML = `💥Here comes your HighScore💥`;
} else {
	document.getElementById('record-info-text').innerHTML = `💥${localStorage.getItem('theFinalRecord')}💥`;
}

// Text link, open the modal
function Modal() {
	modal.style.display = 'block';
} 

// Close function
closeMain.onclick = function () {
	modal.style.display = 'none';
	location.href = 'index.html';
};
// Play again
again.onclick = function () {
	modal.style.display = 'none';
	location.href = 'game.html';
};

// Clicks anywhere outside of the modal window, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = 'none';
		location.href = 'index.html';
	}
};

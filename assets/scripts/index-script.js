// ------------ JS file for info modal in index.html
var modal = document.getElementById('myModal');

function infoFunction() {
	Modal();
}
function startGame() {
	location.href = 'game.html';
}

var closeModal = document.getElementsByClassName('close')[0];
var closeMain = document.getElementById('close');
var again = document.getElementsByClassName('again')[0];

// Text link, open the modal
function Modal() {
	modal.style.display = 'block';
} //--------------------------------------

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

'use strict';

const images = document.querySelectorAll('.images');

let IfTurnedImg = false;
let lockSurface = false;
let imgOne, imgTwo;
let clicks = 0;
let finished = 0;
let clicksTop = 0;

let timer = new Timer();

// Function print out the time counter
timer.addEventListener('secondTenthsUpdated', function () {
	let scoreBoard = `Clicks: ${clicksTop} <br>Time:  ${timer.getTimeValues().toString(['seconds', 'secondTenths'])}`;
	document.getElementById('scores').innerHTML = scoreBoard;
});

// ----------------- Put the clicks and time on the top of the page
function Scores() {
	clicksTop += 1;
}

//  Check if the image chuld turn
function turnImage() {
	if (lockSurface) {
		return;
	}
	if (this === imgOne) {
		return;
	}

	this.classList.add('spin');
	clicksTop += 1;
	if (!IfTurnedImg) {
		// click one
		IfTurnedImg = true;
		imgOne = this;

		return;
	}

	// click two
	imgTwo = this;

	checkIfSame();
}

function checkIfSame() {
	clicks += 2;
	let isMatch = imgOne.dataset.num === imgTwo.dataset.num;

	if (isMatch) {
		imgOne.classList.add('done');
		imgTwo.classList.add('done');
		disableCards();
		finished += 1;
	} else {
		dontSpinImg();
	}
	if (finished === 8) {
		document.getElementById('scores').remove();
		Modal();
	}
}

function disableCards() {
	imgOne.removeEventListener('click', turnImage);
	imgTwo.removeEventListener('click', turnImage);

	resetSurface();
}

function dontSpinImg() {
	lockSurface = true;

	setTimeout(function () {
		imgOne.classList.remove('spin');
		imgTwo.classList.remove('spin');

		resetSurface();
	}, 800);
}

function resetSurface() {
	IfTurnedImg = false;
	lockSurface = false;
	imgOne = '';
	imgTwo = '';
}
// immediately invoked funktion expression (https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
(function shuffle() {
	images.forEach((img) => {
		let random = Math.floor(Math.random() * 16);
		img.style.order = random;
	});
})();

//------------------------------------ Set evetntlistener to all images
images.forEach(myFunction);

function myFunction(img) {
	img.addEventListener('click', turnImage);
}

// Get the modal
let modal = document.getElementById('myModal');
let closeModal = document.getElementsByClassName('close')[0];
let closeMain = document.getElementById('close');
let again = document.getElementsByClassName('again')[0];

// When the user clicks on the button, open the modal
function Modal() {
	modal.style.display = 'block';
	document.getElementById(
		'game-result'
	).innerHTML = `You solved the memory in <b>${clicks}</b> click with time ${timer
		.getTimeValues()
		.toString(['minutes'])} Minutes and ${timer.getTimeValues().toString(['seconds', 'secondTenths'])} Seconds!`;
	console.log('gottit tottit', 'You make it on', clicks, ' click');
	timer.stop();
	//-------------------------- Maby use setTimeout function in the future...
	setTimeout(function () {
		console.log(clicks);
	}, 100);
}

// Clicks on <span> (x), close the modal
closeModal.onclick = function () {
	modal.style.display = 'none';
	location.href = 'index.html';
};

closeMain.onclick = function () {
	modal.style.display = 'none';
	location.href = 'index.html';
};

again.onclick = function () {
	modal.style.display = 'none';
	location.href = 'game.html';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = 'none';
		location.href = 'index.html';
	}
};
timer.start({ precision: 'secondTenths' });

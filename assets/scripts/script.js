const images = document.querySelectorAll('.images');

// -----------------------------------Game variables
let IfTurnedImg = false;
let lockSurface = false;
let imgOne, imgTwo;
let clicks = 0;
let finished = 0;
let clicksTop = 0;

//--------------------------------------- Restart
let restart = document.getElementById('restart');

//------------------------------------- Sounds
const klickSound = new Audio('assets/sounds/click_x.wav');
const wrongSound = new Audio('assets/sounds/wrong.wav');
const rightSound = new Audio('assets/sounds/right.wav');
const finishSound = new Audio('assets/sounds/finish.wav');
const warningSound = new Audio('assets/sounds/warning.wav');
let mute = true;
//------------------------------- Sound on / off
let muteSound = document.getElementById('mute-sound');
muteSound.onclick = function () {
	if (mute === true) {
		klickSound.muted = true;
		wrongSound.muted = true;
		rightSound.muted = true;
		finishSound.muted = true;
		muteSound.innerHTML = ' <i class="fas fa-volume-mute color-red"  title="Mute Off"></i> ';
		mute = false;
	} else {
		klickSound.muted = false;
		wrongSound.muted = false;
		rightSound.muted = false;
		finishSound.muted = false;
		muteSound.innerHTML = ' <i class="fas fa-volume-down"></i> ';
		mute = true;
	}
};

// --------------------------------------- Restart icon / button
restart.onclick = function () {
	if (confirm('Are you sure that you want to restart the game, press OK?',warningSound.play())) {
		location.reload();
	}
};

// ---------------------------------------- Time
let timer = new Timer();
let pauseStart = document.getElementById('pause-start');

// ---------------- Function print out the time counter (top left)
timer.addEventListener('secondTenthsUpdated', function () {
	let scoreBoard = `Clicks: ${clicksTop} <br>Time:  ${timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths'])}`;
	document.getElementById('scores').innerHTML = scoreBoard;
});

//---------------------------------------- pause the game
let onOff = true;
pauseStart.onclick = function () {
	if (onOff) {
		timer.pause();
		lockSurface = true;
		onOff = false;
		pauseStart.innerHTML = ' <i class="fas fa-pause color-red" title="Start the game"></i>  ';
	} else {
		timer.start();
		lockSurface = false;
		onOff = true;
		pauseStart.innerHTML = ' <i class="fas fa-play" title="Pause the game"></i> ';
	}
	console.log('pauseStart clicked');
};

// ---------------------Check if the image shuld turn
function turnImage() {
	if (onOff === false) {
		warningSound.play();
		alert('You paused the game when you pressed  the icon (▶) and had to press the icon (⏸) to start the game again!');
	}
	if (lockSurface) {
		return;
	}
	if (this === imgOne) {
		return;
	}
	klickSound.play();
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

// ----------------------------------  Check if the images is the same
function checkIfSame() {
	clicks += 2;
	let isMatch = imgOne.dataset.num === imgTwo.dataset.num;

	if (isMatch) {
		imgOne.classList.add('done');
		imgTwo.classList.add('done');
		// Sound play if it images match
		rightSound.play();
		// Images takes out if they are the same (cant be clicked)
		disableCards();
		// counter (top left increases)
		finished += 1;
	} else {
		dontSpinImg();
	}
	if (finished === 8) {
		
		// Delay the scores.remove function otherwise there will be a null value and an error message in the console 
		//and also delay the finish bobble sound and the Modal for better UX
		setTimeout(function () {
			document.getElementById('scores').remove();
			finishSound.play();
			Modal();
		}, 200);
	}
}

//-------------- Take away eventlistener 
function disableCards() {
	imgOne.removeEventListener('click', turnImage);
	imgTwo.removeEventListener('click', turnImage);
	resetSurface();
}

//--------------- Dont rotate image, remove spin class
function dontSpinImg() {
	lockSurface = true;
	// Timeout so the image have the time to finish
	setTimeout(function () {
		imgOne.classList.remove('spin');
		imgTwo.classList.remove('spin');
		wrongSound.play();
		resetSurface();
	}, 500);
}
// Reset the game surface
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

// Get the modal and close modal
let modal = document.getElementById('myModal');
let closeModal = document.getElementsByClassName('close')[0];
let closeMain = document.getElementById('close');
let again = document.getElementsByClassName('again')[0];

// When the user finish the game, open the modal whit the result
function Modal() {
	modal.style.display = 'block';
	let theBestResult = bestResult(clicks, timer);
	document.getElementById('game-result').innerHTML = `Memory solved in: <b style="color: rgb(0, 255, 0)";>${clicks}
	</b> clicks <b style="color: rgb(0, 255, 0)";>${timer
		.getTimeValues()
		.toString(['minutes'])}</b> Minutes <b style="color: rgb(0, 255, 0)";>${timer.getTimeValues().toString(['seconds'])}
		</b>  seconds <b style="color: rgb(0, 255, 0)";>${timer.getTimeValues().toString(['secondTenths'])} 

			</b> tenths!<br><b style="font-size:16px; color: rgb(0, 0, 0)"> 💥${theBestResult} 💥`;
	//localStorage.clear();
	console.log(theBestResult);
	timer.stop();
}

//--------------------------------- Save the best restult ----------------
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

function bestResult(clicks, timer) {
	// Turn all variables into strings as Window.localStorage only takes strings
	let clicksStr = clicks.toString();
	let timeMinStr = timer.getTimeValues().toString(['minutes']);
	let timeSekStr = timer.getTimeValues().toString(['seconds']);
	let timeTenthsStr = timer.getTimeValues().toString(['secondTenths']);
	
	//Make the time variables into number so i can use them to compare
	timeMinNum = parseInt(timeMinStr, 10);
	timeSekNum = parseInt(timeSekStr, 10);
	timeTenthsNum = parseInt(timeTenthsStr, 10);

	// First check if Web Storage support..
	if (typeof Storage !== 'undefined') {
		// Code for localStorage/sessionStorage.
		if (localStorage.length === 0) {
			tempData = clicksStr + timeMinStr + timeSekStr + timeTenthsStr;
			localStorage.setItem('myRecord', tempData);
			localStorage.setItem(
				'theFinalRecord',
				`HighScore: ${clicksStr} Clicks, Time: ${timeMinStr} Minutes ${timeSekStr} Seconds and ${timeTenthsStr} Tenths`
			);
			return localStorage.getItem('theFinalRecord');
		} else {
			tempData = localStorage.getItem('myRecord');
			tempData = parseInt(tempData, 10);
			myRecord = clicksStr + timeMinStr + timeSekStr + timeTenthsStr;
			myRecord = parseInt(myRecord, 10);
			if (myRecord < tempData) {
				tempData = clicksStr + timeMinStr + timeSekStr + timeTenthsStr;
				localStorage.setItem('myRecord', tempData);
				localStorage.setItem(
					'theFinalRecord',
					`HighScore: ${clicksStr} Clicks, Time: ${timeMinStr} Minutes ${timeSekStr} Seconds and ${timeTenthsStr} Tenths`
				);
				return localStorage.getItem('theFinalRecord');
			} else {
				return localStorage.getItem('theFinalRecord');
			}
		}
	} else {
		// Sorry! No Web Storage support..
		console.log('Sorry! No Web Storage support');
		return 'Sorry! No Web Storage support';
	}
}

// Clicks on <span> (x on the top right), close the modal
closeModal.onclick = function () {
	modal.style.display = 'none';
	location.href = 'index.html';
};

// close the modal
closeMain.onclick = function () {
	modal.style.display = 'none';
	location.href = 'index.html';
};
// Play again text function
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
//---------- Start the time in the game
timer.start({ precision: 'secondTenths' });

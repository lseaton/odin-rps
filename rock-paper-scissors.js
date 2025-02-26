//TODO: (if you'd like)
//Add hurt animation (short red+shake) to the wizard and knight sprites when they lose a round
//Make audio default muted, but prompt the user to turn on audio, recommended.

const options = ["rock", "paper", "scissors"];
//Array for the matrices representing different bar rotations, ascending from -15 to 15 by fives
const matRotation = [
	"matrix(0.965926, -0.258819, 0.258819, 0.965926, 0, 0)",
	"matrix(0.984808, -0.173648, 0.173648, 0.984808, 0, 0)",
	"matrix(0.996195, -0.0871557, 0.0871557, 0.996195, 0, 0)",
	"matrix(1, 0, 0, 1, 0, 0)",
	"matrix(0.996195, 0.0871557, -0.0871557, 0.996195, 0, 0)",
	"matrix(0.984808, 0.173648, -0.173648, 0.984808, 0, 0)",
	"matrix(0.965926, 0.258819, -0.258819, 0.965926, 0, 0)",
];
const degRotation = [-15, -10, -5, 0, 5, 10, 15];
const bar = document.getElementById("bar");
const left = document.getElementById("left");
const right = document.getElementById("right");
const leftDivs = Array.prototype.slice.call(left.children); //all div children of the left side, as an array
const rightDivs = Array.prototype.slice.call(right.children); //all div children of the right side, as an array
const humanWinsRound = new Audio("./audio/retro-coin-1.mp3");
const computerWinsRound = new Audio("./audio/retro-hurt-1.mp3");
const tieRound = new Audio("./audio/retro-select.mp3");
const youLose = new Audio("./audio/you-lose.mp3");
const youWin = new Audio("./audio/you-win.mp3");

let numRounds = 0;
let muted = false;

humanWinsRound.volume = 0.2;
computerWinsRound.volume = 0.2;
tieRound.volume = 0.1;
youLose.volume = 0.3;
youWin.volume = 0.4;

window.onload = function () {
	document.getElementById("music").volume = 0.4;
	document.getElementById("music").play();
	for (let i = 0; i < 3; i++) {
		document.querySelectorAll(".shimmer")[i].style.visibility = "hidden";
	}
};

function toggleMute() {
	let music = document.getElementById("music");
	muted ? music.play() : music.pause();
	let icon = document.getElementById("mute-icon");
	let currIconSrc = icon.src;
	let newIconSrc = currIconSrc.toString().includes("/img/unmute.png")
		? "./img/mute.png"
		: "./img/unmute.png";
	icon.src = newIconSrc;
	muted = !muted;
}

function focusMuteBtn() {
	document.querySelector(".mute-btn").style.boxShadow = "0px 0px 12px";
}
function unfocusMuteBtn() {
	document.querySelector(".mute-btn").style.boxShadow = "0px 0px 0px";
}
function focusUp(c) {
	document.querySelector(c + " .shimmer").style.visibility = "visible";
	followMouse(c);
}
function unfocus(c) {
	document.querySelector(c + " .shimmer").style.visibility = "hidden";
	unfollowMouse(c);
}

function playRound(humanChoice) {
	let computerChoice = options[Math.floor(Math.random() * options.length)];
	let computerIndex = options.indexOf(computerChoice);
	let humanIndex = options.indexOf(humanChoice);
	let message = document.getElementById("message");

	numRounds++;
	message.textContent = "I chose " + computerChoice + ", ";

	if (humanIndex != computerIndex) {
		if (computerIndex + 2 == humanIndex || computerIndex - 1 == humanIndex) {
			//Computer wins this round
			changeWeight(-1);
			if (!muted) {
				computerWinsRound.play();
			}
			if (!isGameOver()) {
				message.textContent +=
					"and " +
					computerChoice +
					" beats " +
					humanChoice +
					". I win this round.";
			} else {
				//Computer wins game
				gameOver("computer");
			}
		} else {
			//Human wins this round
			changeWeight(1);
			if (!muted) {
				humanWinsRound.play();
			}
			if (!isGameOver()) {
				message.textContent +=
					"but " +
					humanChoice +
					" beats " +
					computerChoice +
					". You win this round.";
			} else {
				//Human wins game
				gameOver("human");
			}
		}
	} else {
		//Tie
		message.textContent += "so it's a tie.";
		if (!muted) {
			tieRound.play();
		}
	}
}

//Check if game should be over, return string indicating the winner if so and false if not
function isGameOver() {
	let matrix = window.getComputedStyle(bar).transform.toString();
	return matrix == matRotation[0] || matrix == matRotation[6];
}

function gameOver(winner) {
	document.getElementById("music").pause();
	let message = document.getElementById("message");
	if (winner == "human") {
		if (!muted) {
			youWin.play();
		}
		message.textContent =
			"Your intuition has served you well! Having fought bravely for " +
			numRounds +
			" rounds, you have proven yourself worthy of becoming a knight of the realm.";
	} else {
		if (!muted) {
			youLose.play();
		}
		message.textContent =
			"Alas, your intuition failed you. You fought bravely for " +
			numRounds +
			" rounds, but you shall not become a knight today.";
	}
	//Disable the options
	let weapons = document.querySelectorAll(".options div");
	let weaponClasses = [".rock", ".paper", ".scissors"];
	for (let i = 0; i < weaponClasses.length; i++) {
		unfocus(weaponClasses[i]);
	}
	for (let i = 0; i < weapons.length; i++) {
		weapons[i].onclick = null;
		weapons[i].onmouseover = null;
		weapons[i].style.opacity = "0.5";
	}
}

//Make the scales appear to be weighed more in one direction
function changeWeight(val) {
	let br = getNewBarRotation(val); //bar rotation
	let lyt = getNewTransforms(br)[0]; //left y transform
	let ryt = getNewTransforms(br)[1]; //right y transform
	//rotate bar
	bar.style.transform = "rotate(" + br + "deg)";
	//transform left elements and right elements, one down and one up
	leftDivs.forEach((d) => (d.style.transform = "translateY(" + lyt + "px)"));
	rightDivs.forEach(
		(d) => (d.style.transform = "translate(200px, " + ryt + "px)")
	);
}

function getNewBarRotation(step) {
	let matrix = window.getComputedStyle(bar).transform.toString(); //retrieves the current rotation matrix in a string form
	if (matrix == "none") {
		//this sometimes happens when the bar is level
		newRotation = degRotation[3 + step];
	} else {
		let rotationIndex = matRotation.indexOf(matrix);
		var newRotation;
		if (rotationIndex + step >= 0 || rotationIndex + step <= 6) {
			newRotation = degRotation[rotationIndex + step];
		} else {
			newRotation = degRotation[rotationIndex];
		}
	}
	return newRotation;
}

function getNewTransforms(rotation) {
	let lyt = rotation * -2; //left y transform
	let ryt = rotation * 2; //right y transform
	if (rotation != 0) {
		//minor adjustments to make it look better
		if (rotation == Math.abs(rotation)) {
			lyt += 5;
		} else {
			ryt += 5;
		}
	}
	return [lyt, ryt];
}

/////Code in this section below modified from an article by Armando Canals for a 3D effect.
// https://www.armandocanals.com/posts/CSS-transform-rotating-a-3D-object-perspective-based-on-mouse-position.html.
function followMouse(weaponClass) {
	let constrain = 20;
	let mouseOverContainer = document.querySelector(weaponClass);
	let imgLayer = document.querySelector(weaponClass + " img");

	function transforms(x, y, el) {
		let box = el.getBoundingClientRect();
		let calcX = -(y - box.y - box.height / 2) / constrain;
		let calcY = (x - box.x - box.width / 2) / constrain;

		return (
			"perspective(100px) " +
			"   rotateX(" +
			calcX +
			"deg) " +
			"   rotateY(" +
			calcY +
			"deg) "
		);
	}

	function transformElement(el, xyEl) {
		el.style.transform = transforms.apply(null, xyEl);
	}

	mouseOverContainer.onmousemove = function (e) {
		let xy = [e.clientX, e.clientY];
		let position = xy.concat([imgLayer]);

		window.requestAnimationFrame(function () {
			transformElement(imgLayer, position);
		});
	};
}
//////End section for Armando Canals

function unfollowMouse(weaponClass) {
	let mouseOverContainer = document.querySelector(weaponClass);
	mouseOverContainer.onmousemove = null;
}

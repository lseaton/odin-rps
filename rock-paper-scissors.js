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
const rockWins = new Audio("./audio/clang.mp3");
const paperWins = new Audio("./audio/rustle-paper.mp3");
const scissorsWins = new Audio("./audio/snip.mp3");
let humanScore = 0;
let computerScore = 0;
let muted = false;

window.onload = function () {
	document.getElementById("music").play();
};

//TODO: when user refreshes the page, the toggle botton doesn't work for the next two clicks. Fix this.
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

function clickRock() {
	playRound("rock");
}
function clickPaper() {
	playRound("paper");
}
function clickScissors() {
	playRound("scissors");
}

function playRound(humanChoice) {
	let computerChoice = options[Math.floor(Math.random() * options.length)];
	let computerIndex = options.indexOf(computerChoice);
	let humanIndex = options.indexOf(humanChoice);
	let message = document.getElementById("message");

	console.log(options[computerIndex]);
	message.textContent = "I chose " + computerChoice + ", ";

	if (humanIndex != computerIndex) {
		if (computerIndex + 2 == humanIndex || computerIndex - 1 == humanIndex) {
			changeWeight(-1);
			computerScore++;
			message.textContent +=
				"and " + computerChoice + " beats " + humanChoice + ". I win.";
			playSound(computerChoice);
		} else {
			changeWeight(1);
			humanScore++;
			message.textContent +=
				"but " + humanChoice + " beats " + computerChoice + ". You win.";
			playSound(humanChoice);
		}
	} else {
		message.textContent += "so it's a tie.";
		playSound(computerChoice);
	}
}

function playSound(sound) {
	if (!muted) {
		switch (sound) {
			case "rock":
				rockWins.play();
				break;
			case "paper":
				paperWins.play();
				break;
			case "scissors":
				scissorsWins.play();
				break;
			default:
				pass;
		}
	}
}

function changeWeight(val) {
	let br = getNewBarRotation(val); //bar rotation
	let lyt = getNewTransforms(br)[0]; //left y transform
	let ryt = getNewTransforms(br)[1]; //right y transform
	//rotate bar
	bar.style.transform = "rotate(" + br + "deg)";
	//transform left elements down and right elements up
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

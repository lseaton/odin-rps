const options = ["rock", "paper", "scissors"];
let humanScore = 0;
let computerScore = 0;

function getComputerChoice() {
	return options[Math.floor(Math.random() * options.length)];
}

function getHumanChoice() {
	return prompt("Enter rock, paper, or scissors:").toLowerCase();
}

function playRound() {
	let humanIndex = options.indexOf(getHumanChoice()); //no error-catching for bad input because the write-in prompt will eventually be replaced with buttons anyway
	let computerIndex = options.indexOf(getComputerChoice());
	console.log(options[computerIndex]);

	if (humanIndex != computerIndex) {
		if (computerIndex + 2 == humanIndex || computerIndex - 1 == humanIndex) {
			console.log("computer wins");
			computerScore++;
		} else {
			console.log("human wins");
			humanScore++;
		}
	} else {
		console.log("tie");
	}
}

/*for (let i = 0; i < 5; i++) {
	playRound();
}

if (humanScore != computerScore) {
	console.log(
		humanScore > computerScore ? "You win the game!" : "Computer wins the game"
	);
} else {
	console.log("The game is a tie!");
}*/

////////////////////////////
////// Scales section //////
////////////////////////////
//Array for the matrices representing different rotations, ascending from -15 to 15 by fives
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
let leftDivs = Array.prototype.slice.call(left.children); //all div children of the left side, as an array
let rightDivs = Array.prototype.slice.call(right.children); //all div children of the right side, as an array

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

function leftButton() {
	changeWeight(-1);
}
function rightButton() {
	changeWeight(1);
}

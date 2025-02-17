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

for (let i = 0; i < 5; i++) {
	playRound();
}

if (humanScore != computerScore) {
	console.log(
		humanScore > computerScore ? "You win the game!" : "Computer wins the game"
	);
} else {
	console.log("The game is a tie!");
}

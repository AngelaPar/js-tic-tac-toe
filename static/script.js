console.log("Loading");

// design
const gameBoard = (() => {
	const boardArray = [null, null, null, null, null, null, null, null, null];
	const board = document.getElementById("gameBoard");
	const squareBox = document.querySelectorAll(".squareBox");
	const displayBoard = () => {
		for (let i = 0; i <= boardArray.length; i++) {
			const square = document.querySelector(`.gameBoard .squareBox[data-board-index="${i}"]`);
			if (boardArray[i] === "O") square.textContent = "O";
			else if (boardArray[i] === "X") {
				square.textContent = "X";
			}
		}
	};
	const ifWon = () => {
		const winningPos = [
			// horizontal
			boardArray.slice(0, 3),
			boardArray.slice(3, 6),
			boardArray.slice(6), 
			// vertical 
			[boardArray[0], boardArray[3], boardArray[6]],
			[boardArray[1], boardArray[4], boardArray[7]],
			[boardArray[2], boardArray[5], boardArray[8]],
			// diagonal
			[boardArray[0], boardArray[4], boardArray[8]],
			[boardArray[2], boardArray[4], boardArray[6]]
		]
		console.log("testing!! Winning positions");
		winningPos.forEach(function(pos) {
			if (arraysEqual(["O","O","O"], pos)) {
				console.log("O wins!");
			}
			else if (arraysEqual(["X", "X", "X"], pos)) {
				console.log("X wins!");
			}
		});
	}
	const ifTie = () => {
		let takenSpots = document.querySelectorAll(".gameBoard .squareBox.error");
		console.log("Num of taken spots: " + takenSpots.length);
		if (takenSpots.length === 9) console.log("It's a tie!");
	}
	return {displayBoard, boardArray, squareBox, ifWon, ifTie};
})();

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
// if(arraysEqual(["O","X","O"],["O","O","O"])) {
// 	console.log("arrays equal");
// }

console.log("TEST: " + gameBoard.displayBoard());

// logic
const displayController = (() => {
	const switchTurn = () => {
		let lastPlayerMove;
		gameBoard.squareBox.forEach(function(square) {
			square.onclick = e => {
				const markIndex = e.target.dataset.boardIndex
				console.log(`MARK POSITION: ${markIndex}`)
				square = document.querySelector(`.gameBoard .squareBox[data-board-index="${markIndex}"]`);
				// console.log("Square box clicked! index: " + e.target.dataset.boardIndex);
			 	if (!square.textContent) {
			 		lastPlayerMove === "X" ? gameBoard.boardArray[markIndex] = "O" : gameBoard.boardArray[markIndex] = "X";			 		
			 	}
				// gameBoard.boardArray[markIndex] = square.textContent;	
				gameBoard.displayBoard();
				console.log(gameBoard.boardArray[markIndex])
				lastPlayerMove = square.textContent;
				square.classList.add("error");
				// console.log(gameBoard.boardArray[markIndex]);
				// console.log(square.textContent);
				gameBoard.ifWon();
				gameBoard.ifTie();
				// console.log(gameBoard.boardArray);
			}
		});	
	}
	return {switchTurn};
})();
displayController.switchTurn();

const player = (playerType) => {
}

const player1 = player("player1");
const player2 = player("player2");

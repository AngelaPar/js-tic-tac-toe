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
	const indicateSpotIsTaken = () => {
		squareBox.forEach(function(square) {
			square.onmouseover = () => {
				if (square.textContent) {
					square.classList.add("error");
				}
			}
		});
	}
	const ifWon = () => {
		console.log(boardArray.slice(0, 3));
		if(arraysEqual(["O","O","O"],boardArray.slice(0, 3))) {
			console.log("YALL WIN");
		}
	}
	return {displayBoard, boardArray, squareBox, indicateSpotIsTaken, ifWon};
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
				// console.log(gameBoard.boardArray[markIndex]);
				// console.log(square.textContent);
				gameBoard.ifWon()
				// console.log(gameBoard.boardArray);
			}
		});	
	}
	return {switchTurn};
})();
gameBoard.indicateSpotIsTaken();
displayController.switchTurn();

const player = (playerType) => {
}

const player1 = player("player1");
const player2 = player("player2");

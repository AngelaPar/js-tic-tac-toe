console.log("Loading");

const gameBoard = (() => {
	const boardArray = ["O", null, "O", null, "X", null, null, null, "X"];
	const board = document.getElementById("gameBoard");
	const displayBoard = () => {
		for (let i = 0; i <= boardArray.length; i++) {
			const square = document.querySelector(`.gameBoard .squareBox[data-board-index="${i}"]`);
			if (boardArray[i] === "O") {
				square.textContent = "O";
			}
			else if (boardArray[i] === "X") {
				square.textContent = "X";
			}
		}
	};
	return {displayBoard};
})();

console.log("TEST: " + gameBoard.displayBoard());

const displayController = (() => {
	const squareBox = document.querySelectorAll(".squareBox");
	squareBox.forEach(function(square) {
		square.onclick = function(e) {
			const markIndex = e.target.dataset.boardIndex
			const square = document.querySelector(`.gameBoard .squareBox[data-board-index="${markIndex}"]`);
			// console.log("Square box clicked! index: " + e.target.dataset.boardIndex);
			square.textContent = "X";
			console.log(square.textContent);
		}
	})
})();

const Player = () => {
}

console.log("Loading");

const player = (() => {
	const player1 = document.getElementById('player1');
	const player2 = document.getElementById('player2');
	const player1Name = document.getElementById('player1Name');
	const player2Name = document.getElementById('player2Name');
	const updateNames = () => {
		if (player1.value.trim()) player1Name.textContent = player1.value;
		else player1Name.textContent = "PLAYER 1";

		if (player2.value.trim()) player2Name.textContent = player2.value;
		else player2Name.textContent = "PLAYER 2";	
	}
	const getName = (player) => {
		if (player == "player1") return player1Name.textContent;
		else if (player === "player2") return player2Name.textContent;
	}
	return {updateNames, getName}
})();



// design
const gameBoard = (() => {
	let boardArray = [null, null, null, null, null, null, null, null, null];
	const board = document.getElementsByClassName("gameBoard")[0];
	const squareBox = document.querySelectorAll(".squareBox");
	let takenSpots = document.querySelectorAll(".gameBoard .squareBox.error");
	const displayBoard = () => {
		for (let i = 0; i <= boardArray.length; i++) {
			const square = document.querySelector(`.gameBoard .squareBox[data-board-index="${i}"]`);
			if (boardArray[i] === "O") square.textContent = "O";
			else if (boardArray[i] === "X") square.textContent = "X";
			else if (boardArray[i] === null) square.textContent = "";
		}
	};
	const ifWon = () => {
		let winner; 
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
			// return arraysEqual(["O","O","O"], pos) || arraysEqual(["X", "X", "X"], pos)
			if (arraysEqual(["X", "X", "X"], pos)) {
				// alert("X wins!");
				winner = player.getName("player1");
				board.classList.add("disableClick");
			}
			else if (arraysEqual(["O","O","O"], pos)) {
				// alert("O wins!");
				winner = player.getName("player2");
				board.classList.add("disableClick");
			}
		});
		return winner;
		// return false;
	}
	const ifTie = () => {
		console.log("Num of taken spots: " + takenSpots.length);
		return takenSpots.length === 9;
	}
	const clearBoard = () => {
		boardArray = [null, null, null, null, null, null, null, null, null];
		takenSpots.forEach(function(spot) {spot.classList.remove("error");});
		console.log("clearing board...");
		displayBoard();
		return boardArray
	}
	return {displayBoard, boardArray, squareBox, ifWon, ifTie, board, clearBoard};
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

// logic
const displayController = (() => {
	const subtitle = document.querySelector('#subtitle');
	const restartBtn = document.querySelector('#restartBtn');
	const twoPlayersConfig = document.querySelector('.twoPlayersConfig');
	const inGameDisplay = document.querySelector('.inGame');
	const gameMenu = document.querySelector('.gameMenu');
	const switchTurn = () => {
		let lastPlayerMove;
		gameBoard.squareBox.forEach(function(square) {
			// console.log(square);
			square.onclick = e => {
				const markIndex = e.target.dataset.boardIndex
				console.log(`MARK POSITION: ${markIndex}`)
				square = document.querySelector(`.gameBoard .squareBox[data-board-index="${markIndex}"]`);
				// console.log("Square box clicked! index: " + e.target.dataset.boardIndex);
			 	if (square.textContent === "") {
			 		lastPlayerMove === "X" ? gameBoard.boardArray[markIndex] = "O" : gameBoard.boardArray[markIndex] = "X";			 		
			 	}
			 	else console.error("spot's already taken.");
				gameBoard.displayBoard();
				console.log(gameBoard.boardArray[markIndex])
				lastPlayerMove = square.textContent;
				square.classList.add("error");
				if (gameBoard.ifWon()) {
					let winner = gameBoard.ifWon();
					changeTitle(winner + " has won!");
					restartBtn.classList.toggle("displayNone");
				}
				else if (gameBoard.ifTie()) {
					changeTitle("It's a tie!");
					restartBtn.classList.toggle("displayNone");
				}
			}
		});	
	}
	const chooseGameMode = () => {
		const modeBtn = document.querySelectorAll('.gameMenu .btn');
	}
	const goToMenu = document.querySelectorAll('.goToMenu');
	console.log("menu elem: " + goToMenu);
	goToMenu.forEach(function(btn) {
		btn.onclick = function() {
			console.log("going to menu...")
			gameMenu.classList.remove("displayNone");
			twoPlayersConfig.classList.add("displayNone");
			inGameDisplay.classList.add("displayNone");
		} 
	});
	const startGame = () => {
		const btns = document.querySelectorAll('.startGameBtn');
		btns.forEach(function(btn) {
			btn.onclick = function() {
				gameMenu.classList.add("displayNone");
				inGameDisplay.classList.remove("displayNone");
				subtitle.textContent = "";
				player.updateNames();
			} 
		});
		restartBtn.onclick = function() {
			console.warn("RESTART GAME");
			gameBoard.boardArray = gameBoard.clearBoard();
			changeTitle("default");
			restartBtn.classList.toggle("displayNone");
			gameBoard.board.classList.remove("disableClick");
		} 
	}
	const changeTitle = (titleName) => {
		let title = document.querySelector("#title");
		if (titleName === "default") changeTitle("tic-tac-toe");
		else title.textContent = titleName;
	}
	const switchMode = ((mode) => {
		const twoPlayersMode = document.getElementById('twoPlayersMode');
		const computerMode = document.getElementById('computerMode');
		const impossibleMode = document.getElementById('impossibleMode');
		twoPlayersMode.onclick = function() {
			twoPlayersConfig.classList.remove('displayNone');
		} 
		computerMode.onclick = function() {
			alert("bot players");
			gameMenu.classList.add("displayNone");
			inGameDisplay.classList.remove("displayNone");
		}
		impossibleMode.onclick = function() {
			alert("ai players");
			gameMenu.classList.add("displayNone");
			inGameDisplay.classList.remove("displayNone");

		}
		// if (mode === "2p") {
		// 	twoPlayersConfig.classList.remove("displayNone");
		// }
		// else if (mode === "pVsBot") {
			
		// }
		// // player vs Sam(unbeatable AI)
		// else if (mode === "pVsSam") {

		// }
	})();
	return {switchTurn, startGame};
})();
displayController.switchTurn();
displayController.startGame();

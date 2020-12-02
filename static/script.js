const player = (name, playerType) => {
	const player1Name = document.getElementById('player1Name');
	const player2Name = document.getElementById('player2Name');
	const info = () => {
		console.log(`Player ${name}, ${playerType}`);
	}	
	const displayName = () => {
		if (playerType === "player1") {
			player1Name.textContent = validatePlayerName();
		}
		else if (
			playerType === "player2" || 
			playerType === "bot") {
			player2Name.textContent = validatePlayerName();
		}
	}
	const validatePlayerName = () => {
		if (playerType === "player1" && !name.trim()) {
			name = "PLAYER 1";
		}
		else if (playerType === "player2" && !name.trim()) {
			name = "PLAYER 2";
		}
		return name;
	}
	return {name, info, displayName}
};

const gameBoard = (() => {
	let boardArray = [null, null, null, null, null, null, null, null, null];
	const board = document.getElementsByClassName("gameBoard")[0];
	const squareBox = document.querySelectorAll(".squareBox");
	let takenSpots = document.querySelectorAll(".gameBoard .squareBox.error");
	const emptySpots = document.querySelectorAll(".gameBoard .squareBox:not(.error)");
	const displayBoard = () => {
		for (let i = 0; i <= boardArray.length; i++) {
			const square = document.querySelector(`.gameBoard .squareBox[data-board-index="${i}"]`);
			if (boardArray[i] === "O") square.textContent = "O";
			else if (boardArray[i] === "X") square.textContent = "X";
			else if (boardArray[i] === null) square.textContent = "";
		}
	};
	const markRandomSpot = () => {
		let square, randomSpot;
		let randomPos = Math.floor(Math.random() * boardArray.length);
		while (boardArray[randomPos] !== null) {
			randomPos = Math.floor(Math.random() * boardArray.length);
		}
		boardArray[randomPos] = "O";
		square = document.querySelector(`.gameBoard .squareBox[data-board-index="${randomPos}"]`);
		square.classList.add('error');
	} 

	const numTakenSpots = () => {
		let total = 0;
		for (let spot in boardArray) {
			if (boardArray[spot] !== null) {
				total++;
			}
		}
		return total;
	}
	let lastPlayerMove;
	const switchTurn = () => {
		let randomPos, randomSpot
		squareBox.forEach(function(square) {
			square.addEventListener('click', function(e) {
				const markPosition = e.target.dataset.boardIndex
				square = document.querySelector(`.gameBoard .squareBox[data-board-index="${markPosition}"]`);
			 	if (!square.textContent) {
			 		if (mode === "pVsBot") {
			 			boardArray[markPosition] = "X";
			 			if (numTakenSpots() < 8) markRandomSpot();
			 		}
			 		else if (mode === "2p") {
			 			boardArray[markPosition] = getPlayerTurn();
			 		}
			 	}
				displayBoard();
				lastPlayerMove = square.textContent;
				square.classList.add("error");
				if (getWinner()) {
					let winner = getWinner();
					if (winner.toLowerCase() === "you") {
						displayController.changeTitle(winner + " win!");
					}
					else {
						displayController.changeTitle(winner + " wins!");
					}
					restartBtn.classList.remove("displayNone");
				}
				else if (ifTie()) {
					displayController.changeTitle("It's a tie!");
					restartBtn.classList.remove("displayNone");
				}
			}, false);
		});	
	}
	const getPlayerTurn = () => {
		let turn;
		lastPlayerMove === "X" ? turn = "O" : turn = "X";
		return turn;			 		
	}
	const getWinner = () => {
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
		winningPos.forEach(function(pos) {
			if (arraysEqual(["X", "X", "X"], pos)) {
				winner = displayController.getPlayer('player1').name;
				board.classList.add("disableClick");
			}
			else if (arraysEqual(["O","O","O"], pos)) { 
				winner = displayController.getPlayer('player2').name;
				board.classList.add("disableClick");
			}
		});
		return winner;
	}
	const ifTie = () => {
		return numTakenSpots() === 9;
	}
	const clearBoard = () => {
		boardArray = [null, null, null, null, null, null, null, null, null];
		lastPlayerMove = null;
		takenSpots.forEach(function(spot) {spot.classList.remove("error");});
		squareBox.forEach(function(square) {square.classList.remove("error");});
		displayController.changeTitle("default");
		restartBtn.classList.add("displayNone");
		displayBoard();
		return boardArray;
	}
	return {
		displayBoard, 
		boardArray, 
		squareBox, 
		getWinner, 
		ifTie, 
		board, 
		clearBoard, 
		switchTurn, 
		getPlayerTurn
	};
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

const displayController = (() => {
	let player1, player2;
	const restartBtn = document.querySelector('#restartBtn');
	const twoPlayersConfig = document.querySelector('.twoPlayersConfig');
	const inGameDisplay = document.querySelector('.inGame');
	const gameMenu = document.querySelector('.gameMenu');
	const player1Input = document.getElementById('player1Input');
	const player2Input = document.getElementById('player2Input');
	const showGame = () => {
		gameMenu.classList.add("displayNone");
		inGameDisplay.classList.remove("displayNone");
		twoPlayersConfig.classList.add('displayNone');			
		changeSubTitle("");
		gameBoard.board.classList.remove("disableClick");
	}
	const quitGame = () => {
		gameMenu.classList.remove("displayNone");
		twoPlayersConfig.classList.add("displayNone");
		inGameDisplay.classList.add("displayNone");
		changeTitle('default');
		changeSubTitle("default");
		gameBoard.boardArray = gameBoard.clearBoard();
	}
	const clearPlayerInput = () => {
		player1Input.value = "";
		player2Input.value = "";
	}
	const setGameModes = () => {
		const twoPlayersMode = document.getElementById('twoPlayersMode');
		const computerMode = document.getElementById('computerMode');

		[twoPlayersMode, computerMode].forEach(function(btn) {
			btn.addEventListener("click", function(e) {
				showGame();
				if (e.target.id === "twoPlayersMode") {
					mode = "2p";
					player1 = player(player1Input.value, "player1");
					if (!player1.name.trim()) player1.name = 'PLAYER 1';
					player2 = player(player2Input.value, "player2");
					if (!player2.name.trim()) player2.name = 'PLAYER 2';
				}
				else if (e.target.id === "computerMode") {
					mode = "pVsBot";
					player1 = player("You", "player1");
					player2 = player("Computer", "bot");
				}
				player1.displayName();
				player2.displayName();
			}, false);
		})
	}

	const getPlayer = (player) => {
		if (player === 'player1') return player1;
		else if (player === 'player2') return player2;
	}

	const goToMenu = document.querySelectorAll('.goToMenu');
	goToMenu.forEach(function(btn) {
		btn.addEventListener('click', function() {
			quitGame();
		}, false);
	});

	const goTwoPlayersMenu = document.querySelector('#goTwoPlayersMenu'); 
	goTwoPlayersMenu.addEventListener('click', function() {
		twoPlayersConfig.classList.remove('displayNone');		
		clearPlayerInput();
	}, false);

	restartBtn.addEventListener('click', function() {
		gameBoard.boardArray = gameBoard.clearBoard();
		showGame();
	}, false);	
	
	const changeTitle = (titleName) => {
		let title = document.querySelector("#title");
		if (titleName === "default") changeTitle("tic-tac-toe");
		else title.textContent = titleName;
	}
	const changeSubTitle = (titleName) => {
		let subtitle = document.querySelector('#subtitle');
		if (titleName === "default") changeSubTitle("have a minute to play the game you once loved?");
		else subtitle.textContent = titleName;
	}
	return {setGameModes, getPlayer, changeTitle};
})();
displayController.setGameModes();
gameBoard.switchTurn();

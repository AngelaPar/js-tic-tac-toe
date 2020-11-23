console.log("Loading");


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
			playerType === "bot" || 
		  	playerType === "unbeatableAI") {
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
	// display visual clue if player one in case they have same names
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
		console.log("testing!! Winning positions");
		winningPos.forEach(function(pos) {
			// return arraysEqual(["O","O","O"], pos) || arraysEqual(["X", "X", "X"], pos)
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
		return boardArray;
	}
	return {displayBoard, boardArray, squareBox, getWinner, ifTie, board, clearBoard};
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
	let player1, player2;
	const subtitle = document.querySelector('#subtitle');
	const restartBtn = document.querySelector('#restartBtn');
	const twoPlayersConfig = document.querySelector('.twoPlayersConfig');
	const inGameDisplay = document.querySelector('.inGame');
	const gameMenu = document.querySelector('.gameMenu');

	const twoPlayersMode = document.getElementById('twoPlayersMode');
	const computerMode = document.getElementById('computerMode');
	const impossibleMode = document.getElementById('impossibleMode');

	const player1Input = document.getElementById('player1Input');
	const player2Input = document.getElementById('player2Input');

	const player1Name = document.getElementById('player1Name');
	const player2Name = document.getElementById('player2Name');

	const showGame = () => {
		gameMenu.classList.add("displayNone");
		inGameDisplay.classList.remove("displayNone");
		twoPlayersConfig.classList.add('displayNone');			
		subtitle.textContent = "";
		gameBoard.board.classList.remove("disableClick");
	}
	// minimize code duplication here;
	const setGameModes = () => {
		twoPlayersMode.onclick = function() {
			mode = "2p";
			showGame();
			player1 = player(player1Input.value, "player1");
			player2 = player(player2Input.value, "player2");
			player1.displayName();
			player2.displayName();
		} 
		computerMode.onclick = function() {
			mode = "pVsBot";
			showGame();
			player1 = player("You", "player1");
			player2 = player("Computer", "bot");
			player1.displayName();
			player2.displayName();
		}
		impossibleMode.onclick = function() {
			mode = "pVsImpossible";
			showGame();
			player1 = player("You", "player1");
			player2 = player("Unbeatable Sam", "unbeatableAI");
			player1.displayName();
			player2.displayName();
		}
	}
	const getPlayer = (player) => {
		console.log("PLAYER1: " + player1,"PLAYER2: " + player2);
		if (player === 'player1') return player1;
		else if (player === 'player2') return player2;
	}
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
				if (gameBoard.getWinner()) {
					alert('win')
					let winner = gameBoard.getWinner();
					changeTitle(winner + " wins!");
					restartBtn.classList.toggle("displayNone");
				}
				else if (gameBoard.ifTie()) {
					changeTitle("It's a tie!");
					restartBtn.classList.toggle("displayNone");
				}
			}
		});	
	}
	const goToMenu = document.querySelectorAll('.goToMenu');
	console.log("menu elem: " + goToMenu);
	goToMenu.forEach(function(btn) {
		btn.onclick = function() {
			console.log("going to menu...");
			gameMenu.classList.remove("displayNone");
			twoPlayersConfig.classList.add("displayNone");
			inGameDisplay.classList.add("displayNone");
			gameBoard.boardArray = gameBoard.clearBoard();
		} 
	});
	const goTwoPlayersMenu = document.querySelector('#goTwoPlayersMenu'); 
	goTwoPlayersMenu.onclick = function() {
		twoPlayersConfig.classList.remove('displayNone');		
	}
	restartBtn.onclick = function() {
		console.warn("RESTART GAME");
		gameBoard.boardArray = gameBoard.clearBoard();
		changeTitle("default");
		restartBtn.classList.toggle("displayNone");
	} 
	
	// const 
	const changeTitle = (titleName) => {
		let title = document.querySelector("#title");
		if (titleName === "default") changeTitle("tic-tac-toe");
		else title.textContent = titleName;
	}
	return {setGameModes, switchTurn, getPlayer};
})();
displayController.setGameModes();
displayController.switchTurn();
window.onclick = function () {
	console.log(displayController.player1, displayController.player2)
	console.log(displayController.getPlayer('player1'));
}

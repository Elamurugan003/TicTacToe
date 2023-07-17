var origBoard; 
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [ // winning combinations
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
// returns a list of matching elements 
// select all elements which has class = 'cell'
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()); 
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
     }
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		// human player to make the turn
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}
 
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);

	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		// [index , win] - [0 , [0,4,8]]

		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};	
			// we get which winning combination index and as well the player info
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
		// after that we cannot click anywhere in the board
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
	// see if the type of the cell is number then we gonna return it
	// which means they are empty
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		// nobody won 
		
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false; 
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -1};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 1};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves_object = [];
	var prune = 0;
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = availSpots[i];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
			if(result.score == 1){
				prune = 1;
			}
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
			if(result.score == -1){
			prune = 1;
			}
		}

		newBoard[availSpots[i]] = move.index;

	 moves_object.push(move);
		if(prune === 1)
		break;
	}
 
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves_object.length; i++) {
			if  (moves_object[i].score > bestScore) {
				bestScore = moves_object[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves_object.length; i++) {
			if (moves_object[i].score < bestScore) {
				bestScore = moves_object[i].score;
				bestMove = i;
			}
		}
	}

	return moves_object[bestMove];
}

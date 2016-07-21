
var app = (function() {
	
	// declare the available moves
	var availableMoves = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
	["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
	["3", "6", "9"]];
	
	// declare the all winning combinations inside of two individual arrays
	var winningCombinationsOne = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
	["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
	["3", "6", "9"]];
	
	var winningCombinationsTwo = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
	["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
	["3", "6", "9"]];
	
	var patt = /clicked/gi;
	var lastIndex;
	// declare variable to track the current player;
	var current = playerOne;
	
	// declare player one;
	var playerOne;
	
	// declare player two;
	var playerTwo;
	
	// declare the variable that is used to check if all boxes have been filled
	var filled = 1;
	
	// declare the variable that contains all of the boxes;
	var boxes = document.getElementsByClassName("box");
	
	// declare the variable used to target the body;
	var body = document.getElementsByTagName("body")[0];
	
	// declare the variable to store the game board;
	var bodyHtml = body.innerHTML;
	
	// declare the object used to store various HTML snippets;
	var htmlSnippets = {
		
		startFile: "<div class='screen screen-start' id='start'>"
				 + "<header><h1>Tic Tac Toe</h1>"
				 + "<input type='text' class='name-1' placeholder='Player 1 Name'></input>"
				 + "<input type='text' class='name-2' placeholder='Player 2 Name'></input>"
				 + "<a href='#' class='button'>Play A Friend</a><br>"
				 + "<a href='#' class='button'>Play Computer</a>"
				 + "</header></div>",
	    
		gameOver: "<div class='screen screen-win' id='finish'>"
				+ "<header><h1>Tic Tac Toe</h1>"
				+ "<p class='message'></p>"
				+ "<a href='#' class='button'>New game</a>"
				+ "</header></div>"
		
	}
	
	// constructor that will be used to create the player objects;
	function player(turn, symbolPicture, ai, name) {
		this.turn = turn;
		this.symbolPicture = symbolPicture;
		this.ai = ai;
		this.name = name;
	}
	
	return {
		
		loadStart: function() {
			body.innerHTML = htmlSnippets.startFile;
			var twoPlayer = document.getElementsByClassName("button")[0];
			var aiPlayer = document.getElementsByClassName("button")[1];
			twoPlayer.addEventListener("click", app.twoPlayerStart, false);
			aiPlayer.addEventListener("click", app.aiPlayerStart, false);
		},
		
		twoPlayerStart: function() {
			var playerOneName = document.getElementsByClassName('name-1')[0];
			var playerTwoName = document.getElementsByClassName('name-2')[0];
			if (playerOneName.value !== "" && playerTwoName.value !== "") {
				playerOne = new player(true, './img/x.svg', false, playerOneName.value);	
				playerTwo = new player(true, './img/o.svg', false, playerTwoName.value);
				current = playerOne;
				app.renderBoard(playerOne.name, playerTwo.name);
			} else {
				alert("You must enter both player's names");
			}
		},
		
		aiPlayerStart: function() {
			var playerOneName = document.getElementsByClassName('name-1')[0];
			var playerTwoName = document.getElementsByClassName('name-2')[0];
			if (playerOneName.value !== "") {
				playerOne = new player(true, './img/x.svg', false, playerOneName.value);	
				playerTwo = new player(true, './img/o.svg', true, "Computer");
				current = playerOne;
				app.renderBoard(playerOne.name, playerTwo.name);
			} else {
				alert("You must enter player one's name");
			}
		},
		
		renderBoard: function(nameOne, nameTwo) {
			body.innerHTML = bodyHtml;
			document.getElementById('player-name-1').innerHTML = nameOne;
			document.getElementById('player-name-2').innerHTML = nameTwo;
			this.setBoardEvents();
		},
		
		setBoardEvents: function() {
			
			function clearBG() {
				if (!this.className.match(/clicked/g)) {
					this.style.backgroundImage = "none";
				}
			}
			function setBG() {
				if (!this.className.match(/clicked/g)) {
					this.style.backgroundImage = "url(" + current.symbolPicture;
				}
			}
			
			for (var i = 0; i < boxes.length; i++) {
				boxes[i].addEventListener("mouseover", setBG, false);
				boxes[i].addEventListener("mouseout", clearBG, false);
				boxes[i].addEventListener("click", function() { app.executeTurn(this) }, false);
			}
		},
		
		executeTurn: function(element) {
			if (!element.className.match(/clicked/g)) {
				
				if (current.symbolPicture[6] === 'x') {
					document.getElementById("player1").className = "players" + " " + "active";
					document.getElementById("player2").className = "players";
					element.className += " " + "box-filled-2" + " " + "clicked";
					this.popMove(element.id);
				} else {
					document.getElementById("player2").className = "players" + " " + "active";
					document.getElementById("player1").className = "players";
					element.className += " " + "box-filled-1" + " " + "clicked";
					this.popMove(element.id);
				}
				
				filled += 1;
				
				element.style.backgroundImage = "url(" + current.symbolPicture;
				
				if (current === playerOne) {
					current = playerTwo;
					if (current.ai) {
						try {
							app.executeComputerMove(element.id);
						} catch (err) {};
					}
				} else {
					current = playerOne;
				}
				
			}
		},
		
		executeComputerMove: function(last) {
			var availableMove = app.getAvailableMoves(last);
			console.log(availableMove);
			var randomArray = Math.floor(Math.random() * availableMove.length);
			var randomElement = Math.floor(Math.random() * availableMove[randomArray].length);
			try {
				var element = availableMove[randomArray][randomElement]
				document.getElementById(availableMove[randomArray][randomElement]).click();
			} catch (err) {
				console.log(err);
			};
		},
		
		getAvailableMoves: function(last) {
			var n = [];
			var lowest = [1, 1, 1];
			for (var j = 0; j < winningCombinationsOne.length; j++) {
				if (winningCombinationsTwo[j].length === 1) {
					return winningCombinationsTwo[j];
				}
				if (winningCombinationsOne[j].length < lowest.length && availableMoves[j].length > 0) {
					for (var i = 0; i < winningCombinationsTwo[j].length; i++) {
						if (winningCombinationsOne[j].length === 1) {
							return availableMoves[j];
						} else {
							n.push(availableMoves[j]);
						}
					}
				}
			}
			return n;
		},
		
		popMove: function(id) {
			
			var targetArray;
			if (current.symbolPicture[6] === 'x') {
				targetArray = winningCombinationsOne;
			} else {
				targetArray = winningCombinationsTwo;
			}
			
			for (var i = 0; i < targetArray.length; i++) {
				for (var j = 0; j < targetArray[i].length; j++) {
					if (targetArray[i][j] === id) {
						targetArray[i].splice(j, 1);
					}
				}
			}
			
			for (var i = 0; i < availableMoves.length; i++) {
				for (var j = 0; j < availableMoves[i].length; j++) {
					if (availableMoves[i][j] === id) {
						availableMoves[i].splice(j, 1);
					}
				}
			}
			
			this.checkForWinner();
		},
		
		checkForWinner: function() {
			var targetArray; 
			if (current.symbolPicture[6] === 'x') {
				targetArray = winningCombinationsOne;
			} else {
				targetArray = winningCombinationsTwo;
			}
			for (var i = 0; i < targetArray.length; i++) {
				if (targetArray[i].length <= 0) {
					body.innerHTML = htmlSnippets.gameOver;
					document.getElementsByClassName("message")[0].innerHTML = current.name + " wins!";
					document.getElementsByClassName("button")[0].addEventListener("click", app.loadStart, false);
					if (current.symbolPicture[6] === 'x') {
						var screen = document.getElementsByClassName("screen")[0];
						var message = document.getElementsByClassName("message")[0];
						screen.style.backgroundColor = "#3688C3";
						screen.style.backgroundImage = "url(img/" + current.symbolPicture[6] + "_win.svg";
						screen.style.backgroundRepeat = "no-repeat";
						screen.style.backgroundPosition = "center";
						screen.style.backgroundSize = "200px";
						this.resetGame();
					} else {
						var screen = document.getElementsByClassName("screen")[0];
						var message = document.getElementsByClassName("message")[0];
						screen.style.backgroundColor = "#FFA000";
						screen.style.backgroundImage = "url(img/" + current.symbolPicture[6] + "_win.svg";
						screen.style.backgroundRepeat = "no-repeat";
						screen.style.backgroundPosition = "center";
						screen.style.backgroundSize = "200px";
						this.resetGame();
					}
				}
			}
			if (filled === 9) {
				body.innerHTML = htmlSnippets.gameOver;
				document.getElementsByClassName("message")[0].innerHTML = "It's a draw!";
				this.resetGame();
				document.getElementsByClassName("button")[0].addEventListener("click", app.loadStart, false);
			}
		},
		
		resetGame: function() {
			clearTimeout();
			filled = 0;
			current = playerOne;
			moveLog = [];
			winningCombinationsOne = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
									 ["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
									 ["3", "6", "9"]];
			winningCombinationsTwo = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
									  ["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
									  ["3", "6", "9"]];
			availableMoves = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
							  ["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
						      ["3", "6", "9"]];
		}
		
	}
}());
app.loadStart();
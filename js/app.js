var app = (function() {
	
	
	var winningCombosX = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
	["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
	["3", "6", "9"]];
	
	var winningCombosO = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
	["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
	["3", "6", "9"]];
	
	// create the player objects
	var playerOne = new player(true, "./img/x.svg", "X", false, "blue");
	var playerTwo = new player(false, "./img/o.svg", "O", false, "orange");
	var currentPlayer = playerOne;
	// this is used to flag the initial state of the app
	var initial = true;
	var filled = 0;
	
	// get the box class elements
	var boxes = document.getElementsByClassName("box");
	
	// get the body element;
	var body = document.getElementsByTagName("body")[0];
	
	// get the innerHTML of the body for later use
	var bodyHTML = body.innerHTML;
	
	// create an object that will hold HTML snippets
	var htmlSnippets = {
		
		startFile: "<div class='screen screen-start' id='start'>"
				 + "<header><h1>Tic Tac Toe</h1>"
				 + "<input type='text' class='name' placeholder='Your name'></input>"
				 + "<a href='#' class='button'>Start game</a>"
				 + "</header></div>",
	    
		gameOver: "<div class='screen screen-win' id='finish'>"
				+ "<header><h1>Tic Tac Toe</h1>"
				+ "<p class='message'></p>"
				+ "<a href='#' class='button'>New game</a>"
				+ "</header></div>"
		
	}
	
	// create a constructor that will handle all player objects
	function player(turn, symbolPicture, symbolLetter, computer, background) {
		// turn tells whether or not it is the players turn
		this.turn = turn;
		// symbolPicture is the file path to the appropriate svg
		this.symbolPicture = symbolPicture;
		// since the program can't exactly distinguish an "X" on the SVG, this is the letter that will be used to identify the player
		this.symbolLetter = symbolLetter;
		// when this is set to true, the player is a computer player
		this.computer = computer;
		// load the background color
		this.background = background;
	}
	
	return {
		
		// the init function is responsible for creating initial state
		init: function() {
			// load the htmlSnippets startFile into the body
			this.loadStart(htmlSnippets.startFile);
		
		},
		
		// define the startTurn function to use in the program with parameters, one, two, and gameOver
		startTurn: function(one, two, element, gameOver) {
			// create an array of players to use 
			var players = [one, two];
			
			// variable used to track the current player
			var current;
			
			// make a call to function gameOver to check on the status of the game
			if (gameOver) {
				
				// call the correct function, and return 0 
				return 0;
				
				
			} else {
				
				// get the current player by finding whether or not turn is true
				current = players.filter(function(player) {
					if (player.turn) {
						return player;
					}
				});
				// get the next player by finding whether or not turn is false
				next = players.filter(function(player) {
					if (!player.turn) {
						return player;
					}
				});
				
				if (initial === true) {
					initial = false;
				}
				
				// handle the turn
				this.handle(current[0], next[0], element);
			}
			
		},
		
		handle: function(current, next, el) {
			if (current.symbolLetter === "X") {
				document.getElementById("player1").className += " " + "active";
				document.getElementById("player2").className = "players";
			} else {
				document.getElementById("player1").className = "players";
				document.getElementById("player2").className += " " + "active";
			}
			// create a regular expression that looks for the class clicked
			var patt = /clicked/gi;
			// test to see if the box has been clicked
			if (!patt.test(el.className)) {
				// check the current symbol letter, if it's X or O then append the appropriate class
				if (current.symbolLetter === "X") {
					el.className += " " + "box-filled-2" + " " + "clicked";
				} else {
					el.className += " " + "box-filled-1" + " " + "clicked";
				}
				// set the current turn to false
				current.turn = false;
				// set the next turn to true
				next.turn = true;
				// set the background
				currentPlayer = next;
				this.documentMove(current, el.id);
			}
		},
		
		
		documentMove: function(current, id) {
			filled += 1;
			if (filled === 9) {
				body.innerHTML = htmlSnippets.gameOver;
				this.resetBoard();
				document.getElementsByTagName("p")[0].innerHTML = "It's a draw!";
				document.getElementsByClassName("button")[0].addEventListener("click", function() { app.loadBody(bodyHTML) }, false); 
			}
			var targetArray;
			if (current.symbolLetter === "X") {
				targetArray = winningCombosX;
			} else {
				targetArray = winningCombosO;
			}
			for (var i = 0; i < targetArray.length; i++) {
				for (var j = 0; j < targetArray[i].length; j++) {
					if (id === targetArray[i][j]) {
						targetArray[i].splice(j, 1);
						this.checkWinner(current);
					}
				}
			}
		},
		
		
		checkWinner: function(current) {
			var targetArray;
			if (current.symbolLetter === "X") {
				targetArray = winningCombosX;
			} else {
				targetArray = winningCombosO;
			}
			for (var i = 0; i < targetArray.length; i++) {
				if (targetArray[i].length <= 0) {
					body.innerHTML = htmlSnippets.gameOver;
					this.resetBoard();
					document.getElementsByTagName("p")[0].innerHTML = current.symbolLetter + " wins the game!";
					document.getElementsByClassName("button")[0].addEventListener("click", function() { app.loadBody(bodyHTML) }, false);
				}
			}
		},
		
		// function to set the background image on all of the boxes
		setBG: function() {
			var patt = /box-filled/gi;
			if (!patt.test(this.className)) {
				this.style.backgroundImage = "url(" + currentPlayer.symbolPicture + ")";
			}
		},
		
		clearBG: function() {
			var patt = /box-filled/gi;
			if (!patt.test(this.className)) {
				this.style.backgroundImage = "";
			}
		},
		
		// loadStart is responsible for loading the start text
		loadStart: function(startState) {
			
			body.innerHTML = startState;
			document.getElementsByClassName("button")[0].addEventListener("click", function() { app.loadBody(bodyHTML) }, false);
			
		},
		
		loadBody: function(bodyHTML) {
			var playerName = document.getElementsByClassName("name")[0];
			if (playerName.value !== "") {
				this.resetArrays();
				body.innerHTML = bodyHTML;
				document.getElementById("player-name").innerHTML = playerName.value;
				for (var i = 0; i < boxes.length; i++) {
					boxes[i].addEventListener("click", function() { app.startTurn(playerOne, playerTwo, this) }, false);
					boxes[i].addEventListener("mouseover", app.setBG, false);
					boxes[i].addEventListener("mouseout", app.clearBG, false);
				}
			} else {
				alert("You must enter a name!");
			}
			
			document.getElementById("player2").className += " " + "active";
		},
		
		resetArrays: function() {
			
			winningCombosX = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
			["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
			["3", "6", "9"]];
	
			winningCombosO = [["1", "2", "3"], ["1", "4", "7"], ["1", "5", "9"], 
			["4", "5", "6"], ["7", "8", "9"], ["7", "5", "3"], ["2", "5", "8"], 
			["3", "6", "9"]];
			
		},
		
		resetBoard: function() {
			playerOne.turn = true;
			playerTwo.turn = false;
			currentPlayer = playerOne;
		}
	}

})();

app.init();

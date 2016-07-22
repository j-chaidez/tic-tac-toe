
var app = (function(_) {
	
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
	
	// regex pattern used to check for clicked elements
	var patt = /clicked/gi;

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
		
		// the loadStart function is responsible for loading the start screen
		loadStart: function() {
			// set the body's innerHTML equal to the html snippet start screen
			body.innerHTML = htmlSnippets.startFile;
			// store the buttons inside of variables and set up the event listeners
			var twoPlayer = document.getElementsByClassName("button")[0];
			var aiPlayer = document.getElementsByClassName("button")[1];
			twoPlayer.addEventListener("click", app.twoPlayerStart, false);
			aiPlayer.addEventListener("click", app.aiPlayerStart, false);
		},
		
		// twoPlayerStart is responsible for starting a human vs human game
		twoPlayerStart: function() {
			// get the name containers of the players on the game board
			var playerOneName = document.getElementsByClassName('name-1')[0];
			var playerTwoName = document.getElementsByClassName('name-2')[0];
			// check to make sure that the name field's are filled out 
			if (playerOneName.value !== "" && playerTwoName.value !== "") {
				// create the new player objects that will be used in the game
				playerOne = new player(true, './img/x.svg', false, playerOneName.value);	
				playerTwo = new player(true, './img/o.svg', false, playerTwoName.value);
				// set the current player to player one
				current = playerOne;
				// render the board of the game 
				app.renderBoard(playerOne.name, playerTwo.name);
			} else {
				// otherwise alert the player that they need to fill out the name fields 
				alert("You must enter both player's names");
			}
		},
		
		// aiPlayerStart sets up a game in which a human plays the computer
		aiPlayerStart: function() {
			// set the name containers of the players on the game board 
			var playerOneName = document.getElementsByClassName('name-1')[0];
			var playerTwoName = document.getElementsByClassName('name-2')[0];
			// since player two will always be called computer, i'm only looking to see if player one has filled out his/her name
			if (playerOneName.value !== "") {
				// create the new player objects
				playerOne = new player(true, './img/x.svg', false, playerOneName.value);	
				playerTwo = new player(true, './img/o.svg', true, "Computer");
				// set the current player equal to player one
				current = playerOne;
				// render the board of the game
				app.renderBoard(playerOne.name, playerTwo.name);
			} else {
				// otherwise alert the player that they need to fill out their name field
				alert("You must enter player one's name");
			}
		},
		
		// renderBoard is responsible for creating the game board area
		renderBoard: function(nameOne, nameTwo) {
			// insert the stored body HTML into the current body element
			body.innerHTML = bodyHtml;
			// set the names of the players on the game board
			document.getElementById('player-name-1').innerHTML = nameOne;
			document.getElementById('player-name-2').innerHTML = nameTwo;
			// set up all of the game board events
			this.setBoardEvents();
		},
		
		// setBoardEvents is responsible for creating all of the event handlers
		setBoardEvents: function() {
			
			// function used to clear the background 
			function clearBG() {
				// if the object has not been clicked, set the background image equal to none
				if (!this.className.match(/clicked/g)) {
					this.style.backgroundImage = "none";
				}
			}
			
			// function used to set the background
			function setBG() {
				// if the object has not been clicked, set the background image equal to the current symbol picture
				if (!this.className.match(/clicked/g)) {
					console.log(current.symbolPicture);
					console.log(this.style.backgroundImage);
					this.style.backgroundImage = "url(" + current.symbolPicture + ")";
				}
			}
			
			// function used to add this to executeTurn
			function exec() {
				app.executeTurn(this);
			}
			
			// iterate over the boxes
			for (var i = 0; i < boxes.length; i++) {
				// on mouseover, setBG is called
				_.addEventListener(boxes[i], "mouseover", setBG);
				// on mouseout, clearBG is called
				_.addEventListener(boxes[i], "mouseout", clearBG);
				// on click, exec is called
				boxes[i].addEventListener("click", exec, false);
			}
		},
		
		// executeTurn is responsible for all of the turn logic
		executeTurn: function(element) {
			// if the element's class name is not equal to clicked
			if (!element.className.match(/clicked/g)) {
				
				// check the current symbol
				if (current.symbolPicture[6] === 'x') {
					// get the player1 class element, set it to active
					document.getElementById("player1").className = "players" + " " + "active";
					// get the player2 class element, reset default class values
					document.getElementById("player2").className = "players";
					// set the appropriate class'
					element.className += " " + "box-filled-2" + " " + "clicked";
					// set the background image element
					element.style.backgroundImage = "url(" + current.symbolPicture + ")";
					// pop the move from the moves array
					this.popMove(element.id);
				} else {
					// do the exact same thing here, only in reverse
					document.getElementById("player2").className = "players" + " " + "active";
					document.getElementById("player1").className = "players";
					element.className += " " + "box-filled-1" + " " + "clicked";
					element.style.backgroundImage = "url(" + current.symbolPicture + ")";
					this.popMove(element.id);
				}
				
				// increment filled by one
				filled += 1;
				
				// set the background image for the element
				element.style.backgroundImage = "url(" + current.symbolPicture + ")";
				// switch the player's turns
				if (current === playerOne) {
					// if player one has the turn currently, switch to two
					current = playerTwo;
					// check to see if the second player is an AI player
					if (current.ai) {
						try {
							// if so, execute the computer move
							app.executeComputerMove(element.id);
						} catch (err) {};
					}
				} else {
					// otherwise, it's
					current = playerOne;
				}
				
			}
		},
		
		// executeComputerMove is responsible 
		executeComputerMove: function(last) {
			// get a list of available moves
			var availableMove = app.getAvailableMoves(last);
			// log for debugging purposes
			console.log(availableMove);
			// get a random element of the array
			var randomArray = Math.floor(Math.random() * availableMove.length);
			// get a random element from within the randomly selected array 
			var randomElement = Math.floor(Math.random() * availableMove[randomArray].length);
			try {
				// get an element 
				var element = availableMove[randomArray][randomElement]
				// click that element to trigger the computer move 
				document.getElementById(availableMove[randomArray][randomElement]).click();
			} catch (err) {
				// catch any errors that may occur
				console.log(err);
			};
		},
		
		// get available moves gets the 'best' move for the computer 
		getAvailableMoves: function(last) {
			// declare a local array 
			var n = [];
			// set an array that will be used as the default length for the upcoming for loop
			var lowest = [1, 1, 1];
			// loop through the winninCombinationsOne array
			for (var j = 0; j < winningCombinationsOne.length; j++) {
				// log for debugging purposes
				console.log(winningCombinationsTwo[j].length);
				// if winningCombinationsTwo[j]'s length is equal to one, and the availablesMoves[j]'s length is greater than zero, then the computer can win, return the move
				if (winningCombinationsTwo[j].length === 1 && availableMoves[j].length > 0) {
					return availableMoves[j];
				}
				// if winningCombinationsOne[j]'s length is less than or equal to the lowest's length, and available moves length is greater than zero
				if (winningCombinationsOne[j].length <= lowest.length && availableMoves[j].length > 0) {
					// loop through winningCombinationsTwo[j]'s array
					for (var i = 0; i < winningCombinationsTwo[j].length; i++) {
						// if the length is equal to one, then the computer should make a block move by choosing winningCombinationsOne[j]
						if (winningCombinationsOne[j].length === 1) {
							return availableMoves[j];
						} else {
						// else we just push the nested ararys into n
							n.push(availableMoves[j]);
						}
					}
				}
			}
			// return n
			return n;
		},
		
		// popMove is responsible for slicing out available moves so they can't be made twice
		popMove: function(id) {
			// declare an array that will be used as the target
			var targetArray;
			// check the current symbol
			if (current.symbolPicture[6] === 'x') {
				// set the appropriate array 
				targetArray = winningCombinationsOne;
			} else {
				targetArray = winningCombinationsTwo;
			}
			
			// loop over the target array
			for (var i = 0; i < targetArray.length; i++) {
				// loop over the elements of that array 
				for (var j = 0; j < targetArray[i].length; j++) {
					// splice the move that was just made
					if (targetArray[i][j] === id) {
						targetArray[i].splice(j, 1);
					}
				}
			}
			
			// do the exact same thing for available moves
			for (var i = 0; i < availableMoves.length; i++) {
				for (var j = 0; j < availableMoves[i].length; j++) {
					if (availableMoves[i][j] === id) {
						availableMoves[i].splice(j, 1);
					}
				}
			}
			// check for a winner
			this.checkForWinner();
		},
		
		// check for winner is responsible for checking for a winner
		checkForWinner: function() {
			// declare a target array
			var targetArray; 
			// check the current player
			if (current.symbolPicture[6] === 'x') {
				// select the appropriate array 
				targetArray = winningCombinationsOne;
			} else {
				targetArray = winningCombinationsTwo;
			}
			// loop through the target array 
			for (var i = 0; i < targetArray.length; i++) {
				// if the target array's length is less than or equal to zero 
				if (targetArray[i].length <= 0) {
					// that means someone has won, show the game over page 
					body.innerHTML = htmlSnippets.gameOver;
					// show who won!
					document.getElementsByClassName("message")[0].innerHTML = current.name + " wins!";
					// add the loadstart function to the button 
					document.getElementsByClassName("button")[0].addEventListener("click", app.loadStart, false);
					// check the current player's symbol
					if (current.symbolPicture[6] === 'x') {
						// get the screen class
						var screen = document.getElementsByClassName("screen")[0];
						// get the message class
						var message = document.getElementsByClassName("message")[0];
						// style the background color and image 
						screen.style.backgroundColor = "#3688C3";
						screen.style.backgroundImage = "url('img/" + current.symbolPicture[6] + "_win.svg')";
						screen.style.backgroundRepeat = "no-repeat";
						screen.style.backgroundPosition = "center";
						screen.style.backgroundSize = "200px";
						// reset the game 
						this.resetGame();
					} else {
						// do the exact same thing only for O
						var screen = document.getElementsByClassName("screen")[0];
						var message = document.getElementsByClassName("message")[0];
						screen.style.backgroundColor = "#FFA000";
						screen.style.backgroundImage = "url('img/" + current.symbolPicture[6] + "_win.svg')";
						screen.style.backgroundRepeat = "no-repeat";
						screen.style.backgroundPosition = "center";
						screen.style.backgroundSize = "200px";
						this.resetGame();
					}
				}
			}
			// check for a tie by checking how many squares are filled
			if (filled === 9) {
				// show the gameOver snippet
				body.innerHTML = htmlSnippets.gameOver;
				document.getElementsByClassName("message")[0].innerHTML = "It's a draw!";
				// reset the game
				this.resetGame();
				document.getElementsByClassName("button")[0].addEventListener("click", app.loadStart, false);
			}
		},
		
		
		// reset the game by setting all variables back to their defaults
		resetGame: function() {
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
}(Core));
// load the program on initialize
app.loadStart();
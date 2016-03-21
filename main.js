		//adds the event listeners to be triggered when everything has loaded
	window.addEventListener("load", onWindowLoad, false);
	
	function onWindowLoad(){
		//calls the main function after the window event has triggerd
		canvasApp();
	}
		
	//function part of the modernizr to check if canvas is supported.
	
	function canvasSupport () {
    return Modernizr.canvas;
}
	
	function canvasApp(){
		
		//if the opposite of canvas support is true, means there is no support and exits the program.
		if(!canvasSupport()){
			return;
		}
		
		//creates the canvas objet and gets its context.
		var theCanvas = document.getElementById("theCanvas");
		var context = theCanvas.getContext("2d");
		var pauseButton = document.getElementById("pauseButton");
		var gameOn = true;
		theCanvas.addEventListener("mousedown", onMouseDown, false);
		
		
		
		//adds event listener to puase button.
		pauseButton.addEventListener("click", onPause, false);
		
		var canvasBound = theCanvas.getBoundingClientRect();
		var oldX;
		var oldY;
		var newX;
		var newY;
		var time=0;
		
		var moveBall = false;
		
		
		var ball = {radius:20, x:10, y:theCanvas.height/2, color:"#00FF00", angle:-45, speed:5, velX:0, velY:0, nextX:0, nextY:0, elasticity:0.80};
		
		var gravity = 0.2;
		var friction = 0.01;
		
		ball.x = theCanvas.width/2;
		ball.y = theCanvas.height/2;
		
		ball.nextX = ball.x;
		ball.nextY = ball.y;
		ball.angle = ball.angle * Math.PI / 180;
		ball.velX = Math.cos(ball.angle)*ball.speed;
		ball.velY = Math.sin(ball.angle)*ball.speed;
		
		//begins the game loop.
		gameLoop();
		
		//function in charge of doing all the drawing.
		function drawScreen(){
			
			
			//Clears the canvas on every call.
			context.fillStyle = "rgba(255,255,255, 0.4)";
			context.fillRect(0,0, theCanvas.width, theCanvas.height);
			
			//updates the ball x and y speed comp
			ball.velY += gravity;
			ball.velX = ball.velX - (ball.velX*friction);
			
			ball.nextX += ball.velX;
			ball.nextY += ball.velY;
			
			
			
			
			ball.x = ball.nextX;
			ball.y = ball.nextY;
			
			checkBoundary(ball);
			
				//draws a circle
			context.fillStyle = ball.color;
			context.beginPath();
			context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();

		}
		
		
		
		//function in charge of checking the ball against walls.
		function checkBoundary(object){

			if(object.nextX>=theCanvas.width-object.radius){
				object.nextX = theCanvas.width - object.radius;
				object.velX = -object.velX;
				//ball.angle = Math.PI - ball.angle;
				//ball.velX = Math.cos(ball.angle)*ball.speed;
				object.velX *= object.elasticity;
				
				
			}else if(object.nextX<=object.radius){
				console.log("crazy speed is " + object.x);
				object.nextX = object.radius;
				object.velX = -object.velX;
				//ball.angle = Math.PI - ball.angle;
				//ball.velX = Math.cos(ball.angle)*ball.speed;
				object.velX *= object.elasticity;
				
			
			}else if(object.nextY>=theCanvas.height-object.radius){
				object.nextY = theCanvas.height-object.radius;
				object.velY = -object.velY;
				object.velY *= object.elasticity;
				//ball.angle = Math.PI*2 - ball.angle;
				//ball.velY = Math.sin(ball.angle)*ball.speed;
				//console.log("The velocity is " + ball.velY);
				
			}else if(object.nextY<=0+object.radius){
				object.nextY = object.radius;
				object.velY = -object.velY;
				object.velY *= object.elasticity;
				//ball.angle = Math.PI*2-ball.angle;
				//ball.velY = Math.sin(ball.angle)*ball.speed;
				
			}
			
			
		}
		
		function onMouseUp(e){
			
			
			
			gravity = 0.2;
			
			
			newX = e.clientX - canvasBound.left;
			newY = e.clientY - canvasBound.top;
			
			var dx = newX - oldX;
			var dy = newY - oldY;
			var distance = Math.sqrt(dx*dx + dy*dy);
			var newAngle = Math.atan2(dy,dx);
		
			var newSpeed = distance / ball.radius;
			console.log("the new speed is " + newSpeed);
			
			
			if(moveBall){
			ball.velX = Math.cos(newAngle)*newSpeed;
			ball.velY = Math.sin(newAngle)*newSpeed;
			}
		
			console.log("distance is " + distance);
			console.log("the new angle is " + newAngle*(180/Math.PI));
			
			theCanvas.removeEventListener("mousemove", onMouseMove, false);
			moveBall = false;
			
			
			
			
			
		}
		
		function onMouseDown(e){
			
			
			
			var mouseX = e.clientX - canvasBound.left;
			var mouseY = e.clientY - canvasBound.top;
			
			
			var dx = ball.x - mouseX;
			var dy = ball.y - mouseY;
			var distance = Math.sqrt(dx*dx + dy*dy);
			
			
			
			if(distance<ball.radius){
				moveBall = true;
	
				oldX = mouseX;
				oldY = mouseY;
				
				
				theCanvas.addEventListener("mouseup", onMouseUp, false);
				theCanvas.addEventListener("mousemove", onMouseMove, false);
			}else{
				moveBall = false;
			}
			
		}
		
		function onMouseMove(e){
			
			
			if(moveBall){
			ball.velX = ball.velY = gravity = 0;
			ball.nextX = e.clientX - canvasBound.left;
			ball.nextY = e.clientY - canvasBound.top;
				
			}
			
		}
		
		//game loop functions, checks to see if game switch is on first.
		function gameLoop(){
			if(gameOn){
				window.setTimeout(gameLoop, 20);
				drawScreen();
			}
		}
		
		//pause button handler, switching the game on and off.
		function onPause(e){
			gameOn = !gameOn;
			gameLoop();
		}

	}
	
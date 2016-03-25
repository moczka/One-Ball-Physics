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
		//Creates our ball object.
		var ball = {radius:20, x:10, y:theCanvas.height/2, color:"#00FF00", angle:-45, speed:5, velX:0, velY:0, elasticity:0.80};
        //Sets our starting gravity and friction value.
		var gravity = 0.2;
		var friction = 0.01;
		var ultimateGravity = 0.2;
		
        //centers our ball.
		ball.x = theCanvas.width/2;
		ball.y = theCanvas.height/2;
		
        //converts our starting angle to radians.
		ball.angle = ball.angle * Math.PI / 180;
        
        //calculates our starting velocity given our angle.
		ball.velX = Math.cos(ball.angle)*ball.speed;
		ball.velY = Math.sin(ball.angle)*ball.speed;
	
        //set our gameOn variable to true so the game can start.
		var gameOn = true;
		var menuForm = document.getElementById("menuForm");
		
	
        //Create our canvas bounding box to properly calculate our event's X and Y location values.
		var canvasBound = theCanvas.getBoundingClientRect();
        
        //creates the old and new X and Y variables for our mouse event location
		var oldX;
		var oldY;
		var newX;
		var newY;
		var moveBall = false;

		theCanvas.addEventListener("mousedown", onMouseDown, false);
	
		//adds event listener for our pause and gravity range.
		menuForm = document.getElementById("pauseButton");
		menuForm.addEventListener("click", onPause, false);
        
		menuForm = document.getElementById("gravityRange");
		menuForm.addEventListener("change", onGravityChange, false);
		
		//begins the game loop.
		gameLoop();
		
		//function in charge of doing all the drawing.
		function drawScreen(){
			
			//Clears the canvas on every call. make use of alpha to create trailing effect.
			context.fillStyle = "rgba(255,255,255, 0.4)";
			context.fillRect(0,0, theCanvas.width, theCanvas.height);
			
			//Gravity is added to the Y component of the ball velocity vector
			ball.velY += gravity;
            
            //Friction is proportionally substracted from the X component of the velocity vector.
			ball.velX = ball.velX - (ball.velX*friction);
			
            
            //X and Y components of the velocity vector are added to the ball x and y values.
			ball.x += ball.velX;
			ball.y += ball.velY;
			
			//checks if it has hit any of the wall boundaries
			checkBoundary(ball);
			
				//draws the ball
			context.fillStyle = ball.color;
			context.beginPath();
			context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();

		}
		
		
		
		//function in charge of checking the ball against walls.
		function checkBoundary(object){
            
            
            //if ball has hit any of the right or left sides, reverse its X component velocity vector
            //Reduce its X velocity component by the ball's elasticity property
			if(object.x>=theCanvas.width-object.radius){
				object.x = theCanvas.width - object.radius;
				object.velX = -object.velX;
				object.velX *= object.elasticity;
				
				
			}else if(object.x<=object.radius){
				object.x = object.radius;
				object.velX = -object.velX;
				object.velX *= object.elasticity;
	   //if ball has hit any of the top or bottom sides, reverse its Y component velocity vector
        //Reduce its Y velocity component by the ball's elasticity property			
			
			}else if(object.y>=theCanvas.height-object.radius){
				object.y = theCanvas.height-object.radius;
				object.velY = -object.velY;
				object.velY *= object.elasticity;
				
			}else if(object.y<=0+object.radius){
				object.y = object.radius;
				object.velY = -object.velY;
				object.velY *= object.elasticity;
			}
			
			
		}
		
		function onMouseUp(e){
			
			if(moveBall && gameOn){
			newX = e.clientX - canvasBound.left;
			newY = e.clientY - canvasBound.top;
			
			var dx = newX - oldX;
			var dy = newY - oldY;
			var distance = Math.sqrt(dx*dx + dy*dy);
			var newAngle = Math.atan2(dy,dx);
		
			var newSpeed = distance / ball.radius;
			console.log("the new speed is " + newSpeed);
			
			
			
			ball.velX = Math.cos(newAngle)*newSpeed;
			ball.velY = Math.sin(newAngle)*newSpeed;
			}
		
			console.log("distance is " + distance);
			console.log("the new angle is " + newAngle*(180/Math.PI));
			
			theCanvas.removeEventListener("mousemove", onMouseMove, false);
			moveBall = false;
			
			
			
			
			
		}
		
		function onMouseDown(e){
			
			
			//stores the x and y location of the event.
			var mouseX = e.clientX - canvasBound.left;
			var mouseY = e.clientY - canvasBound.top;
			
			//calculates the difference between the mouseX and Y and our ball.
			var dx = ball.x - mouseX;
			var dy = ball.y - mouseY;
            
            //calculates the distance between the event X and y and ball location.
			var distance = Math.sqrt(dx*dx + dy*dy);
			
            
            //Uses the distance to check if it is less then ball radius.
			if(distance<ball.radius){
				moveBall = true;
                
	       //Stores the location of the event for later use.
				oldX = mouseX;
				oldY = mouseY;
				
            //adds event listeners to move the ball and a mouse up event.    
				theCanvas.addEventListener("mouseup", onMouseUp, false);
				theCanvas.addEventListener("mousemove", onMouseMove, false);
			}else{
				moveBall = false;
			}
			
		}
		
		function onMouseMove(e){
			
            //check if the game is running and that we can move the ball.
			if(moveBall && gameOn){
                //sets velocity and gravity to 0 so the ball follows our cursor
			ball.velX = ball.velY = gravity = 0;
			ball.x = e.clientX - canvasBound.left;
			ball.y = e.clientY - canvasBound.top;
                //reset our gravity value back to its original value.   
				gravity = ultimateGravity;
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
            
            //sets it to its opposite value.
			gameOn = !gameOn;
			gameLoop();
		}
		
		function onGravityChange(e){
			//handles gravity change
			var target = e.target;
			var newGravity = target.value;
            
            //converts string value to a number.
			newGravity = Number(newGravity);
		
			console.log("The value of the new gravity is " + newGravity + " and is of data type " + typeof newGravity);
            //stores new gravity value into the ultimate gravity value
			ultimateGravity = newGravity;
            //sets gravity equal to its ultimate value because it is changed later on.
			gravity = ultimateGravity;
		}

	}

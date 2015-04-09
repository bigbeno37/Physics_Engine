var heightOfBall = 850;
var angleOfBall = 45;
// Javascript requires degrees to be turned into radians to be able to compute them, so I just convert it once and use this instead
var angleOfBallRadians = convertToRadians(angleOfBall);
var velocity = 300;
// As explained, velocity is a vector; therefore, we need to determine it's x and y components using trig
var velocityX = velocity * Math.cos(angleOfBallRadians);
var velocityY = velocity * Math.sin(angleOfBallRadians);
var gravity = 9.8;
// I made it so that the custom coded renderer can utilise multiple framerates
var framerate = 60;
// Due to a function requiring a millisecond time, I convert the amount of frames per second to millisecond per frame
var milliFramerate = 1000 / framerate;

var currentTime = 0;
var currentPositionX = 0;
var currentPositionY = heightOfBall;

var ballIsDrawn = false;

var sizeOfCanvasX = 700;
var sizeOfCanvasY = 900;

var ball;
var canvas;

function drawBall(){
	// This is where the framework comes in; it's called fabric.js, and it handles the rendering of the ball only. I make it move	
	ball = new fabric.Circle({
	  // Fabric.js uses a co-ordinate system starting from the top-right
	  // Therefore, we specify the amount of whitespace required to get the ball to heightOfBall pixels up
	  // Height + Whitespace = Size of Canvas, hence Whitespace = Size of Canvas - Height
	  top: (sizeOfCanvasY - heightOfBall),
	  fill: 'red',
	  radius: 10
	});

	canvas.add(ball);
	canvas.renderAll();

	ballIsDrawn = true;
}

function convertToRadians(degrees){
	return (degrees * (Math.PI / 180)); 
}

function convertToSeconds(milliTime){
	return milliTime*0.001;
}

function determineX(){
	// Every second, the ball moves Vx pixels
	// Every 1/2 second, the ball moves Vx / 2 pixels
	// Every 1/4 second, the ball moves Vx / 4 pixels
	// Continuing with this trend, every frame this ball will move Vx / framerate pixels onto it's previous position
	return currentPositionX + (velocityX / framerate);
}


function determineY(time){
	// The same principle as above applies here, but in the y direction, the force of gravity is applied
	// Because gravity is an acceleration, it will increase with time
	// Due to gravity's 'pulling' on the ball, it will 'eat' away at the ball's Vy component
	// After some time, the ball's Vy component will be equal to the gravity, and the ball will be brought down
	return currentPositionY + ((velocityY / framerate) - (gravity*time));
}

function renderFrame(){
	currentTime += milliFramerate;
	// For the above functions (determineX and Y), to determine correct placements requires a time in seconds; hence, we convert milliseconds to seconds
	var time = convertToSeconds(currentTime);

	var topValue = sizeOfCanvasY - determineY(time)
	var leftValue = determineX();

	if(!ballIsDrawn){
		drawBall();
	}else{
		ball.set({top: topValue, left: leftValue});
		canvas.renderAll();
	}

	currentPositionY = determineY(time);
	currentPositionX = leftValue;

	// These spurt out constant information that I can use to debug
	console.log("Current time is " + currentTime + "ms, " + time + "s");
	console.log("Top is: " + topValue + " and left is: " + leftValue);
}

$(document).ready(function(){
	// More debug information, just to check my maths
	console.log(angleOfBall + " to radians (according to Javascript) is " + angleOfBallRadians);
	console.log("The velocity vector is " + velocity + "; velocityX is: " + velocityX + "; velocityY is: " + velocityY);

	// Initialises Fabric.js and its functions
	$("#c").attr({"width": sizeOfCanvasX, "height": sizeOfCanvasY});
	canvas = new fabric.StaticCanvas('c');
	drawBall();	

	// Every milliFramerate (see why I needed to convert the framerate?), run renderFrame()
	// I store this function as a variable, so that I can later end it
	var renderBallMovement = setInterval(function(){ renderFrame() }, milliFramerate);

	// This function will cease to run after 10000ms, or, 10 seconds
	setTimeout(function(){
		clearInterval(renderBallMovement);
	}, 10000);
});
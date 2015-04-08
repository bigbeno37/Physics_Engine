var heightOfBall = 200;
var angleOfBall = 45;
var velocity = 250;
var gravity = 200;
var framerate = 60;
var milliFramerate = 1000 / framerate;

var currentTime = 0;

var ball = null;
var canvas = null;

function getScreenHeight(){
	return ($(window).height()-2);
}

function getScreenWidth(){
	return ($(window).width()-2);
}

function drawBall(){
	ball = new fabric.Circle({
	  top: (getScreenHeight() - heightOfBall),
	  fill: 'red',
	  radius: 10
	});

	// "add" rectangle onto canvas
	canvas.add(ball);
	canvas.renderAll();
}

function convertToRadians(degrees){
	return (degrees * (Math.PI / 180)); 
}

function determinePhi(time){
	//return (velocity * time) - ((gravity * (time * time))/2)

	return ((velocity*Math.sin(convertToRadians(angleOfBall))) - (gravity*time));
}

function determineDistance(time){
	/*var tanBallRadians = Math.tan(convertToRadians(angleOfBall));
	var distance = determinePhi(time);

	return (((-1 * gravity * tanBallRadians)/(Math.pow(velocity, 2))) * Math.pow(distance, 2)) + (tanBallRadians * distance) + heightOfBall;*/

	return velocity*Math.cos(convertToRadians(angleOfBall))*time;
}

function renderFrame(){
	currentTime += milliFramerate;
	var time = convertToSeconds(currentTime);
	var topValue = 200 + (-1*determinePhi(time));
	var leftValue = determineDistance(time);

	ball.set({top: topValue, left: leftValue});
	canvas.renderAll();

	console.log("Current time is " + currentTime + "ms, " + time + "s");
	console.log("Top is: " + topValue + " and left is: " + leftValue);
}

function convertToSeconds(milliTime){
	return milliTime*0.001;
}

$(document).ready(function(){
	$("#c").attr({"width": getScreenWidth(), "height": getScreenHeight()});
	canvas = new fabric.StaticCanvas('c');
	drawBall();	

	var renderBallMovement = setInterval(function(){ renderFrame() }, milliFramerate);

	setTimeout(function(){
		clearInterval(renderBallMovement);
	}, 10000);
});
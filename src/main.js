
var requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame;

var ZOOM_SCALE = 0.55;
var MAX_ICON_ID = 32;
var OBJECT_SIZE = 60;

var objectsCoords = [[2865, 1954], [2873, 1999], [2922, 1972], [2932, 2019], [2839, 2156], [2516, 1657], [2196, 2158], [2071, 2163], [1225, 1481], [795, 1077], [1110, 895], [1441, 764], [1507, 735], [1710, 654], [1536, 500], [1659, 361], [1661, 70], [1788, 449], [1846, 692], [1847, 740], [1800, 755], [2014, 765], [2636, 1244], [2533, 1270], [1858, 1592], [1729, 1402], [1787, 1146], [1735, 799], [1685, 819], [1852, 913], [2046, 1358], [2094, 1372]];

var imageData;

var ctx;
var sysCtx;

var isGrabbing = false;
var startGrabbingCoords = {x: -1, y: -1}

var mouseCoords = {x: -1, y: -1};

var circleRadius = 0;

var system_image;
var base_image;

var array = [];

var clickLocked = false;

var currentObject;

var backgroundSong;

function EntityClass(id, x, y) {
	this.icon;
	this.id = id;
	this.x = x;
	this.y = y;
	this.visible = false;
	this.isHovered = false;
	this.contains = function(x, y) {
		return this.x - (OBJECT_SIZE/2) <= x && x <= this.x + (OBJECT_SIZE/2) &&
			this.y - (OBJECT_SIZE/2) <= y && y <= this.y + (OBJECT_SIZE/2);
	}

	this.click = function() {
		clickLocked = true;
		$('#info').css('visibility', 'visible');
		document.getElementById('info').innerHTML = "";
		document.getElementById('info').append(this.slide);
		$("#info").show();
	}
}
let dotsInterval;

function init() {
	$(".loadingHeader").css('visibility', 'visible');
	let canvas = document.getElementById('canvas');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	ctx = canvas.getContext('2d');
	dotsInterval = setInterval(loadingStep, 300);
	let systemLayer = document.getElementById('systemLayer');

	document.getElementById('loadingScreen').style.cursor = "wait";
	systemLayer.height = window.innerHeight;
	systemLayer.width = window.innerWidth;
	sysCtx = systemLayer.getContext('2d');

	backgroundSong = new Audio('sound/background.mp3');
	backgroundSong.volume = 0.1;
	backgroundSong.onended = function() {
		backgroundSong.play();
	}

	base_image = new Image();
	base_image.src = 'images/mainMap.jpg';
	base_image.onload = function(){
		imageData = base_image;
		$('.volumeBox').css('visibility', 'visible');
		ctx.drawImage(base_image, 0, 0, base_image.width * ZOOM_SCALE, base_image.height * ZOOM_SCALE);

		system_image = new Image();
		system_image.src = 'images/pointMap.png';
		system_image.onload = function() {
			sysCtx.drawImage(system_image, 0, 0, system_image.width * ZOOM_SCALE, system_image.height * ZOOM_SCALE);
			currentLoadingStep++;
			loadIconRecursive(1, loop);
		}

	}
}

let translateCoords = {
	x: -2243,
	xPrev: -2243,
	y: -1751,
	yPrev: -1751
};

let circleStep = 1;

function drawIcons() {
	array.forEach(function(item) {
		if(item.visible) {
			if(item.isHovered) {
				sysCtx.drawImage(item.iconH, item.x-(OBJECT_SIZE/2), item.y-(OBJECT_SIZE/2), OBJECT_SIZE, OBJECT_SIZE);
			} else {
				sysCtx.drawImage(item.icon, item.x-(OBJECT_SIZE/2), item.y-(OBJECT_SIZE/2), OBJECT_SIZE, OBJECT_SIZE);
			}
		}
	})
}


function loop() {
	currentLoadingStep = 5;
	let currentCursor = "crosshair";
	if(clickLocked) {
		currentCursor = "default";
	} else if(isGrabbing) {
		currentCursor = "grab";
	}
	document.getElementById('systemLayer').style.cursor = currentCursor;
	ctx.clearRect(0, 0, 2000, 2000);
	sysCtx.clearRect(0, 0, 2000, 2000);
	ctx.translate(translateCoords.x, translateCoords.y);
	sysCtx.translate(translateCoords.x, translateCoords.y);

	if(circleRadius < 4000) {

		circleStep += 0.2;
		sysCtx.beginPath();
		sysCtx.lineWidth = 20-circleStep;
		sysCtx.strokeStyle = "red";
		sysCtx.arc(currentObject.x, currentObject.y, circleRadius+=circleStep, 0, 2 * Math.PI);


		sysCtx.stroke();
		sysCtx.lineWidth = 1;
	}

	ctx.drawImage(base_image, 0, 0, base_image.width * ZOOM_SCALE, base_image.height * ZOOM_SCALE);
	ctx.translate(-translateCoords.x, -translateCoords.y);
	drawIcons();
	sysCtx.translate(-translateCoords.x, -translateCoords.y);

	requestAnimFrame(loop);
}

document.addEventListener('mousemove', function (e) {
	mouseCoords.x = e.pageX;
	mouseCoords.y = e.pageY;


	if(isGrabbing) {
		translateCoords.x = translateCoords.xPrev+mouseCoords.x-startGrabbingCoords.x;
		translateCoords.y = translateCoords.yPrev+mouseCoords.y-startGrabbingCoords.y;
	}

	array.forEach(function(item) {
		let curX = -(translateCoords.x-mouseCoords.x);
		let curY = -(translateCoords.y-mouseCoords.y);
		item.isHovered = !!item.contains(curX, curY);
	})
})

document.addEventListener('mousedown', function(e) {
	isGrabbing = true;
	startGrabbingCoords.x = e.pageX;
	startGrabbingCoords.y = e.pageY;
});


let objectList = [];

document.addEventListener('keyup', function(e) {
	if(e.code === "Space") {
		circleRadius = 0;
		circleStep = 1;
	}
})

var isEnded = false;

document.addEventListener('mouseup', function(e) {
	isGrabbing = false;
	translateCoords.xPrev = translateCoords.x;
	translateCoords.yPrev = translateCoords.y;
	let curX = -(translateCoords.x-mouseCoords.x);
	let curY = -(translateCoords.y-mouseCoords.y);
	if(clickLocked && currentObject.id === 32 && !isEnded) {
		$('.endScreen').show();
		isEnded = true;
		OBJECT_SIZE = 40;
		array.forEach(function(item) {
			item.visible = true;
		})
	} else if(clickLocked) {
		$('.endScreen').hide();
		$('#info').css('visibility', 'hidden');
		clickLocked = false;
		if(!isEnded) {
			currentObject.visible = false;
			currentObject = array[currentObject.id+1];
			currentObject.visible = true;

			circleRadius = 0;
			circleStep = 1;
		}
	} else {
		array.forEach(function(item) {
			if(item.contains(curX, curY) && !clickLocked) {
				if(item === currentObject || isEnded) {
					item.click();
				}
			}
		});
	}
});


function animationListener() {
	$("#loadingHeader").animate({
		opacity: "toggle"
	}, 2000, "linear", function() {
		$("#loadingHeader").text('Начинаем загрузку данных').animate({
			opacity: "toggle"
		}, 2000, 'linear', function() {
			$("#loadingHeader").text('Начинаем загрузку данных').animate({
				opacity: "toggle"
			}, 2000, 'linear', function() {
				$("#loadingHeader").css('visibility', 'hidden');
				$("#loadingBox").css('visibility', 'visible');
				init();
			})
		})
	});
}

document.getElementById("loadingHeader").addEventListener("animationend", animationListener, false);

let dotsCount = 1;

function volumeOn() {
	backgroundSong.pause();
	$('.volumeOff').show();
	$('.volumeOn').hide();
}

function volumeOff() {
	backgroundSong.play();
	$('.volumeOff').hide();
	$('.volumeOn').show();
}




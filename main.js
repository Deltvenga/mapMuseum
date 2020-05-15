
		var requestAnimFrame = window.requestAnimationFrame ||
						       window.webkitRequestAnimationFrame ||
						       window.mozRequestAnimationFrame ||
						       window.oRequestAnimationFrame ||
						       window.msRequestAnimationFrame;

		var ZOOM_SCALE = 0.55;
		var ZOOM_STEP = 5;
		var MAX_ICON_ID = 32;
		var OBJECT_SIZE = 60;
		var targetZoom = ZOOM_SCALE;

		var objectsCoords = [[2865, 1954], [2873, 1999], [2922, 1972], [2932, 2019], [2839, 2156], [2516, 1657], [2196, 2158], [2071, 2163], [1225, 1481], [795, 1077], [1110, 895], [1441, 764], [1507, 735], [1710, 654], [1536, 500], [1659, 361], [1661, 70], [1788, 449], [1846, 692], [1847, 740], [1800, 755], [2014, 765], [2636, 1244], [2533, 1270], [1858, 1592], [1729, 1402], [1787, 1146], [1735, 799], [1685, 819], [1852, 913], [2046, 1358], [2094, 1372]];

		var imageData;

		var ctx;

		var isGrabbing = false;
		var startGrabbingCoords = {x: -1, y: -1}

		var mouseCoords = {x: -1, y: -1};

		var circleRadius = 0;

		var system_image;
		
		var array = [];

		function EntityClass(id, x, y) {
			this.icon;
			this.id = id;
			this.x = x;
			this.y = y;
			this.visible = true;
			this.isHovered = false;
			this.contains = function(x, y) {
				return this.x - (OBJECT_SIZE/2) <= x && x <= this.x + (OBJECT_SIZE/2) &&
               		   this.y - (OBJECT_SIZE/2) <= y && y <= this.y + (OBJECT_SIZE/2);
			}

			this.click = function() {
				document.getElementById('info').innerHTML = "";
				document.getElementById('info').append(this.slide);
				this.slide.classList.add('horizTranslate');
			}
		}

		function loadImagesRecursive(id, callback) {
			array[id].slide = new Image();
	    	array[id].slide.src = 'images/slides/Слайд' + id + '.JPG';
	    	if(id === 1) {
	    		array[id].visible = true;
	    	}
	    	array[id].slide.onload = function(){
	    		if(id < MAX_ICON_ID) {
	    			loadImagesRecursive(++id, callback);
	    		} else {
	    			callback();
	    		}
	    		
	    	}
		}

		function loadIconRecursive(id, callback) {
	    	array[id] = new EntityClass(id, objectsCoords[id-1][0], objectsCoords[id-1][1]);
			array[id].icon = new Image();
	    	array[id].icon.src = 'images/icons/' + id + '.png';
	    	if(id === 1) {
	    		array[id].visible = true;
	    	}
	    	array[id].icon.onload = function(){
	    		if(id < MAX_ICON_ID) {
	    			loadIconRecursive(++id, callback);
	    		} else {
	    			loadIconHRecursive(1, callback);
	    		}
	    	}
		}

		function loadIconHRecursive(id, callback) {
			array[id].iconH = new Image();
	    	array[id].iconH.src = 'images/icons/' + id + 'h.png';
	    	if(id === 1) {
	    		array[id].visible = true;
	    	}
	    	array[id].iconH.onload = function(){
	    		if(id < MAX_ICON_ID) {
	    			loadIconHRecursive(++id, callback);
	    		} else {
	    			loadImagesRecursive(1, callback);
	    		}
	    		
	    	}
		}


		

		function init() {
			var canvas = document.getElementById('canvas');
			canvas.height = window.innerHeight;
	        canvas.width = window.innerWidth;
			ctx = canvas.getContext('2d');

			var systemLayer = document.getElementById('systemLayer');

			document.getElementById('loadingScreen').style.cursor = "wait";
			systemLayer.height = window.innerHeight;
	        systemLayer.width = window.innerWidth;
			sysCtx = systemLayer.getContext('2d');

			base_image = new Image();
		    base_image.src = 'images/mainMap.jpg';
		    base_image.onload = function(){
		    	imageData = base_image;
		    	ctx.drawImage(base_image, 0, 0, base_image.width * ZOOM_SCALE, base_image.height * ZOOM_SCALE);

		    	system_image = new Image();
		    	system_image.src = 'images/pointMap.png';
		    	system_image.onload = function() {
		    		sysCtx.drawImage(system_image, 0, 0, system_image.width * ZOOM_SCALE, system_image.height * ZOOM_SCALE);
		    		loadIconRecursive(1, loop);
		    	}

		    }
		}

		var translateCoords = {x: 0, y: 0, xPrev: 0, yPrev: 0};

		var circleStep = 1;

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
			document.getElementById('info').style.cursor = isGrabbing ? "grab" : "crosshair";
			ctx.clearRect(0, 0, 2000, 2000);
			sysCtx.clearRect(0, 0, 2000, 2000);
			ctx.translate(translateCoords.x, translateCoords.y);
			sysCtx.translate(translateCoords.x, translateCoords.y);

			

			sysCtx.lineWidth = 1;
			sysCtx.beginPath();
			sysCtx.rect(-(translateCoords.x-mouseCoords.x)-20, -(translateCoords.y-mouseCoords.y)-20, 40, 40);
			sysCtx.stroke();

			objectList.forEach(function(item) {
				sysCtx.beginPath();
				sysCtx.rect((item.x)-(OBJECT_SIZE/2), (item.y)-(OBJECT_SIZE/2), OBJECT_SIZE, OBJECT_SIZE);
				sysCtx.stroke();
			})

			if(circleRadius < 4000) {

				circleStep += 0.2;
				sysCtx.beginPath();
				sysCtx.lineWidth = 20-circleStep;
				sysCtx.strokeStyle = "red";
				sysCtx.arc(200, 200, circleRadius+=circleStep, 0, 2 * Math.PI);

				
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
				var curX = -(translateCoords.x-mouseCoords.x);
				var curY = -(translateCoords.y-mouseCoords.y);
				if(item.contains(curX, curY)) {
					item.isHovered = true;
				} else {
					item.isHovered = false;
				}
			})
		})

		var zoomDeltaCoords = {
			x: 0,
			y: 0
		}

		document.addEventListener('mousedown', function(e) {
			isGrabbing = true;
			startGrabbingCoords.x = e.pageX;
			startGrabbingCoords.y = e.pageY;
		});


		var objectList = [];

		document.addEventListener('keyup', function(e) {
			if(e.code === "Space") {
				objectList.push({x: -(translateCoords.x-mouseCoords.x), y: -(translateCoords.y-mouseCoords.y)})
				alert(-(translateCoords.x-mouseCoords.x) + "/" + -(translateCoords.y-mouseCoords.y))
			}

			if(e.code === "Escape") {
				circleRadius = 0;
				circleStep = 1;
			}
		})
		
		document.addEventListener('mouseup', function(e) {
			isGrabbing = false;
			translateCoords.xPrev = translateCoords.x;
			translateCoords.yPrev = translateCoords.y;
			var curX = -(translateCoords.x-mouseCoords.x);
			var curY = -(translateCoords.y-mouseCoords.y);
			array.forEach(function(item) {
				if(item.contains(curX, curY)) {
					item.click();
				}
			})
		});	


		function pointInCircle(x, y, cx, cy, radius) {
			var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
			return distancesquared <= radius * radius;
		}

		init();
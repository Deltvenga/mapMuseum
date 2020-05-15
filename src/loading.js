let currentLoadingStep = 0;

let loadingDictionary = [
	"Загружаем карту Ирбита",
	"Загружаем необходимые объекты",
	"Загружаем историческую информацию",
	"Загружаем фотографии",
	"Загружено"
]

function loadImagesRecursive(id, callback) {
	array[id].slide = new Image();
	array[id].slide.src = 'images/slides/slide' + id + '.jpg';
	if(id === 1) {
		array[id].visible = true;
		currentObject = array[id];
	}
	array[id].slide.onload = function(){
		if(id < MAX_ICON_ID) {
			loadImagesRecursive(++id, callback);
		} else {
			currentLoadingStep++;
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
			currentLoadingStep++;
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
			currentLoadingStep++;
			loadImagesRecursive(1, callback);
		}

	}
}

function loadingStep() {
	let dotsBox = "";
	dotsCount++;
	if(dotsCount > 3) dotsCount = 1;
	for(let i = 1; i <= dotsCount; i++) {
		dotsBox += ".";
	}
	for(let j = 3-dotsCount; j >= 1; j--) {
		dotsBox += "<span style='color: white'>.</span>";
	}
	$('#loadingText').text(loadingDictionary[currentLoadingStep]);
	if(currentLoadingStep === 5) {
		document.getElementById('dotsBox').innerHTML = "";
		clearInterval(dotsInterval);
		$("#loadingScreen").animate({
			opacity: "toggle"
		}, 1000, "linear", function() {
			$('#loadingScreen').css('visibility', 'hidden');
		})
	} else {
		document.getElementById('dotsBox').innerHTML = dotsBox;
	}
}
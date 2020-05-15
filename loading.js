var loadingDictionary = [
	"Загружаем карту Ирбита",
	"Загружаем расположение интересных мест",
	"Загружаем историческую информацию",
	"Загружаем фотографии",
	"Загружено"
]
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


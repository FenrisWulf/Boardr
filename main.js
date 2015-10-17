var canvas = document.getElementById('holder'),
context = canvas.getContext('2d');
var isRightPressed = false
var isLeftPressed = false
var moveAmnt = 20
var curImage
var numImages = 2
var curNum = -1
function getRandomNumber() {
	return Math.floor(Math.random() * numImages)
    // return 0
}
function getImage(num) {
	var newImg = new Image()
	newImg.src = 'images/'+num+'.jpg'
	newImg.width = canvas.width
	newImg.height = canvas.height
	return newImg
}
function showImage() {
	var randNum = getRandomNumber()
    curNum = randNum
	var randImage = getImage(randNum)
	randImage.onload = function(){
    	context.drawImage(randImage, 0, 0, randImage.width, randImage.height);
    	curImage = randImage
    	curImage.style.left = 0
  	}
}
function move(numFrames, dir) {
    refresh()
	if (numFrames <= 0) {
        showImage()
	}
	else {
		curImage.style.left = (parseInt(curImage.style.left)+moveAmnt * dir)+'px'; // pseudo-property code: Move right by 10px
		context.drawImage(curImage, parseInt(curImage.style.left), 0, curImage.width, curImage.height);
		console.log(curImage.style.left, parseInt(curImage.style.left+moveAmnt))
		setTimeout(function() {
	    	move(numFrames - 1, dir);
		},20); 
	}
}

function refresh() {
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#FFFFFF';
    context.fill();    
}
function sendData(didSwipeRight) {
    var sendInfo = {}
    sendInfo.imageNum = curNum
    sendInfo.didSwipeRight = didSwipeRight
    
    $.ajax({
        url: 'http://localhost:3000',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(sendInfo),
        success: function(data) {
            
        }
    })
}
function rightSelected() {
    sendData(true)
	setTimeout(function() {
    	move(20, 1);
	},20); 
}
function leftSelected() {
    sendData(false)
    setTimeout(function() {
        move(20, -1 );
    },20); 
}
function doKeyDown(evt)
{
    if (evt.keyCode == 37) {
        if (!isLeftPressed) {
        	leftSelected()
        }

        isLeftPressed = true;
    }
    if (evt.keyCode == 39) {
        if (!isRightPressed) {
        	rightSelected()
        }

        isRightPressed = true;
    }
    
}
function doKeyUp(evt)
{
    if (evt.keyCode == 37) {
        isLeftPressed = false;
    }
    if (evt.keyCode == 39) {
        isRightPressed = false;
    }
    
}
function init() {
    window.addEventListener('keydown',doKeyDown,true);
    window.addEventListener('keyup',doKeyUp,true);
	showImage()
}
init()

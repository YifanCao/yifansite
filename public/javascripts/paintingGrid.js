function initPaintingGrid() {

	var docElem = window.document.documentElement,
		gridItems,
		paintingGrid = document.getElementById('paintings-container'),
		isScrolling = false,
		animatedCount = 0, loadCount = 0;

	
	function getOffset(elem) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if (!isNaN(elem.offsetTop))
				offsetTop += elem.offsetTop;
			if (!isNaN(elem.offsetLeft))
				offsetLeft += elem.offsetLeft;
		} while (elem = elem.offsetParent);

		return { top : offsetTop,
				 left : offsetLeft };
	}

	function getViewportH() {
		var client = docElem['clientHeight'],
			inner = window['innerHeight'];
		
		if( client < inner )
			return inner;
		else
			return client;
	}

	function scrollY() {
		return paintingGrid.scrollTop;
	}

	function inViewport(elem, h) {
		var elem_height = elem.offsetHeight;
		var elem_top = getOffset(elem).top,
			elem_bottom = elem_top + elem_height;
		var view_top = scrollY();
		var view_bottom = getViewportH() + view_top;
		h = h || 0;
		console.log('top:' + elem_top + ', bottom:' + elem_bottom + ', viewTop:' + view_top + ', viewBottom:' + view_bottom);
		return (elem_top + h * elem_height < view_bottom && elem_bottom - h * elem_height > view_top);
	}
	

	function scrollHandler() {
		console.log("scrolled!");
		if (!isScrolling) {
			isScrolling = true;
			setTimeout(checkPaintingsVisibility, 200);
		} 
	}

	function rearrangePaintings() {
		var maxCols = Math.ceil(paintingGrid.clientHeight / 315);
		var paintingList = document.querySelectorAll('.painting-frame');
		for (var i = 0; i < paintingList.length; i++) {
			//var offset = getOffset(paintingList[i]);
			var row = Math.floor(i / maxCols), col = Math.floor(i % maxCols); offsetT = 5, offsetL = 5;
			if (row > 0) {
				//var topOffset = getOffset(paintingList[maxCols * (row - 1) + col]);
				offsetT += (paintingList[maxCols * (row - 1) + col].offsetTop + paintingList[maxCols * (row - 1) + col].offsetHeight);
			}
			if (col > 0) {
				//var leftOffset = getOffset(paintingList[maxCols * row + col - 1]);
				offsetL += (paintingList[maxCols * row + col - 1].offsetLeft + paintingList[maxCols * row + col - 1].offsetWidth);
			}
			paintingList[i].style.top = offsetT + "px";
			paintingList[i].style.left = offsetL + "px";
		}
	}

	function resize(){
		//width = window.innerWidth;
        //height = window.innerHeight;
		//docElem.style.height = window.innerHeight + "px";
		//docElem.style.width = window.innerWidth + "px";
		rearrangePaintings();
	}

	function checkPaintingsVisibility() {
		for (var i = 0; i < gridItems.length; i++) {
			if (!gridItems[i].animated) {
				console.log('check element index:' + i);
				checkAndAnimateImg(gridItems[i]);
			}
		}
		isScrolling = false;
		if (animatedCount == gridItems.length) {
			removeListners();
		}
	}

	function addListeners() {
		paintingGrid.addEventListener( 'scroll', scrollHandler );
		window.onresize = resize;
	}

	function removeListners() {
		paintingGrid.removeEventListener( 'scroll', scrollHandler );
		window.onresize = null;
	}


	function GridItem(elem) {
		this.elem = elem;
		this.wrapper = elem.firstChild;
		this.img = elem.firstChild.firstChild;
		this.animated = false;
	}

	GridItem.prototype.addCurtain = function() {
		this.curtain = document.createElement('div');
		this.curtain.className = 'curtain';
		var image = new Image();
		image.src = this.img.src;
		var rgb = new ColorFinder( function favorHue(r,g,b) {
			// exclude white
			//if (r>245 && g>245 && b>245) return 0;
			return (Math.abs(r-g)*Math.abs(r-g) + Math.abs(r-b)*Math.abs(r-b) + Math.abs(g-b)*Math.abs(g-b))/65535*50+1;
		} ).getMostProminentColor( image );
		if( rgb.r && rgb.g && rgb.b ) {
			this.curtain.style.background = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
		}
		this.wrapper.appendChild(this.curtain);
	}

	GridItem.prototype.changeAnimationDelay = function(time) {
		if( this.curtain ) {
			this.curtain.style.WebkitAnimationDelay = time + 'ms';
			this.curtain.style.animationDelay = time + 'ms';
		}
		if( this.img ) {
			this.img.style.WebkitAnimationDelay = time + 'ms';
			this.img.style.animationDelay = time + 'ms';
		}
		if( this.desc ) {
			this.desc.style.WebkitAnimationDelay = time + 'ms';
			this.desc.style.animationDelay = time+ 'ms';
		}
	}

	function init() {
		var paintingList = document.querySelectorAll('.painting-frame');
		gridItems = [];
		for (var i = 0; i < paintingList.length; i++) {
			var gridItem = new GridItem(paintingList[i]);
			gridItems.push(gridItem);
			gridItem.img.onload = (function(){
				loadCount++;
				if (loadCount == 16) {
					rearrangePaintings();
					for (var i = 0; i < gridItems.length; i++) {
						checkAndAnimateImg(gridItems[i]);
					}
				}
			})
		}
		if (animatedCount != gridItems.length) {
			addListeners();
		}
	}

	function checkAndAnimateImg(gridItem) {
		if (gridItem.img.complete && inViewport(gridItem.elem, 0.5)) {
				animateImg(gridItem);
		} else {
			gridItem.img.onload = (function(item){
				return function() {
					if (inViewport(item.elem, 0.5)) {
						animateImg(item);
					}
				};
			})(gridItem);
		}
	}

	function animateImg(gridItem) {
		classie.add(gridItem.wrapper, 'animate');
		gridItem.addCurtain();
		gridItem.animated = true;
		animatedCount++;
		gridItem.changeAnimationDelay(Math.random() * 500 + 100);
	}

	init();
}
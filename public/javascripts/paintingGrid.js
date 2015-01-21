function initPaintingGrid() {

	var docElem = window.document.documentElement,
		gridItems,
		paintingGrid = document.getElementById('paintings-container'),
		isScrolling = false,
		animatedCount = 0;

	
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
		return (elem_top + h * elem_height < view_bottom && elem_bottom - h * elem_height > view_top);
	}
	

	function scrollHandler() {
		console.log("scrolled!");
		if (!isScrolling) {
			isScrolling = true;
			setTimeout(checkPaintingsVisibility, 200);
		} 
	}

	function checkPaintingsVisibility() {
		for (var i = 0; i < gridItems.length; i++) {
			if (!gridItems[i].animated) {
				console.log('check element index:' + i);
				if (inViewport(gridItems[i].elem, 0.5)) {
					gridItems[i].animated = true;
					animatedCount++;
					classie.add(gridItems[i].wrapper, 'animate');
					gridItems[i].addCurtain();
					gridItems[i].changeAnimationDelay(Math.random() * 500 + 500);
				} 
			}
		}
		isScrolling = false;
		if (animatedCount == gridItems.length) {
			removeListners();
		}
	}

	function addListeners() {
		paintingGrid.addEventListener( 'scroll', scrollHandler );
	}

	function removeListners() {
		paintingGrid.removeEventListener( 'scroll', scrollHandler );
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
			if (inViewport(gridItem.elem, 0.5)) {
				classie.add(gridItem.wrapper, 'animate');
				gridItem.addCurtain();
				gridItem.animated = true;
				animatedCount++;
				gridItem.changeAnimationDelay(Math.random() * 500 + 500);
			}
		}
		if (animatedCount != gridItems.length) {
			addListeners();
		}
	}

	init();
}
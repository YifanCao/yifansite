function initPaintingGrid() {

	/*
		global variables
	*/

	var docElem = window.document.documentElement,
		gridItems,
		paintingGrid = document.getElementById('paintings-container'),
		isScrolling = false,
		animatedCount = 0, loadCount = 0;

	var imgCount = 18;
	
	/*
		class GridItem for wrapping all the paintings in this view
	*/

	function GridItem(elem) {
		this.elem = elem;
		this.wrapper = elem.firstChild;
		this.img = elem.firstChild.firstChild;
		this.animated = false;
		if (this.img.complete) {
			loadCount++;
			if (loadCount == imgCount) {
				rearrangePaintings();
				checkPaintingsVisibility();
			}
		} else {
			this.img.onload = (function(){
				loadCount++;
				console.log("img load count:" + loadCount);
				if (loadCount == imgCount) {
					rearrangePaintings();
					checkPaintingsVisibility();
				}
			});
		}
		/*
			when hover, we want the image to be zoomed out 
			and show the part of it according to the position
			of the mouse.
		*/
		$(this.elem).mousemove(function(event){
			var padding = parseInt($(this).css('padding').substring(0,$(this).css('padding').indexOf('px')));
			var left = (event.pageX - ($(this).offset().left + $(this).outerWidth()/2)) * 2;
			var top = (event.pageY - ($(this).offset().top + $(this).outerHeight()/2)) * 2;
			left = Math.min(left, $(this.firstChild.firstChild).outerWidth() - $(this).outerWidth()/2 + padding);
			left = Math.max(left, -($(this.firstChild.firstChild).outerWidth() - $(this).outerWidth()/2 + padding));
			top = Math.min(top, $(this.firstChild.firstChild).outerHeight() - $(this).outerHeight()/2 + padding);
			top = Math.max(top, -($(this.firstChild.firstChild).outerHeight() - $(this).outerHeight()/2 + padding));
			$(this.firstChild.firstChild).css({"left":left,"top":top});
		});
		$(this.elem).mouseover(function(){
			$(this.firstChild.firstChild).css({"-webkit-transform":"scale(2.0)","transform":"scale(2.0)"});
		})
		$(this.elem).mouseout(function(){
			$(this.firstChild.firstChild).css({"-webkit-transform":"","transform":"","left":"","top":""});
		});
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

	// ---------------------------- end of GridItem -----------------------------------------

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
		console.log($('.page.paintingPage').scrollTop());
		return $('.page.paintingPage').scrollTop();
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
	
	function rearrangePaintings() {
		var paintingList = document.querySelectorAll('.painting-frame');
		var maxCols = 4;
		var width = Math.floor(paintingGrid.clientWidth / maxCols - 26);
		var pageHeight = 0;
		for (var i = 0; i < paintingList.length; i++) {
			paintingList[i].style.width = width + "px";
			var row = Math.floor(i / maxCols), col = Math.floor(i % maxCols); offsetT = 0, offsetL = 0;
			var prevRowPainting = paintingList[maxCols * (row - 1) + col];
			var prevColPainting = paintingList[maxCols * row + col - 1];
			if (row > 0) {
				offsetT += (prevRowPainting.offsetTop + prevRowPainting.offsetHeight);
			}
			if (col > 0) {
				offsetL += (prevColPainting.offsetLeft + prevColPainting.offsetWidth);
			}
			paintingList[i].style.top = offsetT + "px";
			paintingList[i].style.left = offsetL + "px";
			pageHeight = Math.max(pageHeight, offsetT + $(paintingList[i]).outerHeight(true));
		}

		//TODO: this is not the good place to set the grid's height, as the page div may still not be stretched by the increasing images
		console.log("final page height:" + pageHeight);
		$(paintingGrid).height(pageHeight);
		console.log("offsetheight of page container:" + paintingGrid.offsetHeight);
	}

	function resize(){
		rearrangePaintings();
		checkPaintingsVisibility();
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
			console.log('removing scroll listener');
			$('.page.paintingPage').scroll(null);
		}
	}

	function addListeners() {
		console.log('adding scroll listener');
		$('.page.paintingPage').scroll(function(){
			console.log("scrolled!");
			if (!isScrolling) {
				isScrolling = true;
				setTimeout(checkPaintingsVisibility, 200);
			}
		});
		$(window).resize(resize);
	}

	function init() {
		var paintingList = document.querySelectorAll('.painting-frame');
		gridItems = [];
		for (var i = 0; i < paintingList.length; i++) {
			var gridItem = new GridItem(paintingList[i]);
			gridItems.push(gridItem);
		}
		// not all paintings revealed, add listener for animation when paintings were scrolled into current view
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
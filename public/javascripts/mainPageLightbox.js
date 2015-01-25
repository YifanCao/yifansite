function MainPageLightbox() {
	var lightbox = $('#lightspot');
	var clickbefore = false;
	var name = $('#name');

	this.init = function() {
		lightbox = $('#lightspot');
		clickbefore = false;
		name = $('#name');
		lightbox.on('click', lightboxClickHandler);
	};

	function lightboxClickHandler() {
		var lists = document.querySelectorAll("#lightspot li");
		if (!clickbefore) {
			lightbox.css({'width':"800px",
						  'height':"800px",
						  'border-radius':"800px",
						  'margin-left':"-400px",
						  'margin-top':"-400px"});
			var rotate = -10;
			function clickHandler(index) {
				var clickbefore = false;
				return function(event) {
					var overlay = document.getElementById("gray-overlay");
					var imageBox = document.getElementById("image-box");
					imageBox.style.zIndex = "5";
					imageBox.firstChild.setAttribute("src", lists[index].firstChild.firstChild.getAttribute("src"));
					imageBox.style.pointerEvents = "auto";
					imageBox.style.cursor = "pointer";
					classie.add(imageBox, 'animate');
					imageBox.onclick = function() {
						overlay.style.zIndex = "0";
						overlay.style.opacity = "";
						imageBox.style.zIndex = "0";
						imageBox.style.pointerEvents = "none";
						classie.remove(imageBox, 'animate');
					};
					overlay.style.opacity = "1";
					overlay.style.zIndex = "5";
					event.stopPropagation();
				};
			}
			for (i = 0; i < lists.length; i++) {
				if (!lists[i].onclick) {
					lists[i].onclick = clickHandler(i);
				}
				lists[i].style.opacity = "1";
				lists[i].style.pointerEvents = "auto";
				lists[i].style.transform = ("rotate(" + rotate + "deg) skew(50deg)");
				rotate += 40;
			}
			name.css('opacity',"1");
		} else {
			lightbox.css({'width':"200px",
			  'height':"200px",
			  'border-radius':"200px",
			  'margin-left':"-100px",
			  'margin-top':"-100px"});
			for (i = 0; i < lists.length; i++) {
				lists[i].style.opacity = "0";
				lists[i].style.transform = "skew(50deg)";
				lists[i].style.pointerEvents = "none";
			}
			name.css('opacity', "");
		}	
		clickbefore = !clickbefore;
	};
}
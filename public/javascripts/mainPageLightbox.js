function MainPageLightbox() {
	var lightbox = document.getElementById('lightspot');
	var clickbefore = false;
	var name = document.getElementById("name");

	this.init = function() {
		lightbox.onclick = lightboxClickHandler;
	};

	this.destroy = function() {
		lightbox.onclick = null;
	};

	function lightboxClickHandler() {
		var lists = document.querySelectorAll("#lightspot li");
		if (!clickbefore) {
			lightbox.style.width = "800px";
			lightbox.style.height = "800px";
			lightbox.style.borderRadius = "800px";
			lightbox.style.marginLeft = "-400px";
			lightbox.style.marginTop = "-400px";
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
			name.style.opacity = "1";
		} else {
			lightbox.style.width = "200px";
			lightbox.style.height = "200px";
			lightbox.style.borderRadius = "200px";
			lightbox.style.marginLeft = "-100px";
			lightbox.style.marginTop = "-100px";
			for (i = 0; i < lists.length; i++) {
				lists[i].style.opacity = "0";
				lists[i].style.transform = "skew(50deg)";
				lists[i].style.pointerEvents = "none";
			}
			name.style.opacity = "";
		}	
		clickbefore = !clickbefore;
	};
}
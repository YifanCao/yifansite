/*
*	Project name: Yifan's Personal Website (YFPW)
*	Author: Yifan Cao
*	FileName: controller.js
*	Description: this file provides angularjs controller "MainCtrl" to the main page's app scope "app"
*/

var app = angular.module("app", ['ngRoute', 'ngAnimate']);
app.
run(function($animate, $timeout) {
	$animate.enabled(false);
	$timeout(function() {
		$animate.enabled(true);
	}, 1000);
});

app.
config(function($routeProvider) {
	$routeProvider.
		when("/main", {templateUrl: "/htmls/mainPage.html", controller: MainCtrl}).
		when("/profile/:visitorname", {templateUrl: "/htmls/profile.html", controller: ProfileCtrl}).
		when("/paintings/:visitorname", {templateUrl: "/htmls/paintings.html", controller: PaintingsCtrl}).
		when("/code/:visitorname", {templateUrl: "/htmls/code.html", controller: CodeCtrl}).
		otherwise({templateUrl: "/htmls/mainPage.html", controller: MainCtrl});
});

app.
factory("time", function($timeout) {
	var time = {};
	function tick(){
		time.now = new Date().toString().substring(0, 24);
		time.timer = $timeout(tick, 1000);
	}
	time.start = function() {
		tick();
	}
	time.stop = function() {
		if (time.timer !== undefined && time.timer != null) {
			$timeout.cancel(time.timer);
		}
	}
	return time;
});

app.
service("canvasAnimation", CanvasAnimation);

app.directive('onLastRepeat', function($timeout) {
	return function(scope, element, attrs) {
		if (scope.$last) {
			$timeout(initPaintingGrid, 1);
		}
	};
});

function MainCtrl($rootScope, $scope, time, $log, canvasAnimation) {
	time.start();
	canvasAnimation.startAnimation();
	initLightBox();
	$scope.time = time;
	$rootScope.animation = '';
	$scope.pageClass = 'mainPage';

	//TO-DO: once we build back-end service, we should get images from the back-end
	$scope.images = [ { style:"margin-top: -150px; margin-left: -590px;", src:"/images/1.jpg" }, 
					  { style:"margin-top: -230px; margin-left: -440px;", src:"/images/2.jpg" },
					  { style:"margin-top: -300px; margin-left: -10px; transform: skew(-50deg) rotate(-70deg)", src:"/images/9.jpg" },
					  { style:"margin-top: -300px; margin-left: -30px; transform: skew(-50deg) rotate(-110deg)", src:"/images/7.jpg" },
					  { style:"margin-top: -500px; margin-left: 50px; transform: skew(-50deg) rotate(-150deg)", src:"/images/8.jpg" } ];

	var controlBtn = document.getElementById('control-button');
	var audio = document.getElementsByTagName('audio')[0];
	var stop = false;
	$scope.control = function() {
		stop = !stop;
		if (stop) {
			controlBtn.innerHTML = 'PLAY';
			audio.pause();
		} else {
			controlBtn.innerHTML = 'STOP';
			audio.play();
		}
	}

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		canvasAnimation.cancelAnimation();
		time.stop();
	});
}
 
function ProfileCtrl($rootScope, $scope, $routeParams, $rootScope, $log, $timeout) {
	$timeout(function() {
		$rootScope.animation = '';
	}, 1000);

	$scope.pageClass = 'profilePage';
	$scope.visitorName = $routeParams.visitorname;
	
	var content = document.getElementById('content');
	var contentIndicator = document.getElementById('content-indicator');
	var innerContent = document.getElementById('inner-content');
	contentIndicator.style.top = Math.min((content.scrollTop + content.clientHeight - 30), innerContent.scrollHeight + 40) + 'px';
	content.onscroll = function(event) {
		contentIndicator.style.top = Math.min((content.scrollTop + content.clientHeight - 30), innerContent.scrollHeight + 40) + 'px';
		if (content.scrollTop + content.clientHeight === content.scrollHeight) {
			contentIndicator.style.opacity = '0';
		} else {
			contentIndicator.style.opacity = '1';
		}
	};
	$scope.switch = function() {
		$rootScope.animation = 'onchange-subprofile';
	}
}

function PaintingsCtrl($rootScope, $scope, $log, $routeParams) {
	$scope.pageClass = 'paintingPage';
	$scope.visitorName = $routeParams.visitorname;
	$scope.paintings = [ { src:"/images/1.jpg" }, 
						 { src:"/images/2.jpg" },
						 { src:"/images/3.jpg" },
						 { src:"/images/4.jpg" },
						 { src:"/images/5.jpg" },
						 { src:"/images/6.jpg" },
						 { src:"/images/7.jpg" },
						 { src:"/images/8.jpg" },
						 { src:"/images/9.jpg" },
						 { src:"/images/10.jpg" },
						 { src:"/images/11.jpg" },
						 { src:"/images/12.jpg" },
						 { src:"/images/13.jpg" },
						 { src:"/images/14.jpg" },
						 { src:"/images/15.jpg" },
						 { src:"/images/16.jpg" } ];
}

function CodeCtrl($rootScope, $scope, $routeParams) {
	$scope.pageClass = 'codePage';
	$scope.visitorName = $routeParams.visitorname;
}


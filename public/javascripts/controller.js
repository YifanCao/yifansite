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
//front-end router
app.
config(function($routeProvider) {
	$routeProvider.
		when("/main", {templateUrl: "/htmls/mainPage.html", controller: MainCtrl}).
		when("/profile/:visitorname", {templateUrl: "/htmls/profile.html", controller: ProfileCtrl}).
		when("/paintings/:visitorname", {templateUrl: "/htmls/paintings.html", controller: PaintingsCtrl}).
		when("/code/:visitorname", {templateUrl: "/htmls/code.html", controller: CodeCtrl}).
		otherwise({templateUrl: "/htmls/mainPage.html", controller: MainCtrl});
});

//factory for checking the administrator info from backend
app.
factory("isAdminName", function($http, $log, $timeout) {
	var timeoutPromise = null;
	return function(visitorName) {
		$timeout.cancel(timeoutPromise);
		timeoutPromise = $timeout(function() {
			$http.get("/checkadmin?visitorname=" + visitorName).
				success(function(data, status, headers, config){
					if (data == "true") {
						$log.log("you are administrator!");
					} else {
						$log.log("you are not administrator!");
					}
				}).
				error(function(data, status, headers, config){
					$log.log("error when try to check whether visitor's name is same as admin");
				});
		}, 1000);

	};
});

//timer factory used in main view
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
//factory to change theme color of social media navi bar
app.
factory("changeSocialMediaTheme", function($log) {
	return function(pageClass) {
		$log.log(pageClass);
		var navis = $('.social-navibar li');
		var backgroundColor, textColor;
		if (pageClass == 'mainPage') {
			backgroundColor = 'rgba(157,188,201,1)';
			textColor = 'rgba(4,28,38,1)';
		} else if (pageClass == 'profilePage') {
			backgroundColor = '#FCDBC2';
			textColor = 'rgba(100, 50, 30, 1)';
		} else if (pageClass == 'paintingPage') {
			backgroundColor = 'rgba(150, 250, 210, 1)';
			textColor = 'rgba(44, 161, 122, 1)';
		} else if (pageClass == 'codePage') {
			backgroundColor = 'rgba(180, 140, 228, 1)';
			textColor = 'rgba(50, 20, 80, 1)';
		}
		for (var i = 0; i < navis.length; i++) {
			navis[i].addEventListener('mouseover', (function(navi, icon){
				return function() {
					navi.style.backgroundColor = backgroundColor;
					icon.style.color = textColor;
				};
			})(navis[i], navis[i].firstChild.firstChild));	
			navis[i].addEventListener('mouseout', (function(navi, icon){
				return function() {
					navi.style.backgroundColor = '';
					icon.style.color = '#fff';
				};
			})(navis[i], navis[i].firstChild.firstChild));
		}
	}
});
//mainPageAnimation service for main view
app.
service("mainPageAnimation", MainPageAnimation);

app.directive('onLastRepeat', function($timeout) {
	return function(scope, element, attrs) {
		if (scope.$last) {
			$timeout(initPaintingGrid, 1);
		}
	};
});
//mainPageLightbox service for main view
app.
service("mainPageLightbox", MainPageLightbox);

function MainCtrl($rootScope, $scope, time, $log, mainPageAnimation, mainPageLightbox,changeSocialMediaTheme, isAdminName) {
	time.start();
	mainPageAnimation.startAnimation();
	mainPageLightbox.init();
	$scope.time = time;
	$rootScope.animation = '';
	$scope.pageClass = 'mainPage';
	changeSocialMediaTheme($scope.pageClass);
	var controlBtn = $('.control-button');
	var audio = $('audio')[0];
	var stop = false;
	controlBtn.html('STOP');
	//TO-DO: once we build back-end service, we should get images from the back-end
	$scope.images = [ { style:"margin-top: -150px; margin-left: -590px;", src:"/images/1.jpg" }, 
					  { style:"margin-top: -230px; margin-left: -440px;", src:"/images/2.jpg" },
					  { style:"margin-top: -300px; margin-left: -10px; transform: skew(-50deg) rotate(-70deg)", src:"/images/9.jpg" },
					  { style:"margin-top: -300px; margin-left: -30px; transform: skew(-50deg) rotate(-110deg)", src:"/images/7.jpg" },
					  { style:"margin-top: -500px; margin-left: 50px; transform: skew(-50deg) rotate(-150deg)", src:"/images/8.jpg" } ];


	$scope.visitorNameChanged = function() {
		isAdminName($scope.visitorName);
	};

	$scope.audioControl = function() {
		stop = !stop;
		if (stop) {
			controlBtn.html('PLAY');
			audio.pause();
		} else {
			controlBtn.html('STOP');
			audio.play();
		}
	};

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		mainPageAnimation.cancelAnimation();
		time.stop();
	});
}

function ProfileCtrl($rootScope, $scope, $routeParams, $rootScope, $log, $timeout,changeSocialMediaTheme) {
	$timeout(function() {
		$rootScope.animation = '';
	}, 1000);

	$scope.pageClass = 'profilePage';
	changeSocialMediaTheme($scope.pageClass);
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

function PaintingsCtrl($rootScope, $scope, $log, $routeParams, $http, changeSocialMediaTheme) {
	$scope.pageClass = 'paintingPage';
	changeSocialMediaTheme($scope.pageClass);
	$scope.visitorName = $routeParams.visitorname;
	$http.get('/paintings').
		success(function(data, status, headers, config){
			$scope.paintings = data;
		}).
		error(function(data, status, headers, config){
			$log.log("error when try to get paintings");
		});
}

function CodeCtrl($rootScope, $scope, $routeParams, changeSocialMediaTheme) {
	$scope.pageClass = 'codePage';
	changeSocialMediaTheme($scope.pageClass);
	$scope.visitorName = $routeParams.visitorname;
}


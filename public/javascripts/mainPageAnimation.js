function MainPageAnimation() {

    //public member methods
    this.startAnimation = function() {
        initAnimation();
        addListeners();
    }

    this.cancelAnimation = function() {
        window.removeEventListener('resize', resize);
        for (var i = 0; i < themeSelector.length; i++) {
            themeSelector[i].onclick = null;
        }
        cancelAnimationFrame(animateID);
    }

    //private members
    var width, height, largeHeader, canvas, ctx, circles, animateID = null, currStateIdx = 0;

    var themeSelector = document.getElementsByName("theme-selector");
    var themeOverlay = document.getElementById("theme-overlay");
    var body = document.body;

    function initAnimation() {
        width = window.innerWidth;
        height = window.innerHeight;

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height; 
        ctx = canvas.getContext('2d');

        // create particles
        if (circles === null || circles === undefined) {
            circles = [];
            for(var x = 0; x < width*0.5; x++) {
                var c = new Circle();
                circles.push(c);
            }
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('resize', resize);
        for (var i = 0; i < themeSelector.length; i++) {
            themeSelector[i].onclick = themeSelectorHandlerWrapper(themeSelector[i], i);
            if ( currStateIdx == i ) {
                setThemeMusic(themeSelector[i], i);
            }
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    function themeSelectorHandlerWrapper(theme, idx) {
        return function() {
            setThemeMusic(theme, idx);       
        };
    }

    function setThemeMusic(theme, idx) {
        console.log("execute setThemeMusic: idx=" + idx + " theme=" + theme);
        currStateIdx = idx;
        for(var i in circles) {
            circles[i].state = currStateIdx;
        }
        var audio = document.getElementsByTagName('audio')[0];
        var musicPlayer = document.getElementById('music-player');
        var musicName = document.getElementById('music-name');
        var controlBtn = document.getElementById('control-button');
        //light
        if (currStateIdx == 0) {
            audio.src = '/music/Aimer-Hakuchuumu.mp3';
            musicName.innerHTML = 'Music: Aimer - Hakuchuumu';
            musicPlayer.style.backgroundColor = 'rgba(74, 129, 133, 0.8)';
            controlBtn.style.backgroundColor = 'rgba(74, 180, 150, 0.8)';
            controlBtn.addEventListener('mouseover', function(){
                controlBtn.style.backgroundColor = 'rgba(74, 220, 180, 1)';
            });
            controlBtn.addEventListener('mouseout', function(){
                controlBtn.style.backgroundColor = 'rgba(74, 180, 150, 0.8)';
            });
        //star trail
        } else {
            audio.src = '/music/A Sky Full Of Star.mp3';
            musicName.innerHTML = 'Music: ColdPlay - A Sky Full Of Star';
            musicPlayer.style.backgroundColor = 'rgba(50, 80, 100, 0.8)';
            controlBtn.style.backgroundColor = 'rgba(50, 130, 150, 0.8)';
            controlBtn.addEventListener('mouseover', function(){
                controlBtn.style.backgroundColor = 'rgba(74, 160, 180, 1)';
            });
            controlBtn.addEventListener('mouseout', function(){
                controlBtn.style.backgroundColor = 'rgba(50, 130, 150, 0.8)';
            });
        }
        controlBtn.innerHTML = 'STOP';      
    }

    function animate() {
        //light
        if (circles[0].state == 0)
            ctx.clearRect(0,0,width,height);
        //star trail
        if (circles[0].state == 1) {
            //var grd = ctx.createRadialGradient(width/2,height/2,width/50,width/2,height/2,height);
            //    background: -webkit-radial-gradient(circle, rgba(4,25,34,1), rgba(20,78,100,1), rgba(43, 150, 166, 1), rgba(20,78,100,1), rgba(4,25,34,1)); /* Standard syntax (must be last) */
            //     background: -o-radial-gradient(circle, rgba(4,25,34,1), rgba(20,78,100,1), rgba(43, 150, 166, 1), rgba(20,78,100,1), rgba(4,25,34,1)); /* Standard syntax (must be last) */
            //     background: -moz-radial-gradient(circle, rgba(4,25,34,1), rgba(20,78,100,1), rgba(43, 150, 166, 1), rgba(20,78,100,1), rgba(4,25,34,1)); /* Standard syntax (must be last) */
            //     background: radial-gradient(circle, rgba(4,25,34,1), rgba(20,78,100,1), rgba(43, 150, 166, 1), rgba(20,78,100,1), rgba(4,25,34,1)); /* Standard syntax (must be last) */
            /*
            grd.addColorStop(0,'rgba(4,25,34,0.08)');
            grd.addColorStop(0.25, 'rgba(20,78,100,0.08)');
            grd.addColorStop(0.5, 'rgba(43,150,166,0.08)');
            grd.addColorStop(0.65, 'rgba(20,78,100,0.08)');
            grd.addColorStop(0.9, 'rgba(4,25,34,0.08)');
            grd.addColorStop(1, 'rgba(4,25,34,0.08)');
            
            //grd.addColorStop(0, 'transparent');
            //grd.addColorStop(1, 'transparent');
            // Fill with gradient
            ctx.fillStyle= grd;
            */
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(0, 0, width, height);
            
        }
        for(var i in circles) {
            circles[i].draw();
        }
        animateID = requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
            console.log(_this);
        })();

        function init() {
            if (_this.state === undefined)
                _this.state = 0;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
            _this.angle = Math.random() * 360;
            switch (_this.state) {
                //star trail
                case 1 : {
                    _this.alpha = 0.3+Math.random()*0.7;
                    _this.distance = Math.max(Math.random(), 0.01) * 0.5 * width;
                    //_this.red = Math.floor(Math.max(Math.random(), 0.1) * 255);
                    //_this.green = Math.floor(Math.max(Math.random(), 0.1) * 255);
                    //_this.blue = Math.floor(Math.max(Math.random(), 0.1) * 255);
                    break;
                }
                //light
                case 0 : {
                    _this.alpha = 0.1+Math.random()*0.3;
                    _this.distance = Math.random() * 0.05 * width;
                    break;
                }
            }
            _this.pos.x = 0.5 * width + _this.distance * Math.cos(_this.angle);
            _this.pos.y = 0.5 * height + _this.distance * Math.sin(_this.angle);
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            switch(_this.state) {
                //light
                case 0 : {
                    _this.pos.y += _this.velocity * Math.sin(_this.angle);
                    _this.pos.x += _this.velocity * Math.cos(_this.angle);
                    _this.alpha -= 0.0005;
                    break;
                }
                //star trail
                case 1 : {
                    _this.angle += (Math.min(_this.velocity, 0.4) / _this.distance) * (180 / Math.PI) * 0.1;
                    _this.pos.y = 0.5 * height + _this.distance * Math.sin(_this.angle);
                    _this.pos.x = 0.5 * width + _this.distance * Math.cos(_this.angle);
                    _this.alpha -= 0.0005;
                    break;
                }
            }
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha+')';
            ctx.fill();
        };
    }
}
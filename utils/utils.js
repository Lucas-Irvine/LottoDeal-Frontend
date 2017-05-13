angular.module('utilsModule', [])
.service('dateFunctions', dateFunctions)
.service('arrayBufferFunctions', arrayBufferFunctions)
.service('winnerFunction', winnerFunction)

function dateFunctions() {
	//Code modified from http://ditio.net/2010/05/02/javascript-date-difference-calculation/
	this.DateDiff = {
		inHours: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return (parseInt((t2 - t1) / (3600 * 1000))) % 24;
        },

        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();
            if (t2 == null || t1 == null) {
                return 0
            }
            return parseInt((t2 - t1) / (24 * 3600 * 1000));
        }
	}
}


function arrayBufferFunctions() {
    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step. According to my tests, this appears to be a faster approach:
    // http://jsperf.com/encoding-xhr-image-data/5

    /*
    MIT LICENSE
    Copyright 2011 Jon Leighton
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */

    this.base64ArrayBuffer = function(arrayBuffer) {
      var base64    = ''
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

      var bytes         = new Uint8Array(arrayBuffer)
      var byteLength    = bytes.byteLength
      var byteRemainder = byteLength % 3
      var mainLength    = byteLength - byteRemainder

      var a, b, c, d
      var chunk

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
      } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
      }
      
      return base64
    }
}

function winnerFunction() {
  this.displayWinner = function($scope, winnerPopup, winnerForModal, w, h) {
    winnerPopup.modal({
        keyboard: false
    })

    setTimeout(function() {
        winnerForModal.fadeIn();

        /* CODE BELOW IS MODIFIED FROM https://codepen.io/Gthibaud/pen/bNOZjd */

        // canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        width = canvas.width = w;
        height = canvas.height = h;


        // création d'un tableau
        particle = [];
        particleCount = 0,
        gravity = 0.3,
            colors = [
              '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
              '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
              '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
              '#FF5722', '#795548'
            ];



        for( var i = 0; i < 300; i++){

            particle.push({
                x : width/2,
                y : height/2,
                boxW : randomRange(5,20),
                boxH : randomRange(5,20),
                size : randomRange(2,8),
                
                spikeran:randomRange(3,5),
                
                velX :randomRange(-8,8),
                velY :randomRange(-50,-10),
                
                angle :convertToRadians(randomRange(0,360)),
                color:colors[Math.floor(Math.random() * colors.length)],
                anglespin:randomRange(-0.2,0.2),
                
                draw : function(){
                    context.save();
                    context.translate(this.x,this.y);
                    context.rotate(this.angle);
                    context.fillStyle=this.color;
                    context.beginPath();
                    // drawStar(0, 0, 5, this.boxW, this.boxH);
                    context.fillRect(this.boxW/2*-1,this.boxH/2*-1,this.boxW,this.boxH);
                    context.fill();
                    context.closePath();
                    context.restore();
                    this.angle += this.anglespin;
                    this.velY*= 0.999;
                    this.velY += 0.3;
                  
                    this.x += this.velX;
                    this.y += this.velY;
                    if(this.y < 0){
                        this.velY *= -0.2;
                        this.velX *= 0.9;
                    };
                    if(this.y > height){
                        this.anglespin = 0;
                        this.y = height;
                        this.velY *= -0.2;
                        this.velX *= 0.9;
                    };
                    if(this.x > width ||this.x< 0){
                        this.velX *= -0.5;
                    };
                
                },
            });

        }

        function drawScreen(){                
            context.globalAlpha = 1; 
            for( var i = 0; i < particle.length; i++){
                particle[i].draw();
            }
        }

        function loadImage(url){
            var img = document.createElement("img");
            img.src=url;
            return img;
        }

        function update(){
            context.clearRect(0,0,width,height);

            drawScreen();

            requestAnimationFrame(update);
        }

        update();


        function randomRange(min, max){
            return min + Math.random() * (max - min );
        }

        function randomInt(min, max){
            return Math.floor(min + Math.random()* (max - min + 1));
        }

       function convertToRadians(degree) {
            return degree*(Math.PI/180);
        }
                
        function drawStar(cx, cy, spikes, outerRadius, innerRadius,color) {
            var rot = Math.PI / 2 * 3;
            var x = cx;
            var y = cy;
            var step = Math.PI / spikes;

            context.strokeSyle = "#000";
            context.beginPath();
            context.moveTo(cx, cy - outerRadius)
            for (i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                context.lineTo(x, y)
                rot += step

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                context.lineTo(x, y)
                rot += step
            }
            context.lineTo(cx, cy - outerRadius)
            context.closePath();
            context.fillStyle=color;
            context.fill();
        }       
        /* END OF MODIFIED CODE FROM https://codepen.io/Gthibaud/pen/bNOZjd */

        setTimeout(function() {
            $("#canvas").hide();
        }, 5000)
    }, 3000)
    $scope.winner = winner;
    $scope.$apply();
  }
}

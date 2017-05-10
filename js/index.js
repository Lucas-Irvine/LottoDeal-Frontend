var app = angular.module("index_app", ["serverModule"])



// function to delete a given item 
function deleteItem () {
        // get all the accounts for all posts
    var deleteUrl = "https://162.243.121.223:8000//deleteItem";
    var data = {
        id: "CORRECT ID HERE"
    }

    $.ajax({
        url: deleteUrl,
        type: 'DELETE',
        data: data,

        success: function(message) {
            var success = JSON.parse(message)
            if (success == "0") {
                alert("You can't delete an item that has bids on it!")
            }
            console.log("item successfully deleted")
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });
}

console.log('test');

var scope;


app.controller("indexController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", function($scope, $rootScope, $location, serverGet, serverPost) {

    scope = $scope;
    $scope.selectedTab = 0
    $scope.posts = []

    console.log(serverGet);

    function hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }



    serverGet.getPosts($("#loading-icon"), $scope);
    
    serverGet.getAccountsForPosts($scope);


    $scope.notificationLength = 0;

    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);
    }


    $scope.images = []

    // mark all the notifications as read
    scope.markRead = function() {
        serverGet.markRead(accessToken, $scope);
    }

    $scope.targetPost = null;
    $scope.amountRaised = 0
    $scope.amountToCharge = 0
    $scope.itemID = ""
    $scope.itemTitle = ""
    $scope.price = 0

    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, "index");
    }

    $scope.winner = null;

    $scope.displayWinner = function(winner) {
        console.log(winner);
        console.log("displaying winner")
        $('#winnerPopup').modal({
            keyboard: false
        })

        setTimeout(function() {
            $("#winnerForModal").fadeIn();

            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;


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
            // r1={
            // x:width/2-150,
            // y:height/2-150,
            // width:300,
            // height:300,
            //     velX :0,
            //     velY :-10,
            //  img : loadImage("http://image.noelshack.com/fichiers/2015/12/1427051642-smiley.png"),
            //  alphatop:0
            // };


            function drawScreen(){
            // size = 50;
            //             pFontName = "Lucida Sans Unicode";
            //             context.font = size + "pt " + pFontName;
            //             context.fillText("Confetti party !!!", width/2,150 );
            //         if(r1.alphatop < 1){
            //         r1.alphatop += 0.01;
            //         }else{
            //         r1.alphatop = 1;
            //         }
            //         context.globalAlpha = r1.alphatop; 
            //             context.drawImage(r1.img,r1.x,r1.y);
            //                   context.textAlign = 'center';

                        
                        
            //             if(r1.alphatop === 1){
            //     r1.velY*= 0.999;
            //     r1.velY += 0.3;
              
            //     r1.x += r1.velX;
            //     r1.y += r1.velY;}

            //         if(r1.y + r1.height > height){
            //     r1.anglespin = 0;
            //     r1.y = height - r1.height;
            //     r1.velY *= -0.8;
            //         r1.velX *= 0.9;
            //     };
                
                
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




            
            // $scope.winner = winner;
            // $scope.$apply();
        }, 3000)
        $scope.winner = winner;
    }

}])

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    }
})

//For changing tabs Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
function changeTab(titleID, id) {
    console.log('test');
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }


    document.getElementById(titleID).className += " active";
    document.getElementById(id).className += " active";

    // Show the current tab, and add an "active" class to the button that opened the tab
    // document.getElementById(cityName).style.display = "block";
    //evt.currentTarget.className += " active";
}



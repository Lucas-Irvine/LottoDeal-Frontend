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

    $scope.displayWinner = function(winner) {
        console.log("displaying winner")
        BootstrapDialog.show({
            message: $("<div></div>").load("<div>Hello</div>")
            // title: "Oops, you can't bid on this item anymore!",
            // message: 'Your credit card was not charged. This item is either expired or sold.',
            buttons: [{
                id: 'btn-ok',
                icon: 'glyphicon glyphicon-check',
                label: 'OK',
                cssClass: 'btn-primary',
                data: {
                    js: 'btn-confirm',
                    'user-id': '3'
                },
                autospin: false,
                action: function(dialogRef) {
                    dialogRef.close();
                }
            }]
        });
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



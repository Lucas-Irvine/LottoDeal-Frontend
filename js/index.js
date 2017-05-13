var app = angular.module("index_app", ["serverModule", "utilsModule"])

var scope;

app.controller("indexController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", "winnerFunction", function($scope, $rootScope, $location, serverGet, serverPost, winnerFunction) {
    scope = $scope;
    $scope.selectedTab = 0
    $scope.posts = []

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
        var winnerPopup = $('#winnerPopup');
        var winnerForModal = $("#winnerForModal");
        var canvas = document.getElementById("canvas");
        console.log(canvas);
        var width = window.innerWidth;
        var height = window.innerHeight
        var temp = winner;

        winnerFunction.displayWinner($scope, winnerPopup, winnerForModal, canvas, width, height, temp)
    }

}])

// reverses elements in an array
app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    }
})

//For changing tabs Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
function changeTab(titleID, id) {
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
}



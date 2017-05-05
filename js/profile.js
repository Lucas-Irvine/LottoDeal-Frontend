/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function() {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
});


// copied from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function updateSettings() {
    var email = $("#newEmail").val();
    if (validateEmail(email)) {
       serverPost.updateSettings(accessToken, email);
    } else {
        alert("Not a valid email address");
    }
}

var scope;


var app = angular.module("profile_app", ["serverModule"])

app.controller("profileController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", function($scope, $rootScope, $location, serverGet, serverPost) {
    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []


    scope = $scope;

    $scope.account = []

    scope.getAccount = function() {
        serverGet.getAccount(accessToken, $scope);
    }

    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);
    }

    $scope.images = []

    // mark all the notifications as read
    scope.markRead = function () {
        serverGet.markRead(accessToken, $scope);
    }

    scope.getBidsOfUsers = function() {
        serverGet.getBidsOfUsers(accessToken, $scope);
    }
    


    var itemIDs = [];

    scope.getBiddedItemsOfUsers = function() {
        serverGet.getBiddedItemsOfUsers(accessToken, $scope);
    }
    
    
    scope.getListedItemsForUsers = function() {
        serverGet.getListedItemsForUsers(userID, $scope);
    }

    $scope.soldItems = []

    scope.getSoldItemsForUsers = function() {
        serverGet.getSoldItemsForUsers(userID, $scope);
    }

   


    //Start reviews
    $scope.reviews = []


    scope.getReviews = function() {
        serverGet.getReviews(userID, $scope);
    }

    scope.getReviewerImagesAndNames = function() {
        serverGet.getReviewerImagesAndNames(userID, $scope);
    }


    $scope.reviewers = []

    


    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, "profile");
    }
    

    $scope.targetPost = null;

}])
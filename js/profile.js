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
    
    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);
    }

    $scope.images = []

    // mark all the notifications as read
    scope.markRead = function () {
        serverGet.markRead(accessToken, $scope);
    }


    serverGet.getBidsOfUsers(accessToken, $scope);


    var itemIDs = [];

    serverGet.getBiddedItemsOfUsers(accessToken, $scope);
    

    serverGet.getListedItemsForUsers(userID, $scope);

    $scope.soldItems = []


    serverGet.getSoldItemsForUsers(userID, $scope);


    //Start reviews
    $scope.reviews = []


    serverGet.getReviews(userID, $scope);


    $scope.reviewers = []

    serverGet.getReviewerImagesAndNames(userID, $scope);

    
    $scope.account = []

    serverGet.getAccount(accessToken, $scope);

    

    $scope.targetPost = null;

}])
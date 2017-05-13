/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function () {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
    $("#sellingTab").click();
});


var reviewID; // person being reviewed

// change the number of stars selected
function changeStars(stars) {
    $('#numStars').val(stars);
}


function createReviewFunction() {
    var url = "http://162.243.121.223:8000/createReview";
    var sellerID = reviewID;
    var reviewDes = $("#reviewDes").val();
    var stars = $("#numStars").val(); 
    if (stars != 0) {
        data = {
         sellerID: sellerID,
         reviewDes: reviewDes,
         stars: stars, 
         accessToken: accessToken,
        }

        // AJAX POST TO SERVER
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(data) {
                $("#reviewAddedModal").modal()
            },
            error: function(response, error) {
                console.log("Error in createReview")
                console.log(response)
                console.log(error)
            }
        });
    }
    else {
        alert("Please select the number of stars")
    }
}

var scope;

var app = angular.module("user_app", ["serverModule", "utilsModule"])

app.controller("userController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", "winnerFunction", function($scope, $rootScope, $location, serverGet, serverPost, winnerFunction) {
    scope = $scope;
    var searchObject = $location.search();
    var id = searchObject['id'];
    reviewID = id;

    scope.checkIfReviewingSelf = function(accessToken, userID) {
        if (reviewID != userID && accessToken != undefined) {
            $("#reviewForm").show();
        }
    }
    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []

    serverGet.getListedItemsForUsers(reviewID, $scope)
    
    $scope.soldItems = []

    serverGet.getSoldItemsForUsers(reviewID, $scope)

    $scope.reviews = []


    serverGet.getReviews(reviewID, $scope)
    
    $scope.reviewers = []
    // loads reviewers images and names into the above

    serverGet.getReviewerImagesAndNames(reviewID, $scope)

    scope.markRead = function() {
        serverGet.markRead(accessToken, $scope)
    }

    $scope.account = []

    serverGet.getPublicAccount($scope, id);


    $scope.notificationLength = 0;
    
    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope)
    }


    $scope.targetPost = null;

    $scope.amountRaised = 0
    $scope.amountToCharge = 0
    $scope.itemID = ""
    $scope.itemTitle = ""
    $scope.price = 0

    $scope.displayWinner = function(winner) {
        var winnerPopup = $('#winnerPopup');
        var winnerForModal = $("#winnerForModal");
        var canvasEl = $("#canvas");
        var canvas = document.getElementById("canvas")
        var width = window.innerWidth;
        var height = window.innerHeight
        var temp = winner;

        winnerFunction.displayWinner($scope, winnerPopup, winnerForModal, canvas, width, height, temp, canvasEl)
    }
}])



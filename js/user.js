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

    // var searchObject = $location.search();
    // var id = searchObject['id'];
    // console.log(id);


    var url = "https://localhost:8000/createReview";

        console.log(numStars);

        var sellerID = reviewID;
        var reviewDes = $("#reviewDes").val();
        var stars = $("#numStars").val(); 
        // var userID = localStorage.getItem("curUserID");
        console.log(stars)

        if (stars != 0) {

            console.log("posting a review NOW!")
            data = {
             sellerID: sellerID,
             reviewDes: reviewDes,
             stars: stars, //change later to actual value
             accessToken: accessToken,
            }

            // AJAX POST TO SERVER
            $.ajax({
             url: url,
             type: 'POST',
             data: data,
             success: function(data) {
                console.log(data)
                $("#reviewAddedModal").modal()
             },
             error: function(response, error) {
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

var app = angular.module("user_app", ["serverModule"])

app.controller("userController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", function($scope, $rootScope, $location, serverGet, serverPost) {


    scope = $scope;


    
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    reviewID = id;





    if (reviewID != userID && accessToken != undefined) {
        $("#reviewForm").show();
    }

    
    // USER SHOULD NOT BE ABLE TO REVIEW THEMSELVES IF THEY ARE ON THEIR OWN PAGE - can check this on the backend as well actually (necessary actually)



    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []



    scope.getListedItemsForUsers = function(reviewID) {
        serverGet.getListedItemsForUsers(reviewID, $scope)
    }


    $scope.soldItems = []



    scope.getSoldItemsForUsers = function(reviewID) {
        serverGet.getSoldItemsForUsers(reviewID, $scope)
    }


    $scope.reviews = []

    scope.getReviews = function(reviewID) {
        serverGet.getReviews(reviewID, $scope)
    }

    
    $scope.reviewers = []
    // loads reviewers images and names into the above
    scope.getReviewerImagesandNames = function(reviewID) {
        serverGet.getReviewerImagesandNames(reviewID, $scope)
    }




   

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

    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document, "user");
    }



}])



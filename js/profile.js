/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function() {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
});


var userID;

// copied from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function updateSettings() {
    var email = $("#newEmail").val();

    if (validateEmail(email)) {

        var url = "https://localhost:8000/updateSettings";

        console.log("updating your settings")

        data = {
            email: email,
            userID: userID,
        }

        // AJAX POST TO SERVER
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data)
            },
            error: function(response, error) {
                console.log(response)
                console.log(error)
            }
        });
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

    scope.applyAngular = function(userID) {



    var url = "https://localhost:8000/getBidsofUsers";

    // AJAX POST TO SERVER for bids
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Bids')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var bids = JSON.parse(data)
            if (bids.length != 0) {
                $scope.bids = bids;
                console.log($scope.bids)
                $scope.$apply()
            } else {
                document.getElementById('BidCount').innerHTML = "No Bids Yet";
            }
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    var itemIDs = [];

    
    // AJAX POST TO SERVER for bidded items
    var url = "https://localhost:8000/getBiddedItemsofUsers";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Items')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
                var hours = DateDiff.inHours(date, expirationDate)
                var days = DateDiff.inDays(date, expirationDate)

                if (items[i].expired) {
                    items[i].expirationDate = "Lottery has expired!";                     
                }
                else if (items[i].sold) {
                    items[i].expirationDate =  items[i].winnerName;
                }
                else if (hours < 0 || days < 0) {
                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
                }
                else {
                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
                }
               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                } 
                else if (items[i].img.compressed != null) {
                    items[i]["src"] = items[i].img.compressed;
                }
                else {
                    var b64 = base64ArrayBuffer(items[i].img.data.data)
                    var dataURL = "data:image/jpeg;base64," + b64;
                    items[i]["src"] = dataURL;
                }
            }
            $scope.items = items;
            console.log($scope.items)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER for listed items
    var url = "https://localhost:8000/getListedItemsForUsers";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for ListedItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            
                var hours = DateDiff.inHours(date, expirationDate)
                var days = DateDiff.inDays(date, expirationDate)

                if (items[i].expired) {
                    items[i].expirationDate = "Lottery has expired!";                     
                }
                else if (items[i].sold) {
                    items[i].expirationDate = "Item was sold to:" + items[i].winnerName;
                }
                else if (hours < 0 || days < 0) {
                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
                }
                else {
                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
                }
               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                } 
                else if (items[i].img.compressed != null) {
                    items[i]["src"] = items[i].img.compressed;
                }
                else {
                    var b64 = base64ArrayBuffer(items[i].img.data.data)
                    var dataURL = "data:image/jpeg;base64," + b64;
                    items[i]["src"] = dataURL;
                }



            }
            $scope.listedItems = items;
            console.log($scope.listedItems)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.soldItems = []


    // AJAX POST TO SERVER for sold items
    var url = "https://localhost:8000/getSoldItemsForUsers";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for SoldItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log("Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
                if (items[i].expired) {
                    items[i].expirationDate = "Lottery has expired!";                     
                }
                else if (items[i].sold) {
                    items[i].expirationDate = items[i].winnerName;
                }
                else if (hours < 0 || days < 0) {
                     items[i].expirationDate = "Negative days remaining (not expired yet)";   
                }
                else {
                    items[i].expirationDate =  hours + " Hours " + days + " Days left";
                }
               // items[i]["src"] = 'data:image/jpeg;base64,' + btoa(items[i].data.data)

                var image = items[i].img;
                if (image == null) {
                    items[i]["src"] = "https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97150&w=320&h=150"
                } 
                else if (items[i].img.compressed != null) {
                    items[i]["src"] = items[i].img.compressed;
                }
                else {
                    var b64 = base64ArrayBuffer(items[i].img.data.data)
                    var dataURL = "data:image/jpeg;base64," + b64;
                    items[i]["src"] = dataURL;
                }
            }
            $scope.soldItems = items;
            console.log($scope.soldItems)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });


    //Start reviews
    $scope.reviews = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviews";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        sellerID: userID
    }
    console.log('Asking for Reviews')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            for (i = 0; i < items.length; i++) {

                var date = new Date(items[i].datePosted)
                var month = date.getMonth();
                var day = date.getDate();
                var year = date.getFullYear();
                var newDate = monthNames[month] + " " + day + ", " + year;
                items[i].datePosted = newDate;
                console.log(newDate);
            }

            $scope.reviews = items;
            console.log($scope.reviews)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.reviewers = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviewerImagesandNames";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Reviewers')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var items = JSON.parse(data)
            $scope.reviewers = items;
            console.log($scope.reviewers)
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });


    serverGet.getAccount(accessToken, $scope);

    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    // var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for account info')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function(data) {
            var account = JSON.parse(data)
            console.log("Here's your account" + account)

            var reviews = account.reviews;
            var length = reviews.length;
            var total = 0;
            var average = 0;
            var averageRounded = 0;
            if (length != 0) {
                var total = 0;
                for (var i = 0; i < length; i++) {
                    total += parseInt(reviews[i].stars);
                }

                var average = total / length;
                var averageRounded = Math.round(average * 10) / 10
            }

            var reviewData = {
                averageRating: averageRounded,
            }

            $scope.reviewData = reviewData;
            $scope.account = account;
            $scope.$apply()
        },
        error: function(response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.targetPost = null;
}

}])
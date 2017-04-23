/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function () {
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

    var url = "https://localhost:8000/updateSettings";

    console.log("updating your settings")

    var userID = localStorage.getItem("curUserID");



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
    }
    else {
        alert("Not a valid email address");
    }
}


var app = angular.module("profile_app", ["ngRoute"])

app.controller("profileController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    $scope.selectedTab = 0

    $scope.bids = []
    $scope.items = []
    $scope.listedItems = []


    var url = "https://localhost:8000/getBidsofUsers";

    // AJAX POST TO SERVER for bids
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Bids')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var bids = JSON.parse(data)
            if (bids.length != 0) {
                $scope.bids = bids;
                console.log($scope.bids)
                $scope.$apply()
            }
            else {
                document.getElementById('BidCount').innerHTML = "No Bids Yet";
            }
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER for bidded items
    var url = "https://localhost:8000/getBiddedItemsofUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Items')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            }
            $scope.items = items;
            console.log($scope.items)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER for listed items
    var url = "https://localhost:8000/getListedItemsForUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for ListedItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            }
            $scope.listedItems = items;
            console.log($scope.listedItems)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.soldItems = []


    // AJAX POST TO SERVER for sold items
    var url = "https://localhost:8000/getSoldItemsForUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for SoldItems')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            for (i = 0; i < items.length; i++) {
                items[i].percentageRaised = (Number(items[i].amountRaised) / Number(items[i].price)) * 100;
                console.log( "Raised" + items[i].percentageRaised);
                var expirationDate = new Date(items[i].expirationDate);
                var date = new Date();
                items[i].expirationDate = DateDiff.inHours(date, expirationDate) + " Hours " + DateDiff.inDays(date, expirationDate) + " Days left";
            }
            $scope.soldItems = items;
            console.log($scope.soldItems)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.reviews = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviews";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        sellerID: userID
    }
    console.log('Asking for Reviews')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
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
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.reviewers = []

    // AJAX POST TO SERVER for reviews
    var url = "https://localhost:8000/getReviewerImagesandNames";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for Reviewers')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            $scope.reviewers = items;
            console.log($scope.reviewers)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });



    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for account info')
    
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var account = JSON.parse(data)
            console.log("Here's your account for another user" + account)



            document.getElementById('profileName').innerHTML = account.fullName;
            document.getElementById('profileImage').src = account.pictureURL;
            document.getElementById('profileImageBackground').src = account.pictureURL;

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

                var average = total/length;
                var averageRounded = Math.round(average*10)/10
            }
            else {
                document.getElementById('averageRating').innerHTML = "No Ratings Yet";
            }

            var account = {
                averageRating : averageRounded,
            }
            
            $scope.account = account;
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });




    $scope.account = []

    // AJAX get TO SERVER for account
    var url = "https://localhost:8000/getAccount";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for account info')
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
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

                var average = total/length;
                var averageRounded = Math.round(average*10)/10
            }

            var reviewData = {
                averageRating : averageRounded,
            }
            
            $scope.reviewData = reviewData;
            $scope.account = account;
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    $scope.targetPost = null;

}])

//Code modified from http://ditio.net/2010/05/02/javascript-date-difference-calculation/
var DateDiff = {

    inHours: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        if (t2 == null || t1 == null) {
            return 0
        }
        return (parseInt((t2 - t1) / (3600 * 1000))) % 24;
    },

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        if (t2 == null || t1 == null) {
            return 0
        }
        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },
}

// -------------------- For Facebook login -----------------------------------------

// Facebook Javascript SDK configuration and setup
window.fbAsyncInit = function() {
    FB.init({
      appId      : '228917890846081',
      xfbml      : true,
      cookie     : true,
      version    : 'v2.8'
  });

    // Check whether the user already logged in
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            //display user data
            displayFBUserData();
        }
        else {
            console.log('Not logged in');
        }
    });
};

// Load the Javascript SDK asynchronously

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src="https://connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


// Fetch the user profile data from facebook
function displayFBUserData(){
    FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,picture'},
        function (response) {
            document.getElementById('profileName').innerHTML = response.first_name + " " + response.last_name;
            document.getElementById('profileImage').src = response.picture.data.url;
            document.getElementById('profileImageBackground').src = response.picture.data.url;
        });
}









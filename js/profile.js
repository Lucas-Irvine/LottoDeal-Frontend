/* JS for the tabs */
$(document).ready(function() {
    $(".btn-pref .btn").click(function () {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        // $(".tab").addClass("active"); // instead of this do the below
        $(this).removeClass("btn-default").addClass("btn-primary");
    });
});

var app = angular.module("profile_app", ["ngRoute"])

app.controller("profileController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    $scope.selectedTab = 0

    $scope.bids = []

    var url = "https://localhost:8000/getBidsofUsers";

    // AJAX POST TO SERVER
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    $.ajax({
        url: url,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var bids = JSON.parse(data)
            $scope.bids = bids;
            console.log($scope.bids)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });

    // AJAX POST TO SERVER
    var url = "https://localhost:8000/getBiddedItemsofUsers";
    var userID = localStorage.getItem("curUserID")
    var dataGET = {
        userID: userID
    }
    console.log('Asking for notifications')
    $.ajax({
        url: notificationUrl,
        data: dataGET,
        type: 'GET',
        success: function (data) {
            var items = JSON.parse(data)
            $scope.items = items;
            console.log($scope.items)
            $scope.$apply()
        },
        error: function (response, error) {
            console.log(response)
            console.log(error)
        }
    });


    $scope.targetPost = null;

}


// For Facebook login

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
            // Get and display the user profile data
            document.getElementById('fbLink').setAttribute("onclick","fbLogout()");
            document.getElementById('fbLink').innerHTML = 'Facebook Logout';
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


            // Save user data
            saveUserData(response);
        });
}






var app = angular.module("item_app", ["serverModule"])

$('#myTabs a').click(function(e) {
    console.log('tab clicked');
    e.preventDefault()
    $(this).tab('show')
});

var sellerID;
var userID;
var accessToken;
var scope;

//Code modified from https://www.w3schools.com/howto/howto_js_tabs.asp
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



app.controller("itemController", ["$scope", "$location", "serverGet", "serverPost", function($scope, $location, serverGet, serverPost) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    scope = $scope;

    window.fbAsyncInit = function() {

        FB.init({
            appId: '228917890846081',
            status: true,
            cookie: true,
            xfbml: true
        });
        FB.getLoginStatus(function(response) {
            userID = response.authResponse.userID;
            sellerID = sellerID;
            // check if user can edit
            if (sellerID == userID) {
                console.log("matches")
                $scope.canEdit = true;

            } else {
                console.log(userID + "cannot edit this post");
            }

            accessToken = response.authResponse.accessToken;
            console.log('setting the access token to: ' + accessToken)
            console.log(response);
            console.log(userID + "saving UserID as a global variable when logging in ")
            getSuggestions();
        });
    };

    (function(d) {
        var js, id = 'facebook-jssdk';
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        d.getElementsByTagName('head')[0].appendChild(js);
    }(document));

    function getSuggestions() {
        serverGet.getSuggestions(accessToken, $scope)
    }


    var itemIDs = [];

    scope.markRead = function() {
        serverGet.markRead(userID, $scope);
    }

    
    // var userid = userID;
    // console.log(userid)

    $scope.canEdit = false;


    $scope.editing = false;

    console.log(accessToken);
    // serverGet.getItem(id, $scope, accessToken);

    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document);
    }

    $scope.deleteItem = function() {
        serverPost.deleteItem(id, accessToken, $scope)
    }

    $scope.editItem = function() {
        // display editable fields

        if ($scope.editing == true) {
            $scope.editing = false;
        } else {
            $scope.editing = true;
        }
    }

    $scope.saveChanges = function() {
        // GET ALL CHANGES AND SEND BACK TO SERVER
    }
}])

function showLoginPopup() {
    $('#loginPopup').modal({
        keyboard: false
    })
};

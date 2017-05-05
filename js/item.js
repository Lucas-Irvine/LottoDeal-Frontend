var userID;
var app = angular.module("app", []);
var scope;

var app = angular.module("item_app", ["serverModule"])

$('#myTabs a').click(function(e) {
    console.log('tab clicked');
    e.preventDefault()
    $(this).tab('show')
});

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

    scope.getSuggestions = function() {
        serverGet.getSuggestions(accessToken, $scope)
    }

    scope.markRead = function() {
        serverGet.markRead(accessToken, $scope);
    }

    $scope.images = []

    scope.getNotifications = function(accessToken) {
        console.log(accessToken + "in get notifications");
        serverGet.getNotifications(accessToken, $scope);
    }


    $scope.bid = function(itemID, amount, amountRaised, price, itemTitle) {
        serverPost.bid(itemID, amount, amountRaised, price, itemTitle, accessToken, $scope, document);
    }

    $scope.deleteItem = function() {
        serverPost.deleteItem(id, accessToken, $scope)
    }

}])

function showLoginPopup() {
    $('#loginPopup').modal({
        keyboard: false
    })
};

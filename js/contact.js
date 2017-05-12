var userID;
var app = angular.module("app", []);
var scope;

var app = angular.module("contact_app", ["serverModule"])

app.controller("contactController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", function($scope, $rootScope, $location, serverGet, serverPost) {

    scope = $scope;
    $scope.selectedTab = 0

    $scope.notificationLength = 0;
    
    scope.getNotifications = function(accessToken) {
        serverGet.getNotifications(accessToken, $scope);
    }

    $scope.images = []

    // mark all the notifications as read
    scope.markRead = function () {
        serverGet.markRead(accessToken, $scope);
    }
}])



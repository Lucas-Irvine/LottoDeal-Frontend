var app = angular.module("about_app", ["serverModule"])
var scope;

app.controller("aboutController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", function($scope, $rootScope, $location, serverGet, serverPost) {

    scope = $scope;
    $scope.selectedTab = 0

    scope.getNotifications = function (userID) {
        serverGet.getNotifications(accessToken, $scope);
    }

    $scope.images = []

// mark all the notifications as read
    scope.markRead = function () {
        serverGet.markRead(accessToken, $scope);
    }
}
]);
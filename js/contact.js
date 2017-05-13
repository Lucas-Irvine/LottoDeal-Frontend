var userID;
var app = angular.module("app", []);
var scope;

var app = angular.module("contact_app", ["serverModule", "utilsModule"])

app.controller("contactController", ["$scope", "$rootScope", "$location", "serverGet", "serverPost", "winnerFunction", function($scope, $rootScope, $location, serverGet, serverPost, winnerFunction) {

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



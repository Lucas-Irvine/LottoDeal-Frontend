var app = angular.module("item_app", ["ngRoute"])

app.controller("itemController", ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    var searchObject = $location.search();
    var id = searchObject['id'];
    console.log(id);

    console.log(searchObject);

    console.log($location.search('id'));
}]) 

